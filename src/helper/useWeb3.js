import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";
import { injected } from "../helper/connectors";
import localStorage from "local-storage";

export default function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    let last_history = localStorage.get('address');
    if(last_history !== null){
      injected.isAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
          activate(injected, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          setTried(true);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tried, active]);

  return tried;
}

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(injected);
      };
      const handleChainChanged = (chainId) => {
        window.location.reload(true)
        console.log("Handling 'networkChanged' event with payload", chainId)
        // getRpcUrl(chainId)
      };
      const handleAccountsChanged = (accounts) => {
        window.location.reload(true)
      };
      

      ethereum.on("connect", handleConnect);
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      
      // return () => {
      //   if (ethereum.removeListener) {
      //     ethereum.removeListener("connect", handleConnect);
      //     ethereum.removeListener("chainChanged", handleChainChanged);
      //     ethereum.removeListener("accountsChanged", handleAccountsChanged);
      //   }
      // };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, error, suppress, activate]);
}