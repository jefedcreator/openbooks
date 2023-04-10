import React, { useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LibreVerseContext } from "../utils/libreVerseContext";

const MyBooks = ({ image, description, name, balance, collection, libreVerse}) => {

  // const {libreVerse} = useContext(LibreVerseContext)

  const getBook = () => {
    return new Promise((resolve, reject) => {
      resolve(libreVerse.viewCollectionBook(collection));
    });
  };

  const downloadHandler = () => {
    getBook()
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
  return (
    <div className="w-[48%] h-[50%] md:h-auto md:w-60 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-900 dark:border-gray-700 mt-3 flex flex-col justify-between">
      <img
        className="w-full h-40 object-cover rounded-t-lg transform hover:scale-110 transition duration-300 ease-in-out"
        src={image}
        alt={description}
      />
      <div className="p-3">
        <h5 className="mb-1 text-lg font-semibold tracking-tight text-gray-900 dark:text-white font-book">
          {name}
        </h5>
        <p className="mb-1 text-xs font-normal text-gray-700 dark:text-gray-400 font-book">
          {description}
        </p>
        <p className="mb-1 text-xs font-normal text-gray-700 dark:text-gray-400 font-book">
          copies: {balance}
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
            onClick={downloadHandler}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default MyBooks;
