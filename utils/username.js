const Account = require("../models/account.model");

function normalizeName(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
}

async function generateUniqueUsername(name) {
  const baseUsername = normalizeName(name);
  let username = baseUsername;
  let suffix = 0;

  while (await Account.exists({ username })) {
    suffix++;
    username = baseUsername + suffix;
  }

  return username;
}

module.exports = { normalizeName, generateUniqueUsername };
