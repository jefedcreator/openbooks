import React from "react";
import { ToastContainer } from "react-toastify";
import LibreVerse from "../components/LibreVerse";
import "react-toastify/dist/ReactToastify.css";

const Marketplace = ({ allLibreVerse, spinner,            libreVerse}) => {
  // useEffect(() => {
  //     if (allLibreVerse) {
  //       async function loadCopies() {
  //         const copies = await Promise.all(
  //           allLibreVerse.map((book) => book?.collection && getCopies(book.collection))
  //         );
  //         setBookCopies(copies);
  //       }

  //       loadCopies();
  //     }
  //   }, [allLibreVerse]);

  return (
    <div className="flex flex-col justify-between h-auto">
      <ToastContainer />
      <h3 className="text-3xl font-bold dark:text-white md:py-3 py-1">
        Marketplace
      </h3>
      {allLibreVerse.length === 0 ? (
        <h1>Loading...</h1>
      ) : (
        <div className="h-full flex flex-row flex-wrap md:gap-x-10 justify-between md:justify-start py-5 md:py-0">
          {allLibreVerse.map((book, i) => {
            return <LibreVerse {...book} key={i} index={i}             libreVerse={libreVerse}
            />;
          })}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
