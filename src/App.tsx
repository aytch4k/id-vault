/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */
import "./App.css";
import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import { ADAPTER_STATUS } from "@web3auth/base";
import EthersRPC from "./ethersRPC";
import ViemRPC from "./viemRPC";
import Web3RPC from "./web3RPC";

function App() {
  const { status, connect, userInfo, provider, logout: logoutWeb3Auth } = useWeb3Auth();

  const login = async () => {
    await connect();
  };

  const logout = async () => {
    await logoutWeb3Auth();
    uiConsole("logged out");
  };

  // Check the RPC file for the implementation
  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const address = await EthersRPC.getAccounts(provider);
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const balance = await ViemRPC.getBalance(provider);
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const signedMessage = await Web3RPC.signMessage(provider);
    uiConsole(signedMessage);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    uiConsole("Sending Transaction...");
    const transactionReceipt = await EthersRPC.sendTransaction(provider);
    uiConsole(transactionReceipt);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={() => uiConsole(userInfo)} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & ID Vault - Non-custodial Wallet
      </h1>
      <h2 style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
        HELLO WORLD - APP IS LOADING SUCCESSFULLY!
      </h2>

      <div className="grid">{status === ADAPTER_STATUS.CONNECTED ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} ID Vault - Non-custodial wallet for Cosmos SDK + IBC based and EVM compatible blockchain</p>
      </footer>
    </div>
  );
}

export default App;