import { useEffect } from "react";
import { useState } from "react";
import { emitToast } from "./emitToastify";

export default function Escrow({
  chainName,
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
}) {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [explorerPrefix, setExplorerPrefix] = useState("");

  useEffect(() => {
    if (chainName === "Goerli") {
      setExplorerPrefix(process.env.REACT_APP_EXPLORER_URL_GOERLI);
    } else if (chainName === "Sepolia") {
      setExplorerPrefix(process.env.REACT_APP_EXPLORER_URL_SEPOLIA);
    } else {
      setExplorerPrefix(process.env.REACT_APP_EXPLORER_URL_MAINNET);
    }

    return () => {
      setExplorerPrefix("");
    };
  }, [chainName]);

  return (
    <div className="existing-contract border-1 mb-6 break-all rounded-lg border-gray-400 bg-slate-700/50 py-4 px-2">
      <h1 className="pb-1 pl-0.5 text-xl text-blue-400"> Contract Address </h1>
      <a
        href={`${explorerPrefix}address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="pb-1 pl-0.5 text-black hover:text-gray-900"
      >
        {address}
      </a>
      <div className="border-t-2 border-gray-400 pb-6"></div>
      <ul className="fields pl-0.5">
        <li>
          <div className="text-gray-100"> Arbiter </div>
          <div className="rounded-md text-black"> {arbiter} </div>
        </li>
        <li>
          <div className="mt-2 text-gray-100"> Beneficiary </div>
          <div className="rounded-md text-emerald-600"> {beneficiary} </div>
        </li>
        <li>
          <div className="mt-2 text-gray-100"> Value </div>
          <div className="rounded-md text-blue-400"> {value} $TEST</div>
        </li>
        <div
          className={`${
            transactionHash ? "" : "hidden"
          } mt-3 border-t-2 border-gray-400 pb-4`}
        ></div>
        <p className={`${transactionHash ? "text-gray-100" : "hidden"}`}>
          Transaction Hash
        </p>
        <a
          href={`${explorerPrefix}tx/${transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${
            transactionHash ? "text-pink-700 hover:text-pink-500" : "hidden"
          }`}
        >
          {transactionHash}
        </a>
        <div className="mt-1 mb-2 mr-4 flex justify-end">
          <button
            className={`button ${
              buttonClicked
                ? "cursor-not-allowed"
                : "cursor-pointer text-lg text-pink-700 hover:border-transparent hover:bg-pink-700 hover:text-white"
            } rounded-md border-2 border-pink-700 bg-slate-600 px-4 py-1 `}
            id={address}
            disabled={buttonClicked}
            onClick={(e) => {
              e.preventDefault();
              setButtonClicked(true);

              (async () => {
                try {
                  const approveTxn = await handleApprove();
                  setTransactionHash(approveTxn.hash);
                } catch (e) {
                  if (e.message.includes("rejected")) {
                    emitToast("error", "User denied the transaction!");
                  }
                  setButtonClicked(false);
                }
              })();
            }}
          >
            <p className={`button ${buttonClicked ? "hidden" : ""}`}>Approve</p>
            <p className={`button ${buttonClicked ? "" : "hidden"}`}>
              <svg
                aria-hidden="true"
                className="mx-4 my-1 h-6 w-6 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
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
                  fill="rgb(190 24 93)"
                />
              </svg>
            </p>
          </button>
        </div>
      </ul>
    </div>
  );
}
