export interface CreateUserParams {
  email: string;
  password: string;
  role?: 'member|admin|manager';
}
export interface GetUserQueryParams {
  search: string;
  role?: 'member|admin|manager';
}

export interface ProfileParams {
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
