export default interface RegisterRequestDto {
  type: "standard" | "google";
  legal_name: { first: string; last: string };
  username?: string;
  email?: string;
  password?: string;
  country?: string;
  state?: string;
  phone_number?: string;
}
