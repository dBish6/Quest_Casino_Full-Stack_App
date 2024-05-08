export default interface UserCredentials {
  type: "standard" | "google";
  legalName: { first: string; last: string };
  username: string;
  email: string;
  country: string;
  state?: string;
  phoneNumber?: string;
}
