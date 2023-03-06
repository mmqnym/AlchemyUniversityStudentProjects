import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { toHex } from "ethereum-cryptography/utils";

function chooseAccount(myAccounts, address) {
  for (let i = 0; i < myAccounts.length; i++) {
    if (myAccounts[i].address === address) {
      return i;
    }
  }

  return -1;
}

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    let myAccounts;

    // Simulation of user use wallets.
    try {
      const res = await server.get("/myaccounts");
      myAccounts = res.data;
    } catch (ex) {
      alert(ex.response.data.message);
    }

    try {
      // Simulation of the user selecting an account in their wallet.
      let accountIdx = chooseAccount(myAccounts, address);
      let privateKey = "";

      if (accountIdx !== -1) {
        privateKey = myAccounts[accountIdx].privateKey;
      } else {
        alert("Not valid wallet!");
        return;
      }

      // Simulation of signature a transaction
      let hashMsg = keccak256(
        utf8ToBytes(`sender: ${address},
        amount: ${sendAmount},
        ${recipient}`)
      );

      let [signature, recoveryBit] = await secp.sign(hashMsg, privateKey, {
        recovered: true,
      });

      hashMsg = toHex(hashMsg);
      signature = toHex(signature);

      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        hashMsg,
        signature,
        recoveryBit,
      });

      setBalance(balance);
      alert("Sent successfully!");
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
