import type { ActivityStatuses } from "@qc/typescript/typings/UserCredentials";
import { useRef } from "react";

interface TimestampProps extends Omit<React.ComponentProps<"span">, "prefix"> {
  activity: { status?: ActivityStatuses, timestamp?: string };
  prefix?: boolean;
}

function handleTimestamp(date: string, prefix?: boolean) {
  const timestamp = new Date(date),
    currentDate = new Date();

  const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0)),
    startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);

  if (timestamp >= startOfToday) {
    // Timestamp is within today.
    return `${prefix ? "Today at " : ""}${timestamp.toLocaleString("en-CA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false 
    })}`;
  } else if (timestamp >= startOfYesterday && timestamp < startOfToday) {
    // Timestamp is within yesterday.
    return "Yesterday";
  }

  return timestamp.toLocaleDateString("en-CA");
}


export default function Timestamp({ activity, prefix, ...props }: TimestampProps) {
  const timestamp = useRef(
     !activity.timestamp
      ? "Very Long Ago"
      : activity.status === "online"
        ? "Just Now"
        : handleTimestamp(activity.timestamp, prefix)
  );

  return (
    <span className="timestamp" {...props}>
      {prefix ? "Last Seen " : ""}
      <time dateTime={activity.timestamp}>{timestamp.current}</time>
    </span>
  );
}
