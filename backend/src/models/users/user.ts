export interface UserUpdate {
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  password: string | null;
}

export interface UserModel {
  name: string | null;
  email: string;
  phoneNumber: string | null;
  subscriptionInfo: {
    nextPaymentDate: string;
  } | null;
}
