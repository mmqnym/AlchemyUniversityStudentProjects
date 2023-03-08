import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState, useRef } from "react";

import logo from "./logo.svg";
import Result from "./Result";
import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [lastestBlockNumber, setBlockNumber] = useState();
  const [blockData, setBlockData] = useState({
    number: "",
    difficulty: "",
    extraData: "",
    gasLimit: "",
    gasUsed: "",
    hash: "",
    logsBloom: "",
    miner: "",
    mixHash: "",
    nonce: "",
    parentHash: "",
    receiptsRoot: "",
    sha3Uncles: "",
    size: "",
    stateRoot: "",
    timestamp: "",
    totalDifficulty: "",
    transactions: [],
    transactionsRoot: "",
    uncles: [],
    baseFeePerGas: "",
  });
  const [OutputData, setOutputData] = useState({
    number: 0,
    extraData: "",
    gasLimit: 0,
    gasUsed: "",
    hash: "",
    miner: "",
    nonce: "",
    parentHash: "",
    receiptsRoot: "",
    size: "",
    stateRoot: "",
    timestamp: "",
    totalDifficulty: "",
    transactionNumber: 0,
    transactionsRoot: "",
    baseFeePerGas: "",
  });

  const [inputLength, setInputLength] = useState(0);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const inputRef = useRef(undefined);
  const buttonRef = useRef(undefined);

  const handleInputChange = (event) => {
    setInputLength(event.target.value.length);
  };

  async function getBlockNumber() {
    try {
      let res = await alchemy.core.getBlockNumber();
      setBlockNumber(res);
    } catch (e) {
      console.error(e.message);
    }
  }

  async function getBlock(blockNumber) {
    try {
      let blockHexStr = `0x${blockNumber.toString(16)}`;
      let res = await alchemy.core.send("eth_getBlockByNumber", [
        blockHexStr,
        true,
      ]);
      setBlockData(res);
    } catch (e) {
      console.error(e.message);
    }
  }

  getBlockNumber();

  useEffect(() => {
    let id = setInterval(() => {
      getBlockNumber();
    }, 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (blockData.number === "") return;

    let searchedBlockNumber = parseInt(blockData.number, 16);
    const getStatus = () => {
      let diff = lastestBlockNumber - searchedBlockNumber;

      if (diff >= 96) {
        return "Finalized";
      } else if (diff >= 12) {
        return "Unfinalized (Safe)";
      } else {
        return "Unfinalized";
      }
    };

    let gasLimit = parseInt(blockData.gasLimit, 16);
    const getGasUsed = () => {
      let gasUsed = parseInt(blockData.gasUsed, 16);
      let ratio =
        Math.round(((gasUsed / gasLimit) * 100 + Number.EPSILON) * 100) / 100;
      return `${gasUsed} (${ratio}%)`;
    };

    let burntFees = `🔥 ${
      (parseInt(blockData.gasUsed, 16) *
        parseInt(blockData.baseFeePerGas, 16)) /
      Math.pow(10, 18)
    } ETH`;

    let date = new Date(parseInt(blockData.timestamp, 16) * 1000);
    let timeformat = `${date.toISOString().slice(0, -5)} UTC`;

    setOutputData({
      height: searchedBlockNumber,
      extraData: blockData.extraData,
      gasLimit: gasLimit,
      gasUsed: getGasUsed(),
      hash: blockData.hash,
      miner: blockData.miner,
      nonce: blockData.nonce,
      parentHash: blockData.parentHash,
      receiptsRoot: blockData.receiptsRoot,
      size: `${parseInt(blockData.size, 16)} bytes`,
      stateRoot: blockData.stateRoot,
      timestamp: timeformat,
      totalDifficulty: blockData.totalDifficulty,
      transactionNumber: blockData.transactions.length,
      transactionsRoot: blockData.transactionsRoot,
      baseFeePerGas: `${
        parseInt(blockData.baseFeePerGas, 16) / Math.pow(10, 9)
      } Gwei`,
      burntFees: burntFees,
      status: getStatus(),
    });
  }, [blockData]);

  return (
    <div className="App">
      <div
        className={`bg-gradient-to-b from-gray-700 to-gray-900 ${
          showResult ? "" : "h-screen"
        }`}
      >
        <div className="flex flex-col items-center">
          <div className="mt-20 block w-3/4 rounded-lg border-2 border-gray-500/75 bg-neutral-800 p-6 shadow-md shadow-gray-300 md:mt-10 xl:w-1/2">
            <div className="mb-8 flex flex-row gap-1">
              <img src={logo} />
              <p className="cursor-default text-left text-3xl text-blue-300">
                Block explorer
              </p>
            </div>
            <form className="flex flex-col items-center gap-2 md:mb-4">
              <div
                className="relative mb-6 w-full md:mb-10"
                data-te-input-wrapper-init
              >
                <input
                  type="number"
                  className={`${
                    inputLength > 0 ? "shadow-md shadow-blue-300" : ""
                  } peer block min-h-[auto] w-full rounded-[5px] border border-gray-500 bg-transparent py-[0.32rem] px-3 leading-[1.6] text-neutral-200 outline-none transition-all duration-200 ease-linear placeholder:text-neutral-200 focus:border-blue-400 focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0`}
                  id="blockNumber"
                  onChange={handleInputChange}
                  placeholder="Block number"
                  ref={inputRef}
                />
                <label
                  htmlFor="blockNumber"
                  className={`${
                    inputLength > 0
                      ? "-translate-y-[0.9rem] scale-[0.8] bg-neutral-800 px-2 text-blue-300"
                      : ""
                  } peer-focus:text-primary pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:bg-neutral-800 peer-focus:px-2 peer-focus:text-blue-400 peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none`}
                >
                  Block number
                </label>
              </div>
              <button
                type="submit"
                className={`${
                  buttonClicked === true ? "relative flex flex-row" : ""
                } rounded border border-gray-500 py-2.5 px-6 text-xs font-medium uppercase text-white shadow-sm shadow-gray-300 transition duration-150 ease-in-out hover:border-transparent hover:bg-gray-300 hover:text-black hover:shadow-lg md:px-8 md:text-sm`}
                onClick={(e) => {
                  e.preventDefault();

                  try {
                    if (!inputRef.current.value) return;

                    let blockNumber = parseInt(inputRef.current.value, 10);

                    if (blockNumber > lastestBlockNumber) {
                      alert("Not valid block number!");
                      return;
                    }
                    setButtonClicked(true);
                    setShowResult(false);

                    (async () => {
                      await getBlock(blockNumber);
                    })();
                  } catch (error) {
                    console.error(error.message);
                  }

                  setTimeout(() => {
                    setButtonClicked(false);
                    setShowResult(true);
                  }, "800");
                }}
                ref={buttonRef}
                data-te-ripple-init
                data-te-ripple-color="light"
              >
                <svg
                  className={`${
                    buttonClicked ? "-left-3 h-3 w-3 md:h-5 md:w-5" : "hidden"
                  } relative animate-spin text-white`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className={`${buttonClicked ? "" : "mx-1.5 md:mx-2.5"}`}>
                  Search
                </span>
              </button>
            </form>
            <div className="absolute top-3 right-4 flex justify-center gap-2 md:static md:justify-end">
              <p className="cursor-default text-blue-300">Current Block:</p>
              <p className="relative top-2 h-2 w-2 rounded-full bg-green-700 md:bg-green-500"></p>
              <p className="text-green-700 md:text-green-500">
                {lastestBlockNumber}
              </p>
            </div>
          </div>
          <div
            className={`mt-6 block w-3/4 border-b-2 border-gray-500 xl:w-1/2 ${
              showResult ? "" : "hidden"
            }`}
          ></div>
          <div
            className={`mt-4 mb-12 block w-3/4 rounded-lg border-2 border-gray-500/75 bg-neutral-800 p-6 shadow-md shadow-gray-300 md:mt-10 xl:w-1/2 ${
              showResult ? "" : "hidden"
            }`}
          >
            <Result
              data={OutputData}
              reference={`https://etherscan.io/block/${OutputData.height}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
