const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function toDate(unix: string | number): Date {
  const ts = typeof unix === "string" ? parseInt(unix, 10) : unix;
  return new Date(ts * 1000);
}

// "Dec 14, 2020, 03:12 PM EST"
export function formatUnixDate(unix: string | number): string {
  return dateTimeFormatter.format(toDate(unix));
}

// "Dec 14, 2020"
export function formatUnixDay(unix: string | number): string {
  return dateFormatter.format(toDate(unix));
}
