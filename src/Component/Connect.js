import React, { useContext } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
    NoEthereumProviderError
} from "@web3-react/injected-connector";

import { useEffect, useState } from "react";
import { injected, walletconnect, coinbaseWallet } from "../helper/connectors";
import useEagerConnect, { useInactiveListener } from '../helper/useWeb3';
import metaMask from '../images/meta-mask.png';
import wallet from '../images/wallet.png';
import coinbase from '../images/coinbase.png';
import trust from '../images/trust.png';
import localStorage from "local-storage";
import { supportNetwork } from "../helper/network";
import { Button } from 'react-bootstrap';
import rightArrow from '../images/click.png';
import { Context } from "../context/context";
import OutsideAlerter from "./OutsideAlerter";
import { trimAddress } from "../helper/constant";
import avaxImg from '../images/avax_blue.png';
import bnbImg from '../images/bnb_blue.png';
import ethImg from '../images/eth_blue.png';
import maticImg from '../images/matic_blue.png';
import arbitrumImg from '../images/arbitrum.svg';



export const Connect = function () {
    const context = useWeb3React();
    const { connector, account, activate, deactivate, active, error, chainId } = context;
    const { setConnectDrop, connectDrop, networkModal, setNetworkModal } = useContext(Context);
    const [istrust, setIstrust] = useState(false);
    const [activatingConnector, setActivatingConnector] = useState();

    // handle logic to recognize the connector currently being activated
    useEagerConnect();
    useInactiveListener()

    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector]);

    const activating = (connection) => connection ? connection === activatingConnector : false;
    const connected = (connection) => connection ? connection === connector : false;

    useEffect(() => {
        if (account) {
            localStorage.set('address', account);
        }
    }, [account])


    function getErrorMessage(error) {

        if (error instanceof NoEthereumProviderError) {
            if (istrust) {
                console.log('trust')
                const dappUrl = window.location.href; // TODO enter your dapp URL. 
                let metamaskAppDeepLink = "https://link.trustwallet.com/open_url?coin_id=56&url=" + dappUrl;
                window.open(metamaskAppDeepLink)
            }
            else {
                console.log('metamask')
                const dappUrl = window.location.href; // TODO enter your dapp URL. 
                let metamaskAppDeepLink = "https://metamask.app.link/dapp/" + dappUrl;
                window.open(metamaskAppDeepLink)

            }

        }
        if (error instanceof UnsupportedChainIdError) {
            return <span className="btn-text" onClick={(e) => switchNetwork(supportNetwork['default'].chainId)}>
                Wrong Network</span>;
        }

        deactivate(injected);
    }


    const switchNetwork = (networkid) => {
        try {
            // @ts-ignore
            window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${networkid.toString(16)}` }]
            });
        } catch (e) {
            console.error(e);
        }
    }



    return (
        <React.Fragment>
            <Button className='btn btn-primary ms-2' onClick={() => setNetworkModal((prev) => !prev)}>
                <img src={supportNetwork[chainId ? chainId : 'default'].image} alt="logo-eth" height={20} width={20} />
            </Button>

            {
                error &&
                <Button type="button" className="connectButton ms-2" onClick={() => {
                    setActivatingConnector();
                }}>
                    <span className="btn-text">{getErrorMessage(error)}</span>
                </Button>

            }
            {!error &&
                <>


                    {active && (connected(injected) || connected(walletconnect) || connected(coinbaseWallet)) &&
                        <Button
                            type="primary"
                            shape="round"
                            size="large"
                            className="btn btn-primary ms-2"
                            onClick={() => {
                                deactivate();
                                localStorage.remove('address');
                            }}
                        >
                            {trimAddress(account)}
                        </Button>
                    }
                    {!active && (!connected(injected) || !connected(walletconnect) || !connected(coinbaseWallet)) &&
                        <>

                            {(activating(injected) || activating(walletconnect) || activating(coinbaseWallet)) ? (

                                <Button className='btn btn-primary ms-2'>Connecting...</Button>
                            ) :
                                (
                                    <Button className='btn btn-primary ms-2' onClick={() => setConnectDrop(!connectDrop)}>Connect Wallet</Button>
                                )
                            }

                        </>


                    }
                </>
            }
            <OutsideAlerter>
                <div class="dropdown-menu dropdown-main" style={{ "display": `${connectDrop ? 'block' : 'none'}` }} >
                    <div role="menu" class="dropdown-content ">
                        <div>
                            <div role="menuitem" class="dropdown-item text-center">
                                <p class="label itemTitle">Connect to your wallet</p>
                            </div>
                            <div role="menuitem" class="walletItem dropdown-item"
                                onClick={() => {
                                    setActivatingConnector(injected);
                                    activate(injected);
                                    setIstrust(false);
                                    setConnectDrop(false);
                                }}>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div><img src={metaMask} height={30} width={30} class="wallet-icon" alt="connect" /></div>

                                    <p class="walletName" style={{ "color": "rgb(0, 23, 75)" }}> MetaMask</p>

                                    <div><img src={rightArrow} height={30} width={30} class="arrow-icon" alt="arrow" /></div>
                                </div>
                            </div>
                            <div role="menuitem" class="walletItem dropdown-item" onClick={() => {
                                setActivatingConnector(walletconnect);
                                activate(walletconnect);
                                setConnectDrop(false);
                            }}>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <img src={wallet} height={30} width={30} class="wallet-icon" alt="connect" />
                                    </div>
                                    <p class="walletName" style={{ "color": "rgb(0, 23, 75)" }}>WalletConnect</p>
                                    <div>
                                        <img src={rightArrow} height={30} width={30} class="arrow-icon" alt="arrow" />
                                    </div>
                                </div>
                            </div>
                            <div role="menuitem" class="walletItem dropdown-item" onClick={() => {
                                setActivatingConnector(injected);
                                activate(injected);
                                setIstrust(true);
                                setConnectDrop(false);
                            }}>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <img src={trust} height={30} width={30} class="wallet-icon" alt="connect" />
                                    </div>
                                    <p class="walletName" style={{ "color": "rgb(0, 23, 75)" }}> Trust Wallet</p>
                                    <div>
                                        <img src={rightArrow} height={30} width={30} class="arrow-icon" alt="arrow" />
                                    </div>
                                </div>
                            </div>
                            <div role="menuitem" class="walletItem dropdown-item" onClick={() => {
                                setActivatingConnector(coinbaseWallet);
                                activate(coinbaseWallet);
                                setConnectDrop(false);
                            }}>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <img src={coinbase} height={30} width={30} class="wallet-icon" alt="connect" />
                                    </div>
                                    <p class="walletName" style={{ "color": "rgb(0, 23, 75)" }}> Coinbase Wallet</p>
                                    <div>
                                        <img src={rightArrow} height={30} width={30} class="arrow-icon" alt="arrow" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


                <div class="dropdown-menu  dropdown-main dropdown-network-main" style={{ "display": `${networkModal ? 'block' : 'none'}` }} >
                    <div role="menu" class="dropdown-content ">

                        <div>
                            <div role="menuitem" class="dropdown-item">
                                <div class="accountContainer">
                                    <div class="accountHeader">
                                        <p class="itemTitle">Select a Network</p>
                                        {/* <p class="errorNetworkContainer">
                                            <span class="errorText">Current network is not supported, please connect to the supported network below or contact us to get the supports.</span>
                                        </p> */}
                                    </div>
                                    <p class="padding-mini"></p>
                                    <div class="networks-scrollable">
                                        <label class="networkTitle">Mainnets</label>
                                        <p class="padding-mini"></p>
                                        <div class="columns is-gapless is-multiline is-mobile is-bottomless mainet">
                                            <div class="column is-one-third" onClick={() => {
                                                switchNetwork(1);
                                                setNetworkModal((prev) => !prev)
                                            }}>
                                                <div class="networkSelectItem">
                                                    <img src={ethImg} class="networkSelectItem-img" alt="network-img" />
                                                    <span class="networkSelectItem-text"> Ethereum</span>
                                                </div>
                                            </div>
                                            <div class="column is-one-third" onClick={() => {
                                                switchNetwork(56)
                                                setNetworkModal((prev) => !prev)
                                            }}>
                                                <div class="networkSelectItem">
                                                    <img src={bnbImg} class="networkSelectItem-img" alt="network-img" />
                                                    <span class="networkSelectItem-text"> BNB Smart Chain</span>
                                                </div>
                                            </div>
                                            <div class="column is-one-third" onClick={() => {
                                                switchNetwork(43114)
                                                setNetworkModal((prev) => !prev)
                                            }}>
                                                <div class="networkSelectItem right">
                                                    <img src={avaxImg} class="networkSelectItem-img" alt="network-img" />
                                                    <span class="networkSelectItem-text">  Avalanche C Chain</span>
                                                </div>
                                            </div>
                                            <div class="column is-one-third" onClick={() => {
                                                switchNetwork(137)
                                                setNetworkModal((prev) => !prev)
                                            }}>
                                                <div class="networkSelectItem">
                                                    <img src={maticImg} class="networkSelectItem-img" alt="network-img" />
                                                    <span class="networkSelectItem-text"> Matic (Polygon) Network</span>
                                                </div>
                                            </div>
                                            <div class="column is-one-third" onClick={() => {
                                                switchNetwork(42161)
                                                setNetworkModal((prev) => !prev)
                                            }}>
                                                <div class="networkSelectItem">
                                                    <img src={arbitrumImg} class="networkSelectItem-img" alt="network-img" />
                                                    <span class="networkSelectItem-text">Arbitrum One Mainnet</span>
                                                </div>
                                            </div>
                                        </div>
                                        <label class="networkTitle">Testnets</label>
                                        <p class="padding-mini"></p>
                                        <div class="columns is-gapless is-multiline is-mobile">
                                            <div class="column is-one-third" onClick={() => {
                                                switchNetwork(5)
                                                setNetworkModal((prev) => !prev)
                                            }}>
                                                <div class="networkSelectItem">
                                                    <img src={ethImg} class="networkSelectItem-img" alt="network-img" />
                                                    <span class="networkSelectItem-text">Görli</span>
                                                </div>
                                            </div>
                                            <div class="column is-one-third" onClick={() => {
                                                switchNetwork(97)
                                                setNetworkModal((prev) => !prev)
                                            }}>
                                                <div class="networkSelectItem">
                                                    <img src={bnbImg} class="networkSelectItem-img" alt="network-img" />
                                                    <span class="networkSelectItem-text">BNB Smart Chain Testnet</span>
                                                </div>
                                            </div>
                                            <div class="column is-one-third" onClick={() => {
                                                switchNetwork(43113)
                                                setNetworkModal((prev) => !prev)
                                            }}>
                                                <div class="networkSelectItem right">
                                                    <img src={avaxImg} class="networkSelectItem-img" alt="network-img" />
                                                    <span class="networkSelectItem-text">Avalanche C Chain Testnet</span>
                                                </div>
                                            </div>
                                            <div class="column is-one-third" onClick={() => {
                                                switchNetwork(80001)
                                                setNetworkModal((prev) => !prev)
                                            }}>
                                                <div class="networkSelectItem">
                                                    <img src={maticImg} class="networkSelectItem-img" alt="network-img" />
                                                    <span class="networkSelectItem-text"> Matic (Mumbai) Network</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </OutsideAlerter>

        </React.Fragment>


    );
};

export default Connect;