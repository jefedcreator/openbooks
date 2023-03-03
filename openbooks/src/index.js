import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { publicProvider } from 'wagmi/providers/public'
import { darkTheme } from "@rainbow-me/rainbowkit";
import {
  WagmiConfig,
  createClient,
  configureChains,
} from 'wagmi'
// import { Chain, WagmiConfig } from 'wagmi/dist';
import { filecoinHyperspace } from '@wagmi/chains';
import { BrowserRouter } from 'react-router-dom';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { alchemyProvider } from 'wagmi/providers/alchemy';

// const url = 'https://filecoin-hyperspace.chainstacklabs.com/rpc/v1';
// const headers = { 'content-type': 'application/json' };
// const connection = { url, headers };


const { chains, provider } = configureChains(
  [filecoinHyperspace ],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
appName: 'My RainbowKit App',
chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

// const { chains, provider, webSocketProvider } = configureChains(
//  [chain.mainnet, chain.polygon],
//  [publicProvider()],
// )

// const client = createClient({
//   autoConnect: true,
//   provider,
//   webSocketProvider,
// })


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <WagmiConfig 
    client={wagmiClient}
    >
      <RainbowKitProvider chains={chains}
        theme={darkTheme({ borderRadius: "medium" })}
      >
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </RainbowKitProvider>
    </WagmiConfig>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

