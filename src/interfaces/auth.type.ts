export type SigninParams = {
  email: string;
  password: string;
};

export type SignupParams = {
  email: string;
  password: string;
};

export type ChangePasswordParams = {
  email: string;
  oldPassword: string;
  password: string;
};

export class RefreshTokenParams {
  token: string;
}
