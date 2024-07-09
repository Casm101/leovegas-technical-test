export interface JwtDecyptedUserToken {
  id: string;
  role: 'ADMIN' | 'USER';
};