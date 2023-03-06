const axios = require("axios");
const niceList = require("../utils/niceList.json");
const MerkleTree = require("../utils/MerkleTree");

const serverUrl = "http://localhost:1225";
const merkleTree = new MerkleTree(niceList);
const SEARCG_TARGET = "Merle Fisher";

async function main() {
  // TODO: how do we prove to the server we're on the nice list?
  const index = niceList.findIndex((n) => n === SEARCG_TARGET);
  const proof = merkleTree.getProof(index);

  try {
    const { data: gift } = await axios.post(`${serverUrl}/gift`, {
      // TODO: add request body parameters here!
      proof,
      leaf: SEARCG_TARGET,
    });

    console.log({ gift });
  } catch (e) {
    console.log(e.message);
  }
}

main();
