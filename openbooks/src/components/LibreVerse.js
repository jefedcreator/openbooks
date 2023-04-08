import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useEnsName, useSigner } from "wagmi";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useContract, useProvider } from "wagmi";
import "react-toastify/dist/ReactToastify.css";
import openbooksAbi from "../utils/openbooksAbi.json";
import value from "../utils/openbooksAddress.json";

const LibreVerse = ({
  image,
  description,
  genre,
  price,
  index,
  collection,
  collectionName,
}) => {
  const [spin, setSpinner] = useState(false);
  const [copy, setCopy] = useState(false);
  const { data: signer } = useSigner();
  const provider = useProvider();

  const libreVerse = new ethers.Contract(value.address, openbooksAbi, signer);

  const getCopies = async (collection) => {
    const result = await libreVerse.collectionRemains(collection);
    return result;
  };

  const mintHandler = async (collection, bookPrice, name) => {
    try {
      setSpinner(true);
      const tx = await libreVerse.mintCollection(collection, {
        value: bookPrice,
      });
      tx.wait().then(() => {
        getCopies(collection).then((copy) => {
          toast.success(
            <>
              {`minted 1 copy of ${name} succesfully`}
              <a
                href={`https://testnets.opensea.io/assets/mumbai/${collection}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View on opensea
              </a>
            </>
          );
          setCopy(copy);
        });
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSpinner(false);
    }
  };

  useEffect(() => {
    const loadCopy = async () => {
      const copy = await libreVerse.collectionRemains(collection);
      setCopy(copy);
    };
    loadCopy();
  }, [libreVerse]);
  return (
    <div className="w-[48%] h-[50%] md:h-auto md:w-60 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-900 dark:border-gray-700 mt-3 flex flex-col justify-between">
      <img
        className="w-full h-40 object-cover rounded-t-lg transform hover:scale-110 transition duration-300 ease-in-out"
        src={image}
        alt={description}
      />
      <div className="p-3">
        <h5 className="mb-1 text-lg font-semibold tracking-tight text-gray-900 dark:text-white font-book">
          {collectionName}
        </h5>
        <p className="mb-1 text-xs font-normal text-gray-700 dark:text-gray-400 font-book">
          {description}
        </p>
        <p className="mb-1 text-xs font-normal text-gray-700 dark:text-gray-400 font-book">
          #{genre}
        </p>
        <p className="mb-1 text-xs font-normal text-gray-700 dark:text-gray-400 font-book">
          Price: {ethers.utils.formatUnits(price)} MATIC
        </p>
        <p className="mb-1 text-xs font-normal text-gray-700 dark:text-gray-400 font-book">
          copies left:{copy ? copy.toString() : "N/A"}
        </p>
        <button
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => mintHandler(collection, price, collectionName)}
        >
          {spin ? `minting` : `mint`}
        </button>
      </div>
    </div>
  );
};

export default LibreVerse;
