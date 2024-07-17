export type ServerNotificationTypes = "news" | "system" | "general";

export interface ServerNotification {
  title?: string
  text: string;
  link?: { sequence: string; to: string };
}
