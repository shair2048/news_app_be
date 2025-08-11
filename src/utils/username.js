import Account from "../models/account.model.js";

export function normalizeName(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .replace(/[^\da-z]/g, "");
}
export async function generateUniqueUsername(name) {
  const baseUsername = normalizeName(name);
  let username = baseUsername;
  let suffix = 0;

  while (
    await Account.exists({
      username,
    })
  ) {
    suffix++;
    username = baseUsername + suffix;
  }

  return username;
}
