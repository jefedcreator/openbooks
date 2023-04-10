import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "react-router-dom";

function Profile() {
  return (
    <div className="flex flex-row w-full justify-between items-center py-2">
      <div className="w-1/2 flex flex-row">
        <h3 className="hidden md:block">Open books</h3>
        <ul className="md:w-9/12 flex flex-col md:flex-row justify-evenly">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/create">Create</Link>
          </li>
          <li>
            <Link to="/library">Library</Link>
          </li>
          <li>
            <Link to="/marketplace">Marketplace</Link>
          </li>
          <li>
            <Link to="/collection">Collection</Link>
          </li>
        </ul>
      </div>
      <ConnectButton className="w-1/2" />
    </div>
  );
}

export default Profile;
