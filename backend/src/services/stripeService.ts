import usersRepository from "src/db/repositories/usersRepository";
import { ApiError } from "src/errors/apiError";
import getEnv from "src/utils/getEnv";
import Stripe from "stripe";

class StripeService {
  private stripe = new Stripe(getEnv("STRIPE_SECRET_KEY") as string, {
    apiVersion: "2022-11-15",
  });

  cancelSubscription = async (userId: string) => {
    const subscriber = await usersRepository.isSubscriber(userId);
    if (!subscriber) {
      throw ApiError.NotFound("Subscriber");
    }
    const { stripeSubId } = subscriber;
    await this.stripe.subscriptions.cancel(stripeSubId);
  };
}

const stripeService = new StripeService();
export default stripeService;
