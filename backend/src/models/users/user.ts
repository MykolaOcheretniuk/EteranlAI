export interface UserUpdate {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface UserModel {
  name: string | null;
  email: string;
  phoneNumber: string | null;
  subscriptionInfo: {
    nextPaymentDate: string;
  } | null;
}
