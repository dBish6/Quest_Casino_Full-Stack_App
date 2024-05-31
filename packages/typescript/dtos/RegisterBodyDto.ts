export default interface RegisterBodyDto {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  con_password: string;
  country?: string | null;
  region?: string | null;
  phone_number?: string | null;
  calling_code?: string | null;
}
