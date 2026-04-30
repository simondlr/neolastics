const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
});

export function formatUnixDate(unix: string | number): string {
  const ts = typeof unix === "string" ? parseInt(unix, 10) : unix;
  return formatter.format(new Date(ts * 1000));
}
