import React, { useEffect, useState, useCallback } from 'react'
import './App.css';
import { useAccount, useSigner } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
// import { Router,Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Mint from './pages/Mint';
import Collection from './pages/Collection';
import Profile from './components/Profile';
import { createRoot } from "react-dom/client";
import { useContract, useProvider } from 'wagmi'
import axios from "axios";
import openbooksAbi from '../src/utils/openbooksAbi.json'
import value from '../src/utils/openbooksAddress.json'
import {
  BrowserRouter as Router,
  RouterProvider,
  Route,
  Routes,
  Link,
} from "react-router-dom";
import Marketplace from './pages/Marketplace';
import Library from './pages/Library';
// import Toas

function App() {
  const { data: signer, isError, isLoading } = useSigner()
  const[spinner, setSpinner] = useState(false)
  const[allLibreVerse, setAllLibreVerse] = useState([])
  const[mintedLibreVerse, setMintedLibreVerse] = useState([])
  const [profit, setProfit] = useState(null)

  const { address, isConnected } = useAccount()
  const provider = useProvider()

  const libreVerse = useContract({
    address: value.address,
    abi: openbooksAbi,
    signerOrProvider: provider,
  })

// const getSupply = async() =>{
//     try {
//         let supply = await openbooks.totalSupply()
//         setNftSupply(Number(supply))
//     } catch (error) {
//         console.log({error});
//     }
// }

// fetch all NFTs on the smart contract
// const getNfts = async () => {
// try {
//     const nfts = [];
//     const nftsLength = await openbooks.totalSupply();
//     for (let i = 0; i < Number(nftsLength); i++) {
//         const nft = new Promise(async (resolve) => {
//             const res = await openbooks.tokenURI(i);
//             const data = "https://ipfs.io/ipfs/" + res.slice(7);
//             const meta = await fetchNftMeta(data);
//             const details = await openbooks.book(i);
//             resolve({
//                 index: i,
//                 owner:details.owner,
//                 price:details.price,
//                 sold:details.sold,
//                 name: meta.data.name,
//                 image: meta.data.image,
//                 description: meta.data.description
//             });
//         });
//         nfts.push(nft);
//     }
//     return Promise.all(nfts);
// } catch (e) {
//     console.log({e});
// }
// };

// get the metedata for an NFT from IPFS
const fetchNftMeta = async (ipfsUrl) => {
try {
    if (!ipfsUrl) return null;
    const meta = await axios.get(ipfsUrl);
    return meta;
} catch (e) {
    console.log({e});
}
};

const getProfit = () =>{
  return new Promise((resolve, reject) => {
    if(!isConnected){
      reject("Connect wallet")
    }
    resolve(libreVerse.profit(address))
  })
}

const getProfitHandler = async() =>{
  const balance = await getProfit()
  setProfit(parseInt(balance))
}

const init = async () => {
  try {
    setSpinner(true);
    const allCollections = await libreVerse.queryFilter(libreVerse.filters.createdCollection());
    const fetchCollectionMetadata = async (data) => {
      const ipfsRes = `https://ipfs.io/ipfs/${data.args[4].slice(7)}`;
      const metadata = await fetchNftMeta(ipfsRes);
      return {
        collection: data.args[0],
        creator: data.args[1],
        collectionName: data.args[2],
        genre: data.args[3],
        image: metadata.data.image,
        description: metadata.data.description,
        price: data.args[5].toString()
      };
    };
  
    const collectionsPromises = allCollections.map(fetchCollectionMetadata);
    const collections = await Promise.all(collectionsPromises);
    setAllLibreVerse(collections);
    libreVerse.on("createdCollection", async(collection, collectionName, creator, genre, uri,price) => {
      const ipfsRes = `https://ipfs.io/ipfs/${uri.slice(7)}`;
      const metadata = await fetchNftMeta(ipfsRes);
      const newEscrow = {
        collection,
        collectionName,
        creator,
        genre,
        image:metadata.data.image,
        description: metadata.data.description,
        price:price.toString()
      };
  
      setAllLibreVerse(prev => [newEscrow, ...prev]);
    });

    const mintedCollections = await libreVerse.queryFilter(libreVerse.filters.mintedCollection());
    const fetchMintedMetadata = async (data) => {
      const ipfsRes = `https://ipfs.io/ipfs/${data.args[2].slice(7)}`;
      const metadata = await fetchNftMeta(ipfsRes);
      return {
        collection: data.args[0],
        collector: data.args[1],
        image: metadata.data.image,
        description: metadata.data.description,
        name: metadata.data.name,
        balance: data.args[3].toString()
      };
    };
  
    const mintedPromises = mintedCollections.map(fetchMintedMetadata);
    const minted = await Promise.all(mintedPromises);
    setMintedLibreVerse(minted);
    // console.log("collections",collections);
    libreVerse.on("mintedCollection", async(balance, collection, collectionUri, collector) => {
      const ipfsRes = `https://ipfs.io/ipfs/${collectionUri.slice(7)}`;
      const metadata = await fetchNftMeta(ipfsRes);
      const newMintedCollection = {
        balance,
        collection,
        collector,
        image: metadata.data.image,
        description: metadata.data.description,
        name: metadata.data.name
      };
  
      setMintedLibreVerse(prev => [...prev,newMintedCollection]);
    });


    setSpinner(false);
    
  } catch (error) {
    console.log({error});
  }

}



useEffect(() => {
    try {
      init();
      getProfitHandler();
    } catch (error) {
      console.log({ error });
    }
}, [address])

// const ntfForSale = nftDetails.filter(book => !book.sale)
// const myNfts = mintedLibreVerse.filter(collection => collection.collector == address)
const myCollection = allLibreVerse.filter(collection => collection.creator == address)
const groupedByCollection = mintedLibreVerse.reduce((acc, obj) => {
  if (!acc[obj.collection]) {
    acc[obj.collection] = [];
  }
  acc[obj.collection].push(obj);
  return acc;
}, {});

// console.log("groupedByCollection",groupedByCollection)

// Find the object with the highest 'balance' attribute in each group
const highestBalancePerCollection = Object.values(groupedByCollection).map(group => {
  return group.reduce((max, obj) => (obj.balance > max.balance ? obj : max));
});

const myNfts = highestBalancePerCollection.filter(nft => nft.collector === address);

  return (
    <div className='w-full px-10 h-screen'>
      <Profile/>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/create" element={<Mint />} />
          <Route path="/library" element={<Library
            myNfts={myNfts}
            spinner={spinner}
          />} />
          <Route path="/marketplace" element={<Marketplace 
            allLibreVerse={allLibreVerse}
            spinner={spinner}
          />} />
          <Route path="/collection" element={<Collection 
            myCollection={myCollection}
            spinner={spinner}
            profit={profit}
          />} />
        </Routes>
    </div>
  )
}

export default App;
