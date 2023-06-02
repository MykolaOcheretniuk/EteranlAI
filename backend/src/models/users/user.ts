export interface UserUpdate {
  name: string | null;
  email: string;
  phoneNumber: string | null;
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
