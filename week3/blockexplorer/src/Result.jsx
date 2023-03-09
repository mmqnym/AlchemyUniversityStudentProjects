import finalizeSvg from "./finalize.svg";
import safeSvg from "./safe.svg";
import unFinalizeSvg from "./unfinalized.svg";

function Result({ data, reference }) {
  return (
    <div className="w-full">
      <table className="w-full table-fixed">
        <tbody>
          <tr className="md:text-md text-sm">
            <td className="break-words px-4 py-2 text-gray-300">
              Block Height:
            </td>
            <td className="px-4 py-2 text-white">{data.height}</td>
          </tr>
          <tr className="md:text-md text-sm">
            <td className="break-words px-4 py-2 text-gray-300">Status:</td>
            <td
              className={`px-4 py-2 ${
                data.status === "Finalized"
                  ? "text-green-700"
                  : data.status === "Unfinalized (Safe)"
                  ? "text-blue-400"
                  : "text-gray-400"
              }`}
            >
              <div className="flex flex-row">
                <p>{data.status}</p>
                <img
                  src={finalizeSvg}
                  className={`ml-1 ${
                    data.status === "Finalized" ? "" : "hidden"
                  }`}
                />
                <img
                  src={safeSvg}
                  className={`ml-1 ${
                    data.status === "Unfinalized (Safe)" ? "" : "hidden"
                  }`}
                />
                <img
                  src={unFinalizeSvg}
                  className={`ml-1 ${
                    data.status === "Unfinalized" ? "" : "hidden"
                  }`}
                />
              </div>
            </td>
          </tr>
          <tr className="md:text-md text-sm">
            <td className="break-words px-4 py-2 text-gray-300">Timestamp:</td>
            <td className="break-words px-4 py-2 text-white">
              {data.timestamp}
            </td>
          </tr>
          <tr className="md:text-md text-sm">
            <td className="break-words px-4 py-2 text-gray-300">
              Transactions:
            </td>
            <td className="break-words px-4 py-2 text-white">
              {data.transactionNumber}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="my-2 w-full border-b border-gray-400"></div>
      <table className="w-full table-fixed">
        <tbody>
          <tr className="md:text-md text-sm">
            <td className="break-words px-4 py-2 text-gray-300">Miner:</td>
            <td className="break-all px-4 py-2 text-white">{data.miner}</td>
          </tr>
          <tr className="md:text-md text-sm">
            <td className="break-words px-4 py-2 text-gray-300">
              Total Difficulty:
            </td>
            <td className="break-all px-4 py-2 text-white">
              {data.totalDifficulty}
            </td>
          </tr>
          <tr className="md:text-md text-sm">
            <td className="break-words px-4 py-2 text-gray-300">Size:</td>
            <td className="break-all px-4 py-2 text-white">{data.size}</td>
          </tr>
        </tbody>
      </table>
      <div className="my-2 w-full border-b border-gray-400"></div>
      <table className="w-full table-fixed">
        <tbody>
          <tr className="md:text-md text-sm">
            <td className="break-words px-4 py-2 text-gray-300">Gas Used:</td>
            <td className="break-all px-4 py-2 text-white">{data.gasUsed}</td>
          </tr>
          <tr className="md:text-md text-sm">
            <td className="break-words px-4 py-2 text-gray-300">Gas Limit:</td>
            <td className="break-all px-4 py-2 text-white">{data.gasLimit}</td>
          </tr>
          <tr className="md:text-md text-sm">
            <td className="break-words px-4 py-2 text-gray-300">
              Base Fee Per Gas:
            </td>
            <td className="break-all px-4 py-2 text-white">
              {data.baseFeePerGas}
            </td>
          </tr>
          <tr className="md:text-md text-sm">
            <td className="break-words px-4 py-2 text-gray-300">Burnt Fees:</td>
            <td className="break-all px-4 py-2 text-white">{data.burntFees}</td>
          </tr>
          <tr className="md:text-md text-sm">
            <td className="break-words px-4 py-2 text-gray-300">Extra Data:</td>
            <td className="break-all px-4 py-2 text-white">{data.extraData}</td>
          </tr>
        </tbody>
      </table>
      <div className="my-2 w-full border-b border-gray-400"></div>
      <table className="w-full table-fixed">
        <tbody>
          <tr className="md:text-md text-sm">
            <td className="break-words px-4 py-2 text-gray-300">Hash:</td>
            <td className="break-all px-4 py-2 text-white">{data.hash}</td>
          </tr>
          <tr className="md:text-md text-sm">
            <td className="break-words px-4 py-2 text-gray-300">
              Parent Hash:
            </td>
            <td className="break-all px-4 py-2 text-white">
              {data.parentHash}
            </td>
          </tr>
          <tr className="md:text-md text-sm">
            <td className="break-words px-4 py-2 text-gray-300">
              Base Fee Per Gas:
            </td>
            <td className="break-all px-4 py-2 text-white">
              {data.baseFeePerGas}
            </td>
          </tr>
          <tr className="md:text-md text-sm">
            <td className="break-words px-4 py-2 text-gray-300">StateRoot:</td>
            <td className="break-all px-4 py-2 text-white">{data.stateRoot}</td>
          </tr>
          <tr className="md:text-md text-sm">
            <td className="break-words px-4 py-2 text-gray-300">Nonce:</td>
            <td className="break-all px-4 py-2 text-white">{data.nonce}</td>
          </tr>
        </tbody>
      </table>
      <div className="my-2 w-full border-b border-gray-400"></div>
      <table className="w-full table-fixed">
        <tbody>
          <tr className="md:text-md text-sm">
            <td className="break-words px-4 py-2 text-gray-300">Reference:</td>
            <td className="break-all px-4 py-2 text-blue-400 hover:text-blue-300">
              <a href={reference} target="_blank">
                Check here
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Result;
