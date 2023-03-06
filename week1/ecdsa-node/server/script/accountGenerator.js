const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const fs = require("fs");
const generateAccounts = require("./initConfig");

const accounts = [generateAccounts];

for (let i = 0; i < generateAccounts; i++) {
  const privateKey = secp.utils.randomPrivateKey();
  const publicKey = secp.getPublicKey(privateKey);
  const address = keccak256(publicKey.slice(1)).slice(-20);

  accounts[i] = {
    privateKey: toHex(privateKey),
    publicKey: toHex(publicKey),
    address: toHex(address),
  };
}

const data = JSON.stringify(accounts, null, 2);

fs.writeFile("../wallet/accounts.json", data, (err) => {
  if (err) {
    throw err;
  }
});

console.log("Accounts have been successfully created.");
console.log("=== Please copy and paste the following into index.js ===");
for (let i = 0; i < generateAccounts; i++) {
  console.log(
    `balances["${accounts[i].address}"] = ${Math.floor(Math.random() * 101)};`
  );
}
