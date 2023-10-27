export class SigninDto {
  email: string;
  password: string;
}

export class SignupDto {
  email: string;
  username?: string;
  password: string;
}

export class ChangePasswordDto {
  email: string;
  oldPassword: string;
  password: string;
}

export class RefreshTokenDto {
  token: string;
}
