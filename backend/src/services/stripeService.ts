import usersRepository from "src/db/repositories/usersRepository";
import { ApiError } from "src/errors/apiError";
import { Card } from "src/models/card";
import getEnv from "src/utils/getEnv";
import getSubscriber from "src/utils/getSubscriber";
import Stripe from "stripe";

class StripeService {
  private stripe = new Stripe(getEnv("STRIPE_SECRET_KEY") as string, {
    apiVersion: "2022-11-15",
  });
  private createCardPaymentMethod = async (card: Card) => {
    return await this.stripe.paymentMethods.create({
      type: "card",
      card: card,
    });
  };
  private createStripeCustomer = async (
    userEmail: string,
    userName: string
  ) => {
    return await this.stripe.customers.create({
      email: userEmail,
      name: userName as string,
    });
  };
  private setPaymentMethod = async (
    paymentMethodId: string,
    stripeCustomerId: string
  ) => {
    await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    });
    await this.stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
  };
  cancelSubscription = async (userId: string) => {
    const { stripeSubId } = await getSubscriber(userId);
    await this.stripe.subscriptions.cancel(stripeSubId);
  };
  getSubscriptionStatus = async (userId: string) => {
    const { stripeSubId, stripeCustomerId } = await getSubscriber(userId);
    const subscribes = await this.stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "all",
    });
    return subscribes.data.find((sub) => sub.id === stripeSubId)?.status;
  };
  updateCustomer = async (userId: string, newEmail: string, name: string) => {
    const { stripeCustomerId } = await getSubscriber(userId);
    await this.stripe.customers.update(stripeCustomerId, {
      email: newEmail,
      name: name,
    });
  };

  updatePaymentMethod = async (userId: string, card: Card) => {
    const { stripeCustomerId } = await getSubscriber(userId);
    const { id: paymentMethodId } = await this.createCardPaymentMethod(card);
    const { data: paymentMethods } = await this.stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: "card",
    });
    paymentMethods.forEach(async (paymentMethod) => {
      await this.stripe.paymentMethods.detach(paymentMethod.id);
    });
    await this.setPaymentMethod(paymentMethodId, stripeCustomerId);
  };
  subscribeUser = async (userId: string, card: Card) => {
    const user = await usersRepository.getById(userId);
    if (!user) {
      throw ApiError.NotFound("User");
    }
    const isSubscriber = await usersRepository.isSubscriber(userId);
    if (isSubscriber) {
      throw ApiError.AlreadyExists("Subscriber");
    }
    let { email, name } = user;
    if (!name) {
      name = email;
    }
    const { id: customerId } = await this.createStripeCustomer(email, name);
    const { id: paymentMethodId } = await this.createCardPaymentMethod(card);
    const priceId = getEnv("STRIPE_PRICE_ID");
    await this.setPaymentMethod(paymentMethodId, customerId);
    await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
    });
  };
}

const stripeService = new StripeService();
export default stripeService;
