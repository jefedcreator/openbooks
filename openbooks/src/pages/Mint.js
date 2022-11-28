import React from 'react'
import { create } from "ipfs-http-client";
import openbooksAbi from '../utils/openbooksAbi.json'
import value from '../utils/openbooksAddress.json'
import { ethers } from 'ethers';
import { useState, useRef } from 'react';
import { useAccount, useSigner } from 'wagmi'
import Spinner from '../components/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Mint = () => {
    const { address, isConnected } = useAccount()
    const { data: signer } = useSigner()
    const [cover, setCover] = useState("")
    const[price, setPrice] = useState(null)
    // const[details, setDetails] = useState({
    //     name:"",
    //     description:"",
    //     image:""
    // })
    const[name, setName] = useState("");
    const[description, setDescription] = useState("");
    const[spinner, setSpinner] = useState(false)
    // const[uri, setUri] = useState("")

    const nameref = useRef(null);
    const priceref = useRef(null);
    const descref = useRef(null);

    const projectId = "2HRZT6vGC9rbZZd3ptUtyZQTZaK";
    const projectSecret = "7b1350f2b0c4b0e43f91ac2f54b4d5b6";
    const authorization = "Basic " + btoa(projectId + ":" + projectSecret);
  
    const openbooks = new ethers.Contract(
      value.address,
      openbooksAbi,
      signer,
    )
  
    let ipfs;
  
    try {
      ipfs = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
          authorization: authorization
        }
      });
    } catch (error) {
      console.error("IPFS error ", error);
      ipfs = undefined;
    }

    // const onSubmitHandler = async () => {
    //     try {
    //         let data = JSON.stringify({
    //             name: name,
    //             description: description,
    //             image: cover,
    //             // owner: address,
    //         });

    //         setSpinner(true)
    //         const getUri = await (ipfs).add(data);

    //         setUri("ipfs://" + getUri.path)

    //         toast.success("Book Uploaded to ipfs succesfully")
    //     } catch (error) {
    //         console.log(error);
    //         toast.error("error uploading to ipfs")
    //     } finally {
    //         setSpinner(false)
    //     }
    //     // files.reset();
    //     };


    const isFormFilled = () => {
        return cover || price == null ? false : true
    }

    const onChangeHandler = async (e) =>{
        try {
            const form = e.target;
            const files = (form).files;          
            if (!files || files.length === 0) {
            alert("No files selected");
            return toast.error("error selecting file")
            }
            toast.success("file selected succesfully")
            const file = files[0];
            // upload files
            const result = await (ipfs).add(file);
        
            setCover("https://jefedcreator.infura-ipfs.io/ipfs/" + result.path)
        } catch (error) {
            console.log({error});
            toast.error("error uploading to ipfs")
        }

    }
    
    // console.log("uri",uri);

    const mintBook = async(e) => {
        e.preventDefault()        
        try {
            let data = JSON.stringify({
                name: name,
                description: description,
                image: cover,
                // owner: address,
            });

            setSpinner(true)
            const getUri = await (ipfs).add(data);

            let uri = "ipfs://" + getUri.path

            toast.success("Book Uploaded to ipfs succesfully")
            const mintFee = ethers.utils.parseEther("0.001") 
            console.log("mint fee", mintFee);
            console.log("price", price);
            let tx = await openbooks.mintBook(uri,price, {
            value: mintFee
            });
            let reciept = await tx.wait();
            console.log ("mint book Tx Receipt: ", reciept);
            toast.success("mint successful")
        } catch (error) {
            console.log(error);
            toast.error("failed to mintBook")
        }
        finally{
            setSpinner(false)
            priceref.current.value = ''
            nameref.current.value = ''
            descref.current.value = '' 
        }
    }
     

  return (
    <div className='flex flex-col justify-between h-3/4'>
        <ToastContainer />
        {
            spinner && <Spinner/>
        }
        {/* <div className='max-w-md flex flex-col justify-around'>
            <h2 className='uppercase font-bold text-5xl'>The next digital publishers</h2>
            <p className='text-3xl'>distribute your books in form of NFTs and reach your fans directly</p>
        </div> */}
            {ipfs && (
            <>
            <h4 className="text-2xl font-bold dark:text-white">Mint book</h4>
            <form onSubmit={mintBook}>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload book cover</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" onChange={onChangeHandler}/>
                </label>
            </div>
                {/* <input type="file" name="file" onChange={onSubmitHandler}/> */}
                {/* <input type="number" name="price" onSubmit={(e)=> setPrice(e.target.value)}/> */}
            <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price (MATIC)</label>
                <input ref={priceref} type="number" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="MATIC" required onChange={(e) => setPrice(e.target.value)}/>
            </div>
            <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bookname</label>
                <input ref={nameref} type="text" id="name" name='name' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="book name" required onChange={(e) => setName(e.target.value)}/>
            </div>
            <div>

                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Book description</label>
                <input ref={descref} type="text" id="description" name='description' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="description" required onChange={(e) => setDescription(e.target.value)}/>
            </div>
            </div>
                <button type="submit" disabled={isFormFilled()} className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Mint</button>
            </form>
            </>
        )}
        </div>
  )
}

export default Mint