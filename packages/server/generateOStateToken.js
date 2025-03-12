import { randomUUID } from "crypto";
import { hashSync } from "bcryptjs";

export function generateOStateToken() {
  const oStateToken = randomUUID();
  return { original: oStateToken, secret: hashSync(oStateToken, 6) };
}
