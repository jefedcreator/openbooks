import React, { useEffect, useState, useCallback } from 'react'
import './App.css';
import { useAccount, useConnect, useEnsName, useSigner } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
// import { Router,Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Mint from './pages/Mint';
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
  const[nftSupply, setNftSupply] = useState(null)
  const[nftDetails, setNftDetails] = useState([])
  const { address, isConnected } = useAccount()
  const provider = useProvider()

  const openbooks = useContract({
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
const getNfts = async () => {
try {
    const nfts = [];
    const nftsLength = await openbooks.totalSupply();
    for (let i = 0; i < Number(nftsLength); i++) {
        const nft = new Promise(async (resolve) => {
            const res = await openbooks.tokenURI(i);
            const data = "https://ipfs.io/ipfs/" + res.slice(7);
            const meta = await fetchNftMeta(data);
            const details = await openbooks.book(i);
            resolve({
                index: i,
                owner:details.owner,
                price:details.price,
                sold:details.sold,
                name: meta.data.name,
                image: meta.data.image,
                description: meta.data.description
            });
        });
        nfts.push(nft);
        
    }
    return Promise.all(nfts);
} catch (e) {
    console.log({e});
}
};

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

// const supply = async() => {
//     try {
//         const supply = await openbooks._tokenIdCounter()
//         console.log("supply is", supply);
//         return supply
//     } catch (e) {
//         console.log({e});
//     }
//   };

const getAssets = async () => {
    try {
      setSpinner(true);
      const allNfts = await getNfts();
      if (!allNfts) return;
      setNftDetails(allNfts);
    } catch (error) {
      console.log({ error });
    } finally {
      setSpinner(false);
    }
};

useEffect(() => {
    try {
    //   if (address) {
        getAssets();
        // fetchContractOwner(minterContract);
        // handleOwned()
    //   }
    } catch (error) {
      console.log({ error });
    }
}, [address])

const ntfForSale = nftDetails.filter(book => !book.sale)
const myNfts = nftDetails.filter(book => book.owner == address)

  return (
    <div className='w-full px-10 h-screen'>
      <Profile/>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/library" element={<Library
            openbooks={openbooks}
            myNfts={myNfts}
            spinner={spinner}
          />} />
          <Route path="/marketplace" element={<Marketplace 
            openbooks={openbooks}
            ntfForSale={ntfForSale}
            spinner={spinner}
          />} />
        </Routes>
    </div>
  )
}

export default App;
