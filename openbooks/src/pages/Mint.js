import React from 'react'
import { create } from "ipfs-http-client";
import openbooksAbi from '../utils/openbooksAbi.json'
import value from '../utils/openbooksAddress.json'
import { ethers } from 'ethers';
import { useState, useRef } from 'react';
import { useAccount, useSigner } from 'wagmi'
import { ToastContainer, toast } from 'react-toastify';
import WebViewer from '@pdftron/webviewer'
import PDFThumbnail from '../components/PDFRasterizer';
// import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
// import pdfThumbnail from 'pdf-thumbnail';
import 'react-toastify/dist/ReactToastify.css';



const Mint = () => {
    const { address, isConnected } = useAccount()
    const { data: signer } = useSigner()
    const [cover, setCover] = useState(null)
    const [book, setBook] = useState("")
    const[price, setPrice] = useState(null)
    const [previewSrc, setPreviewSrc] = useState(null);
    const [thumb, setThumb] = useState(null)
    const[genre,setGenre] = useState(null)
    const viewerRef = useRef(null);

    const [bookDetail, setBookDetail] = useState({
        cover:"",
        book:"",
        price:"",
        thumbnail:"",
        genre:"",
        description:""
    })

    const[name, setName] = useState("");
    const[description, setDescription] = useState("");
    const[spinner, setSpinner] = useState(false)

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

    const isFormFilled = () => {
        return !(cover && book && price);
    }

    const initializeWebViewer = async (file) => {
        if (!file) return;
  
        const instance = await WebViewer(
          {
            path: '/webviewer',
            disabledElements: 
            ['header', 'toolsHeader', 'viewControlsElement','documentContainer','textPopup'],
          },
          viewerRef.current
        );
  
          const { createDocument } = instance.Core;
          // const doc = documentViewer.getDocument();
          instance.UI.disableElements(['header', 'toolsHeader', 'viewControlsElement','documentContainer','textPopup','viewControlsOverlay',],)
          const pageNumber = 2;

  
          const doc = await createDocument(file, {extension:"pdf"})
          doc.loadCanvasAsync({
              pageNumber,
              drawComplete: (thumbnail) =>{
                  setThumb(thumbnail)
              }
          })  
    };

    const onChangeCoverHandler = async (e) =>{
        try {
            const form = e.target;
            const files = (form).files;          
            if (!files || files.length === 0) {
            alert("No files selected");
            return toast.error("error selecting file")
            }
            toast.success("book cover selected succesfully")
            const file = files[0];
            // const imageFile = e.target.files[0];
            if (!file) return;
            // setFile(file);
        
            const reader = new FileReader();
            reader.onload = (event) => {
              setPreviewSrc(event.target.result);
            };
            reader.readAsDataURL(file);
            // upload files
            const result = await (ipfs).add(file);
        
            setCover("https://jefedcreator.infura-ipfs.io/ipfs/" + result.path)
        } catch (error) {
            console.log({error});
            toast.error("error uploading cover to ipfs")
        }
    }

    console.log("book:", book);
    console.log("cover:", cover);
    console.log("price:",price);
    console.log("is form filled:", isFormFilled());

    const onChangeBookHandler = async (e) =>{
        try {
            const form = e.target;
            const files = (form).files;          
            const file = files[0];
            if (!files || files.length === 0) {
                return toast.error("error selecting file")
            }
            toast.success("book file selected succesfully")
            await initializeWebViewer(file)
            const result = await (ipfs).add(file);
            setBookDetail((book) => {
                return {
                  ...book,
                  book: "failed"
                };
            });
              
            setBook("https://jefedcreator.infura-ipfs.io/ipfs/" + result.path)
        } catch (error) {
            console.log({error});
            toast.error("error uploading to ipfs")
        }
    }
    
    // console.log("uri",thumbnailSrc);

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
            console.log("book", book);
            let tx = await openbooks.mintBook(uri,book,price, {
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
        {/* <div className='max-w-md flex flex-col justify-around'>
            <h2 className='uppercase font-bold text-5xl'>The next digital publishers</h2>
            <p className='text-3xl'>distribute your books in form of NFTs and reach your fans directly</p>
        </div> */}
            {ipfs && (
            <>
                <h4 className="text-2xl font-bold dark:text-white">Mint book</h4>
                <form onSubmit={mintBook}>
                <div className='flex justify-between'>
                    {
                        previewSrc ?  
                        <div className="flex items-center justify-center w-[48%]">
                            <img src={previewSrc} alt="Image preview" className="flex items-center justify-center w-full object-contain h-64" />
                        </div>
                        :
                        <div className="flex items-center justify-center w-[48%]">
                            <label htmlFor="dropzone-pic" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload book cover</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">JPEG or PNG</p>
                                </div>
                                <input id="dropzone-pic" accept="image/png, image/jpeg" type="file" className="hidden" onChange={onChangeCoverHandler}/>
                            </label>
                        </div>
                    }
                    {/* {
                        thumbnailSrc ? 
                        <div className="flex items-center justify-center w-[48%]">
                            <img src={thumbnailSrc} alt="Image preview" className="flex items-center justify-center w-full object-contain h-64" />
                        </div>
                        :
                        <div className="flex items-center justify-center w-[48%]">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload book file</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF</p>
                                </div>
                                <input id="dropzone-file" type="file" accept="application/pdf" className="hidden" onChange={onChangeBookHandler}/>
                            </label>
                        </div>
                    } */}
                    {
                        thumb ?
                        <div className="flex items-center justify-center w-[48%]">
                            <img src={thumb.toDataURL()} alt="PDF thumbnail" className='w-full h-64 object-cover'/>
                        </div>
                        :
                        <div className="flex items-center justify-center w-[48%]" ref={viewerRef}>
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload book file</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF</p>
                                </div>
                                <input id="dropzone-file" type="file" accept="application/pdf" className="hidden" onChange={onChangeBookHandler}/>
                            </label>
                        </div>
                    }
                </div>
                    {/* <input type="file" name="file" onChange={onSubmitHandler}/> */}
                    {/* <input type="number" name="price" onSubmit={(e)=> setPrice(e.target.value)}/> */}
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price (FIL)</label>
                    <input ref={priceref} type="number" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="MATIC" required onChange={(e) => setPrice(ethers.utils.parseEther(e.target.value))}/>
                </div>
                <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bookname</label>
                    <input ref={nameref} type="text" id="name" name='name' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="book name" required onChange={(e) => setName(e.target.value)}/>
                </div>
                <div>

                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Book description</label>
                    <input ref={descref} type="text" id="description" name='description' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="description" required onChange={(e) => setDescription(e.target.value)}/>
                </div>
                <div>

                    <label htmlFor="genre" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Book Genre</label>
                    <input ref={descref} type="text" id="genre" name='genre' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="genre" required onChange={(e) => setDescription(e.target.value)}/>
                </div>
                </div>
                {                    
                    !spinner ?
                    <button type="submit" disabled={isFormFilled()} className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Mint</button>
                    :
                    <button disabled type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                        <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                        </svg>
                        Minting...
                    </button>
                }
                </form>
            </>
        )}
        </div>
  )
}

export default Mint