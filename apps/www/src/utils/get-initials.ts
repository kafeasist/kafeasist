export function getInitials(name: string) {
  const [firstName, lastName] = name.split(" ");

  return ((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toLocaleUpperCase();
}
