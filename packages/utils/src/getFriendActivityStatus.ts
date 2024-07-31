export type ActivityStatuses = "online" | "away" | "offline";

const ACTIVITY_THRESHOLD = 1000 * 60 * 6; // 6 Minutes

export function getUserActivityStatus(timestamp: Date | null, verificationToken: string | undefined): ActivityStatuses {
  const currentTime = Date.now();
  let status = "offline";

  // Defaulted to offline when they're not verified. They shouldn't be able to do anything when they are not verified.
  if (timestamp && verificationToken) {
    const lastActivity = new Date(timestamp).getTime();

    if (currentTime - lastActivity <= ACTIVITY_THRESHOLD) {
      status = "online";
    } else {
      status = "away";
    }
  }

  return status as ActivityStatuses;
}
