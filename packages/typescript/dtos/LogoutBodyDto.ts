export default interface LoginBodyDto {
  username: string;
  /** When true it logs out no matter what even if the logic fails. */
  lax?: boolean;
}
