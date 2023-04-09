import React from "react";
import { create } from "ipfs-http-client";
import openbooksAbi from "../utils/openbooksAbi.json";
import value from "../utils/openbooksAddress.json";
import { ethers } from "ethers";
import { useState, useRef } from "react";
import { useSigner } from "wagmi";
import { ToastContainer, toast } from "react-toastify";
import WebViewer from "@pdftron/webviewer";
import "react-toastify/dist/ReactToastify.css";

const Mint = () => {
  const { data: signer } = useSigner();
  const viewerRef = useRef(null);

  const [bookDetail, setBookDetail] = useState({
    cover: null,
    bookFile: null,
    coverFile: null,
    price: 0,
    thumbnail: null,
    genre: "",
    description: "",
    name: "",
    symbol: "",
    copies: "",
  });

  const [spinner, setSpinner] = useState(false);

  const authorization =
    "Basic " +
    btoa(
      process.env.REACT_APP_PROJECT_ID +
        ":" +
        process.env.REACT_APP_PROJECT_SECRET
    );

  const libreVerse = new ethers.Contract(value.address, openbooksAbi, signer);

  let ipfs;

  try {
    ipfs = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: authorization,
      },
    });
  } catch (error) {
    console.error("IPFS error ", error);
    ipfs = undefined;
  }

  const isFormFilled = () => {
    return !(bookDetail.cover && bookDetail.description && bookDetail.price);
  };

  const onChangeCoverHandler = async (e) => {
    try {
      const form = e.target;
      const files = form.files;
      if (!files || files.length === 0) {
        alert("No files selected");
        return toast.error("error selecting file");
      }
      toast.success("book cover selected succesfully");
      const file = files[0];
      // const imageFile = e.target.files[0];
      if (!file) return;
      setBookDetail((book) => {
        return {
          ...book,
          coverFile: file,
        };
      });
      // setFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        setBookDetail((book) => {
          return {
            ...book,
            cover: event.target.result,
          };
        });
      };
      reader.readAsDataURL(file);
      // upload files
      // const result = await (ipfs).add(file);

      // setCover("https://jefedcreator.infura-ipfs.io/ipfs/" + result.path)
    } catch (error) {
      toast.error("error uploading cover to ipfs");
    }
  };

  // console.log("is form filled:", isFormFilled());

  const onChangeBookHandler = async (e) => {
    try {
      const form = e.target;
      const files = form.files;
      const file = files[0];
      if (!files || files.length === 0) {
        return toast.error("error selecting file");
      }
      toast.success("book file selected succesfully");
      await initializeWebViewer(file);
      // const result = await (ipfs).add(file);
      setBookDetail((book) => {
        return {
          ...book,
          bookFile: file,
        };
      });

      // setBook("https://jefedcreator.infura-ipfs.io/ipfs/" + result.path)
    } catch (error) {
      toast.error("error uploading to ipfs");
    }
  };

  const initializeWebViewer = async (file) => {
    if (!file) return;

    const instance = await WebViewer(
      {
        path: "/webviewer",
        disabledElements: [
          "header",
          "toolsHeader",
          "viewControlsElement",
          "documentContainer",
          "textPopup",
        ],
      },
      viewerRef.current
    );

    const { createDocument } = instance.Core;
    // const doc = documentViewer.getDocument();
    instance.UI.disableElements([
      "header",
      "toolsHeader",
      "viewControlsElement",
      "documentContainer",
      "textPopup",
      "viewControlsOverlay",
    ]);
    const pageNumber = 2;

    const doc = await createDocument(file, { extension: "pdf" });
    doc.loadCanvasAsync({
      pageNumber,
      drawComplete: (thumbnail) => {
        setBookDetail((book) => {
          return {
            ...book,
            thumbnail: thumbnail,
          };
        });
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookDetail((book) => {
      return {
        ...book,
        [name]: value,
      };
    });
  };
  // console.log("price", ethers.utils.parseUnits(new BigNumber(bookDetail.price).toString()));
  function validateProperties(obj) {
    const properties = [
      "cover",
      "bookFile",
      "coverFile",
      "price",
      "thumbnail",
      "genre",
      "description",
      "name",
      "symbol",
      "copies",
    ];

    for (const property of properties) {
      if (obj[property] === null || obj[property] === "") {
        throw new Error(`The property '${property}' cannot be null or empty.`);
      }
    }
  }

  const mintBook = async (e) => {
    e.preventDefault();
    try {
      validateProperties(bookDetail);
      setSpinner(true);
      const coverIpfsUrl = await ipfs.add(bookDetail.coverFile);
      let data = JSON.stringify({
        name: bookDetail.name,
        description: bookDetail.description,
        image: `https://jefedcreator.infura-ipfs.io/ipfs/${coverIpfsUrl.path}`,
        // owner: address,
      });
      const getUri = await ipfs.add(data);
      let uri = `ipfs://${getUri.path}`;
      toast.success("Book uri Uploaded to ipfs succesfully");
      const bookIpfsUrl = await ipfs.add(bookDetail.bookFile);
      let bookUri = `https://jefedcreator.infura-ipfs.io/ipfs/${bookIpfsUrl.path}`;
      toast.success("Book file Uploaded to ipfs succesfully");
      const mintFee = ethers.utils.parseEther("0.001");
      // console.log("price", price);
      // console.log("book", book);
      let tx = await libreVerse.createCollection(
        bookDetail.name,
        bookDetail.symbol,
        uri,
        bookUri,
        bookDetail.genre,
        bookDetail.copies,
        ethers.utils.parseUnits(bookDetail.price),
        {
          value: mintFee,
        }
      );
      let reciept = await tx.wait();
      toast.success("mint successful");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSpinner(false);
      setBookDetail({
        cover: null,
        bookFile: null,
        coverFile: null,
        price: "",
        thumbnail: null,
        genre: "",
        description: "",
        name: "",
        symbol: "",
        copies: "",
      });
    }
  };

  return (
    <div className="flex flex-col justify-between md:h-3/4 h-full gap-y-10 md:gap-y-0">
      <ToastContainer />
      {ipfs && (
        <>
          <h4 className="text-2xl font-bold dark:text-white p-y-10">
            Create collection
          </h4>
          <form onSubmit={mintBook}>
            <div className="flex flex-col md:flex-row justify-between">
              {bookDetail.cover ? (
                <div className="flex items-center justify-center w-full md:w-[48%]">
                  <img
                    src={bookDetail.cover}
                    alt="Image preview"
                    className="flex items-center justify-center w-full object-contain h-64"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-full md:w-[48%]">
                  <label
                    htmlFor="dropzone-pic"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        aria-hidden="true"
                        className="w-10 h-10 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">
                          Click to upload book cover
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        JPEG or PNG
                      </p>
                    </div>
                    <input
                      id="dropzone-pic"
                      accept="image/png, image/jpeg"
                      type="file"
                      className="hidden"
                      onChange={onChangeCoverHandler}
                    />
                  </label>
                </div>
              )}
              {bookDetail.thumbnail ? (
                <div className="flex items-center justify-center md:w-[48%] w-full">
                  <img
                    src={bookDetail.thumbnail.toDataURL()}
                    alt="PDF thumbnail"
                    className="w-full h-64 object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`${
                    bookDetail.thumbnail ? `hidden` : `flex`
                  } items-center justify-center md:w-[48%] w-full`}
                  ref={viewerRef}
                >
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        aria-hidden="true"
                        className="w-10 h-10 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">
                          Click to upload book file
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PDF
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={onChangeBookHandler}
                    />
                  </label>
                </div>
              )}
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Price (MATIC)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="MATIC"
                  required
                  onChange={handleChange}
                  value={bookDetail.price}
                />
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Bookname
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="book name"
                  required
                  onChange={handleChange}
                  value={bookDetail.name}
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Book description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="description"
                  required
                  onChange={handleChange}
                  value={bookDetail.description}
                />
              </div>
              <div>
                <label
                  htmlFor="genre"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Book Genre
                </label>
                <input
                  type="text"
                  id="genre"
                  name="genre"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="genre"
                  required
                  onChange={handleChange}
                  value={bookDetail.genre}
                />
              </div>
              <div>
                <label
                  htmlFor="symbol"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Book Symbol
                </label>
                <input
                  type="text"
                  id="symbol"
                  name="symbol"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="symbol"
                  required
                  onChange={handleChange}
                  value={bookDetail.symbol}
                />
              </div>
              <div>
                <label
                  htmlFor="copies"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Book Copies
                </label>
                <input
                  type="number"
                  id="copies"
                  name="copies"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="copies"
                  required
                  onChange={handleChange}
                  value={bookDetail.copies}
                />
              </div>
            </div>
            {!spinner ? (
              <button
                type="submit"
                disabled={isFormFilled()}
                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                Mint
              </button>
            ) : (
              <button
                disabled
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 mr-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Minting...
              </button>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default Mint;
