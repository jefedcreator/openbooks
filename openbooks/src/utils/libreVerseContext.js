import { useState, createContext } from 'react';
import openbooksAbi from "./openbooksAbi.json";
import value from "./openbooksAddress.json";
import { useAccount, useSigner } from "wagmi";
import { useContract, useProvider } from "wagmi";

export const LibreVerseContext = createContext();

export const LibreVerseProvider = ({ children }) => {
//   const [libreVerse, setLibreVerse] = useState(null);

  const { isConnected } = useAccount();
  const provider = useProvider();
  const {data: signer} = useSigner()

  const libreVerse = useContract({
    address: value.address,
    abi: openbooksAbi,
    signerOrProvider: isConnected ? signer : provider,
  });

  return (
    <LibreVerseContext.Provider value={{ libreVerse }}>
      {children}
    </LibreVerseContext.Provider>
  );
};
