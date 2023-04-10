import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyBooks from "../components/MyBooks";

const Library = ({ mintedLibreVerse, spinner, address, libreVerse}) => {
  const [spin, setSpinner] = useState(false);
  const [myNfts, setMyNfts] = useState([]);
  useEffect(() => {
    if (mintedLibreVerse && mintedLibreVerse.length > 0 && address) {
      const groupedByCollection = mintedLibreVerse.reduce((acc, obj) => {
        if (!acc[obj.collection]) {
          acc[obj.collection] = [];
        }
        acc[obj.collection].push(obj);
        return acc;
      }, {});

      const result = Object.values(groupedByCollection)
        .map((group) => {
          const filteredGroup = group.filter(
            (nft) => nft.collector.toLowerCase() === address.toLowerCase()
          );

          // Find the NFT with the highest balance in each collection
          return filteredGroup.reduce(
            (max, obj) => (obj.balance > max.balance ? obj : max),
            { balance: 0 } // Provide an initial value for the max object with a balance of 0
          );
        })
        .filter(
          (collection) =>
            collection.collector &&
            collection.collector.toLowerCase() === address.toLowerCase()
        );

      setMyNfts(result);
    }
  }, [mintedLibreVerse, address]);

  // const [modal, setModal] = useState(false);
  // const [price, setPrice] = useState(null);

  // const relist = (index, value) => {
  //   return new Promise((resolve, reject) => {
  //     resolve(openbooks.resellBook(index, value));
  //   });
  // };

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

  // const modalHandler = (i) => {
  //   setBookIndex(i);
  //   setModal(true);
  // };

  // const redeem = () => {
  //   return new Promise((resolve, reject) => {
  //     resolve(libreVerse.redeem());
  //   });
  // };

  return (
    <div className="flex flex-col justify-between h-auto">
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
      <h3 className="text-3xl font-bold dark:text-white py-3">Library</h3>
      <div className="h-full flex flex-row flex-wrap md:gap-x-10 justify-between md:justify-start py-5 md:py-0">
        {myNfts.length === 0 ? (
          <div className="h-[20rem] flex justify-center items-center">
            <h1>
              You have no books in your library yet, mint some in the
              marketplace 😉
            </h1>
          </div>
        ) : (
          myNfts.map((book, i) => <MyBooks {...book} key={i} 
          libreVerse={libreVerse}
          />)
        )}
      </div>
    </div>
  );
};

export default Library;
