import React, { useContext, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LibreVerseContext } from "../utils/libreVerseContext";

const Collection = ({ myCollection, profit, libreVerse}) => {
  const [spin, setSpinner] = useState(false);

  // const { libreVerse } = useContext(LibreVerseContext);

  const claimHandler = async () => {
    try {
      setSpinner(true);
      const tx = await libreVerse.redeem();
      tx.wait().then(() => {
        setSpinner(false);
      });
      toast.success("profit redeemed succesfully");
    } catch (error) {
      toast.error("error", error.message);
      setSpinner(false);
    }
  };

  return (
    <div className="flex flex-col justify-between h-auto">
      <div className="flex justify-between items-center">
        <h3 className="text-3xl font-bold dark:text-white py-3">Collections</h3>
        <div className="w-[40%] md:w-[23%] flex flex-col md:flex-row items-center justify-between">
          <h4 className="text-xl font-bold dark:text-white py-3">
            Your profit:
          </h4>
          <button
            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            onClick={claimHandler}
          >
            {profit
              ? !spin
                ? `Claim ${ethers.utils.formatUnits(profit.toString())} MATIC`
                : `Claiming...`
              : `0 MATIC`}
          </button>
        </div>
      </div>

      {myCollection.length === 0 ? (
        <div className="h-[20rem] flex justify-center items-center">
          <h1>You have no created collections yet 😉</h1>
        </div>
      ) : (
        <div className="h-full flex flex-row flex-wrap md:gap-x-10 justify-between md:justify-start py-5 md:py-0">
          {myCollection.map((collection, i) => (
            <div
              className="w-[48%] h-[50%] md:h-auto md:w-60 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-900 dark:border-gray-700 mt-3 flex flex-col justify-between"
              key={i}
            >
              <img
                className="w-full h-40 object-cover rounded-t-lg transform hover:scale-110 transition duration-300 ease-in-out"
                src={collection.image}
                alt={collection.description}
              />
              <div className="p-3">
                <h5 className="mb-1 text-lg font-semibold tracking-tight text-gray-900 dark:text-white font-book">
                  {collection.collectionName}
                </h5>
                <p className="mb-1 text-xs font-normal text-gray-700 dark:text-gray-400 font-book">
                  {collection.description}
                </p>
                <p className="mb-1 text-xs font-normal text-gray-700 dark:text-gray-400 font-book">
                  #{collection.genre}
                </p>
                <p className="mb-1 text-xs font-normal text-gray-700 dark:text-gray-400 font-book">
                  Price: {ethers.utils.formatUnits(collection.price)} MATIC
                </p>
                <p className="mb-1 text-xs font-normal text-gray-700 dark:text-gray-400 font-book">
                  {/* copies left:{copy ? copy.toString() : "N/A"} */}
                </p>
              </div>
            </div>
          ))}{" "}
        </div>
      )}
    </div>
  );
};

export default Collection;
