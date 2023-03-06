const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const walletData = require("./wallet/accounts.json");
const secp = require("ethereum-cryptography/secp256k1");

app.use(cors());
app.use(express.json());

const balances = {};

// *** Please paste the content from accountGenerator.js ***
balances["f923f0cc3eda052bdae8fdfbf8f85ce54453cbcc"] = 70;
balances["baa58ef2d7c8b3f832877eb4c3b633acebdf6e8f"] = 78;
balances["c22b1538aa1bc7087513a9604ef8b070975169ad"] = 84;
// *** Please paste the content from accountGenerator.js ***

// Simulation of user use wallets.
app.get("/myaccounts", (req, res) => {
  res.send(walletData);
});

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, hashMsg, signature, recoveryBit } =
    req.body;

  // Nonexistent account.
  setInitialBalance(sender);
  setInitialBalance(recipient);

  // Verify sender is valid.
  const publicKey = secp.recoverPublicKey(hashMsg, signature, recoveryBit);

  if (!secp.verify(signature, hashMsg, publicKey)) {
    res.status(400).send({ message: "Invalid transaction!" });
    return;
  }

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
