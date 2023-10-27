export class CreateUserDto {
  email: string;
  username: string;
  password: string;
  role?: 'member|admin|manager';
}
export class GetUserQueryDto {
  search: string;
  role?: 'member|admin|manager';
}
export class ChangePasswordDto {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export class ProfileDto {
  id: number;
  profileId: number;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  phone?: string;
  address?: string;
}
