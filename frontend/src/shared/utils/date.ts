function parseDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

export function formatCalendarDate(
  value: string | null | undefined,
  fallback = "Unknown",
) {
  const parsedDate = parseDate(value);
  if (!parsedDate) {
    return fallback;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(parsedDate);
}

export function formatCalendarDateTime(
  value: string | null | undefined,
  fallback = "Unknown",
) {
  const parsedDate = parseDate(value);
  if (!parsedDate) {
    return fallback;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

export function formatMonthDay(
  value: string | null | undefined,
  fallback = "Unknown",
) {
  const parsedDate = parseDate(value);
  if (!parsedDate) {
    return fallback;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(parsedDate);
}
