export default interface RegisterRequestDto {
  type: "standard" | "google";
  legalName: { first: string; last: string };
  username?: string;
  email?: string;
  password?: string;
  country?: string;
  state?: string;
  phoneNumber?: string;
}
