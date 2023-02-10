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
import axios from "axios";
// import { useAccount, useSigner } from 'wagmi'

const Marketplace = ({ntfForSale,spinner}) => {
    const[spin, setSpinner] = useState(false)
    const { data: signer } = useSigner()
    const openbooks = new ethers.Contract(
        value.address,
        openbooksAbi,
        signer,
      )

    const purchase = (value,index) =>{
        return new Promise((resolve, reject) => {
          resolve(openbooks.purchaseBook(index,{
            value
          }))  
        })
      }

    const book = (index) =>{
        return new Promise((resolve, reject) => {
            resolve(openbooks.book(index))  
        })
      }

    const purchaseHandler = async(index) =>{
        try {
            setSpinner(true)
            let value = await book(index)
            const tx = await purchase(value.price,index)
            tx.wait()
            toast.success("book purchased succesfully")
            
        } catch (error) {
            console.log("error",error.message);
        }
        finally{
            setSpinner(false)
        }
    }

  return (
    <div className='flex flex-col justify-between h-auto'>
        <ToastContainer />
        {
            (spinner || spin)&& <Spinner/>
        }
        <h3 class="text-3xl font-bold dark:text-white py-3">Marketplace</h3>

        <div className='h-full flex flex-row flex-wrap justify-between'>
            {
                ntfForSale.map((book,i) => {
                   return (<div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 mt-3">
                        <img className="rounded-t-lg" src={book.image} alt={book.description} />
                        <div className="p-5">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{book.name}</h5>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{book.description}</p>
                            {
                             !book.sold ?   
                            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={()=>purchaseHandler(i)}>
                                Purchase
                                <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            </button>
                            :
                            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={()=>purchaseHandler(i)}>
                                Sold
                                <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            </button>
                            }
                        </div>
                    </div>)
                })
            }
        </div>
    </div>
  )
}

export default Marketplace