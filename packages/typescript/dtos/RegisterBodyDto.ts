export default interface RegisterBodyDto {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  country: string;
  region?: string;
  phone_number?: string;
}
