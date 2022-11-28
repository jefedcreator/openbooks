import { useAccount, useConnect, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from 'react-router-dom';

function Profile() {
    return (
    <div className='flex flex-row w-full justify-between items-center py-2'>  
        <div className='w-1/2 flex flex-row'>
            <h3>
                Open books
            </h3>
            <ul className='w-9/12 flex flex-row justify-evenly'>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/mint">Mint</Link>
                </li>
                <li>
                    <Link to="/library">My Library</Link>
                </li>
                <li>
                    <Link to="/marketplace">Marketplace</Link>
                </li>
            </ul>
        </div>
        <ConnectButton
            className='w-1/2'
        />
    </div>
)
//  const { address, isConnected } = useAccount()
//  const { data: ensName } = useEnsName({ address })
//  const { connect } = useConnect({
//  connector: new InjectedConnector(),
//  })

//  if (isConnected) return <div>Connected to {ensName ?? address}</div>
//  return <button onClick={() => connect()}>Connect Wallet</button>

}

export default Profile;