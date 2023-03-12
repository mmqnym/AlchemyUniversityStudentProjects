import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  try {
    const approveTxn = await escrowContract.connect(signer).approve();
    await approveTxn.wait();
    return approveTxn;
  } catch (e) {
    console.error(e.message);
  }
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    setButtonClicked(true);
    try {
      const beneficiary = document.getElementById("beneficiary").value;
      const arbiter = document.getElementById("arbiter").value;
      const etherValue = document.getElementById("etherAmount").value;
      const value = ethers.utils.parseEther(etherValue);
      console.log(signer, arbiter, beneficiary, value);
      const escrowContract = await deploy(signer, arbiter, beneficiary, value);

      await escrowContract.deployTransaction.wait();

      const escrow = {
        address: escrowContract.address,
        arbiter,
        beneficiary,
        value: etherValue,
        handleApprove: async () => {
          escrowContract.on("Approved", () => {
            document.getElementById(escrowContract.address).className =
              "complete";
            document.getElementById(escrowContract.address).innerText =
              "✓ It's been approved! hello";
          });

          const approveTxn = await approve(escrowContract, signer);
          return approveTxn;
        },
      };

      setEscrows([...escrows, escrow]);
    } catch (e) {
      console.error(e.message);

      if (e.message.includes("rejected")) {
        console.log("User denide the transaction!");
      }
    } finally {
      setButtonClicked(false);
    }
  }

  return (
    <div className="bg-gray-800 w-full bg-cover absolute flex flex-row gap-10 justify-evenly items-start min-h-screen">
      <div className="mt-60 contract flex flex-col border-2 rounded-lg border-gray-400 p-4 shadow-md shadow-gray-300 bg-slate-600 w-1/5">
        <h1 className="text-2xl pb-2 text-blue-400"> New Contract </h1>
        <div className="border-t-2 pb-6 border-gray-400"></div>
        <div className="flex flex-col group px-2">
          <label className="text-gray-100 group-focus-within:text-violet-300">
            Arbiter Address
          </label>
          <input
            type="text"
            id="arbiter"
            className="bg-slate-700/50 rounded-md py-0.5 mt-2 focus:ring focus:ring-violet-300 focus:outline-none px-2 text-blue-400"
          />
        </div>
        <div className="flex flex-col group mt-4 px-2">
          <label className="text-gray-100 group-focus-within:text-violet-300">
            Beneficiary Address
          </label>
          <input
            type="text"
            id="beneficiary"
            className="bg-slate-700/50 rounded-md py-0.5 mt-2 focus:ring focus:ring-violet-300 focus:outline-none px-2 text-blue-400"
          />
        </div>

        <div className="flex flex-col group mt-4 px-2">
          <label className="text-gray-100 group-focus-within:text-violet-300">
            Deposit Amount
          </label>
          <input
            type="text"
            id="etherAmount"
            className="bg-slate-700/50 rounded-md py-0.5 mt-2 focus:ring focus:ring-violet-300 focus:outline-none px-2 text-blue-400"
          />
        </div>

        <div className="flex justify-center mt-6 mb-2">
          <button
            className={`button ${
              buttonClicked
                ? "cursor-not-allowed"
                : "cursor-pointer text-blue-400 text-lg hover:text-white hover:bg-blue-500 hover:border-transparent"
            } bg-slate-600 px-4 py-1 mt-4 rounded-md border-2 border-blue-200`}
            id="deploy"
            disabled={buttonClicked}
            onClick={(e) => {
              e.preventDefault();
              newContract();
            }}
          >
            <p className={`button ${buttonClicked ? "hidden" : ""}`}>Deploy</p>
            <p className={`button ${buttonClicked ? "" : "hidden"}`}>
              <svg
                aria-hidden="true"
                className="w-6 h-6 mx-4 my-1 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="white"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="rgb(96 165 250)"
                />
              </svg>
            </p>
          </button>
        </div>
      </div>

      <div
        className={`${
          escrows.length === 0 ? "hidden" : ""
        } mt-60 existing-contracts flex flex-col border-2 rounded-lg border-gray-400 p-4 shadow-md shadow-gray-300 bg-slate-600 w-1/4 mb-20 max-h-[70vh] overflow-y-auto`}
      >
        <h1 className="text-2xl pb-2 text-blue-400"> Existing Contracts </h1>
        <div className="border-t-2 pb-6 border-gray-400"></div>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
