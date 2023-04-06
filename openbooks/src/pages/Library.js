import React, { useState } from "react";
import Spinner from "../components/Spinner";
import { ToastContainer, toast } from "react-toastify";
import openbooksAbi from "../utils/openbooksAbi.json";
import value from "../utils/openbooksAddress.json";
import { ethers } from "ethers";
import "react-toastify/dist/ReactToastify.css";
import { useSigner } from "wagmi";
import Modal from "../components/Modal";
import { BigNumber } from "bignumber.js";
// import { BigNumber } from "@ethersproject/bignumber";

const Library = ({ myNfts, spinner, profit }) => {
  console.log("myNfts",myNfts);
  const [spin, setSpinner] = useState(false);
  const [modal, setModal] = useState(false);
  const [price, setPrice] = useState(null);
  const [bookIndex, setBookIndex] = useState(null);
  const { data: signer } = useSigner();
  const libreVerse = new ethers.Contract(value.address, openbooksAbi, signer);

  // const relist = (index, value) => {
  //   return new Promise((resolve, reject) => {
  //     resolve(openbooks.resellBook(index, value));
  //   });
  // };

  const getBook = (collection) => {
    return new Promise((resolve, reject) => {
      resolve(libreVerse.viewCollectionBook(collection));
    });
  };

  const downloadHandler = (collection) => {
    getBook(collection)
      .then((book) => downloadFile(book))
      .catch((err) => toast.error(err.message));
  };

  const downloadFile = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", true);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // const relistHandler = async () => {
  //   try {
  //     setSpinner(true);
  //     // let value = await book(index)
  //     console.log(parseInt(bookIndex), "price:", parseInt(price));
  //     const tx = await relist(parseInt(bookIndex), price);
  //     tx.wait();
  //     toast.success("book relisted succesfully");
  //   } catch (error) {
  //     console.log("error", error.message);
  //   } finally {
  //     setSpinner(false);
  //     setPrice(null);
  //     setBookIndex(null);
  //     setModal(false);
  //   }
  // };

  const modalHandler = (i) => {
    setBookIndex(i);
    setModal(true);
  };

  const redeem = () => {
    return new Promise((resolve, reject) => {
      resolve(libreVerse.redeem());
    });
  };

  const claimHandler = async () => {
    try {
      setSpinner(true);
      const tx = await redeem();
      tx.wait();
      toast.success("profit redeemed succesfully");
    } catch (error) {
      console.log("error", error.message);
    } finally {
      setSpinner(false);
    }
  };

  return (
    <div className="flex flex-col justify-between h-3/4 relative w-full">
      {/* {modal && (
        <Modal
          setModal={setModal}
          setPrice={setPrice}
          price={price}
          relistHandler={relistHandler}
        />
      )} */}
      {spin && <Spinner />}
      <ToastContainer />
      <div className="flex justify-between">
        <h3 className="text-3xl font-bold dark:text-white py-3">Library</h3>
        <button
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          onClick={claimHandler}
        >
          {profit
            ? `Claim ${ethers.utils.formatEther(new BigNumber(profit).toString())} MATIC`
            : `0 MATIC`}
        </button>
      </div>
      <div className='h-full flex flex-row flex-wrap gap-x-10'>
        {myNfts.map((book, i) => {
          return (
            <div
              className="w-60 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-900 dark:border-gray-700 mt-3"
              key={i}
            >
              <img
                className="w-full h-40 object-cover rounded-t-lg"
                src={book?.image}
                alt={book?.description}
              />
              <div className="p-3">
                <h5 className="mb-1 text-lg font-semibold tracking-tight text-gray-900 dark:text-white font-book">
                  {book?.name}
                </h5>
                <p className="mb-1 text-xs font-normal text-gray-700 dark:text-gray-400 font-book">
                  {book?.description}
                </p>
                <p className="mb-1 text-xs font-normal text-gray-700 dark:text-gray-400 font-book">
                 copies: {book?.balance}
                </p>
                <div className="w-full flex justify-between">
                  {/* <a
                    href="#"
                    onClick={() => modalHandler(i)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Relist
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4 ml-2 -mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </a> */}
                  <a
                    href="#"
                    onClick={() => downloadHandler(book.collection)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Library;
