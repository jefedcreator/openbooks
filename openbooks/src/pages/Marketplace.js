import React, { useEffect, useState, useCallback } from 'react'
import openbooksAbi from '../utils/openbooksAbi.json'
import value from '../utils/openbooksAddress.json'
import { useAccount, useConnect, useEnsName, useSigner } from 'wagmi'
import Spinner from '../components/Spinner'
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { publicProvider } from 'wagmi/dist/providers/public'
import { useContract, useProvider } from 'wagmi'
import { async } from 'q'
// import axios from "axios";
// import { useAccount, useSigner } from 'wagmi'

const Marketplace = ({allLibreVerse,spinner}) => {
    console.log("allLibreVerse",allLibreVerse);
    const[spin, setSpinner] = useState(false)
    const { data: signer } = useSigner()
    const provider = useProvider()
    const [bookCopies, setBookCopies] = useState(null);


    const libreVerse = new ethers.Contract(
        value.address,
        openbooksAbi,
        signer,
    )

    // const purchase = (value,index) =>{
    //         // console.log("value",parseInt(value),"index",index);
    //         return new Promise((resolve, reject) => {
    //       resolve(openbooks.purchaseBook(index,{
    //         value
    //       }))  
    //     })
    //   }

    // const purchaseHandler = async(index) =>{
    //     try {
    //         setSpinner(true)
    //         const value = await book(index)
    //         const tx = await purchase(value.price,index)
    //         tx.wait().then(() =>toast.success("book purchased succesfully"))

    //     } catch (error) {
    //         console.log("error",error.message);
    //     }
    //     finally{
    //         setSpinner(false)
    //     }
    // }

    const getCopies = async (collection) =>{
        const result = await libreVerse.collectionRemains(collection);
        return result
    }

    const mintHandler = async (collection,bookPrice) =>{
        const tx = await libreVerse.mintCollection(collection,{
            value:bookPrice
        })
        tx.wait().then(() =>{
            Promise.all(
                allLibreVerse.map((book) => book?.collection && getCopies(book.collection))
              ).then(copies => setBookCopies(copies));
        })

    }

    useEffect(() => {
        if (allLibreVerse) {
          async function loadCopies() {
            const copies = await Promise.all(
              allLibreVerse.map((book) => book?.collection && getCopies(book.collection))
            );
            setBookCopies(copies);
          }
      
          loadCopies();
        }
      }, [allLibreVerse]);
      
  return (
    <div className='flex flex-col justify-between h-auto'>
        <ToastContainer />
        <h3 className="text-3xl font-bold dark:text-white py-3">Marketplace</h3>
        {
            (allLibreVerse.length === 0 || !bookCopies)
            ?
            <h1>Loading...</h1>
            :

            <div className='h-full flex flex-row flex-wrap gap-x-10'>
            {
                allLibreVerse.map((book,i) => {
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
                              {book?.collectionName}
                            </h5>
                            <p className="mb-1 text-xs font-normal text-gray-700 dark:text-gray-400 font-book">
                              {book?.description}
                            </p>
                            <p className="mb-1 text-xs font-normal text-gray-700 dark:text-gray-400 font-book">
                              #{book?.genre}
                            </p>
                            <p className="mb-1 text-xs font-normal text-gray-700 dark:text-gray-400 font-book">
                              Price: {ethers.utils.formatUnits(book?.price)} MATIC
                            </p>
                            <p className="mb-1 text-xs font-normal text-gray-700 dark:text-gray-400 font-book">
                              copies left:{bookCopies[i] ? bookCopies[i].toString() : "N/A"}
                            </p>
                            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
                            onClick={()=>mintHandler(book.collection,book.price)}
                            >
                                mint
                                <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </button>
                          </div>
                        </div>
                      );
                })
            } 
        </div>
        }

    </div>
  )
}

export default Marketplace