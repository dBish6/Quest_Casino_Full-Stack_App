import type { User, UserToClaims } from "@authFeat/typings/User";

export default function formatUserToClaims(user: User): UserToClaims {
  return {
    _id: user._id,
    member_id: user.member_id,
    legal_name: user.legal_name,
    username: user.username,
    email: user.email,
    email_verified: user.email_verified,
    country: user.country,
    region: user.region,
    phone_number: user.phone_number
  };
}
