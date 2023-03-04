import React, { useState } from 'react';
import tutorialBg from '../images/tutorial_bg.png';

export default function Tutorial() {
    const [isNft, setIsNft] = useState(false);

    return (
        <section class="hero is-info main-containter">
            <div class="main-container">
                <div class="tutorial-body-container">
                    <div class="columns is-mobile">
                        <div class="column">
                            <p class="title is-2 video-title has-text-success">Video Demo</p>
                            <div class="video-container">
                                <iframe
                                    width="560"
                                    height="315"
                                    src="https://www.youtube.com/embed/LXb3EKWsInQ"
                                    frameorder="0"
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen="allowfullscreen"
                                    title='demoVieo'
                                ></iframe>

                            </div>
                        </div>
                    </div>
                    <div class="columns contentContainer">
                        <div class="column is-8">
                            <p class="tips title is-5">
                                Please make sure that you have installed and unlocked<a rel="noreferrer" href="https://metamask.io/" target="_blank"> Metamask </a>or visit our dapp in mobile browser of
                                <a href="https://token.im/download"rel="noreferrer" target="_blank"> imToken</a>、<a href="https://trustwallet.com/" rel="noreferrer" target="_blank"> Trust Wallet</a>、
                                <a href="https://metamask.io/" rel="noreferrer" target="_blank"> Metamask mobile application</a>
                            </p>
                        </div>
                    </div>
                    <p class="padding-small"></p>
                    <div class="columns contentContainer">
                        <div class="column is-8">
                            <p>
                                <span class={`${!isNft ? 'tabActiveText' : 'tabUnActiveText' }`} onClick={()=>setIsNft(false)}>Bulksend Tokens</span>
                                <span class="tabSlash">&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>
                                <span class={`${isNft ? 'tabActiveText' : 'tabUnActiveText' }`} onClick={()=>setIsNft(true)}>Bulksend NFTs</span>
                            </p>
                            <p class="padding-small"></p>
                            {!isNft ? (
                                <div>
                                    <p class="tutorial-title">Prepare data</p>
                                    <p>1. Connect a wallet and select the network you want</p>
                                    <p>2. Wait for token balances to load, if failed to load the tokens, you can manually insert your token address</p>
                                    <p>3. Select the token that you would like to send from the list (<span style={{ "fontStyle": "italic", "fontWeight": "bold" }}>For NFT distribution, please insert token address manually</span>)</p>
                                    <p>4. Upload Excel, CSV, Txt addresses with amounts or manually insert addresses separated by comma</p>
                                    <p>5. Click NEXT</p>
                                    <p class="padding-small"></p>
                                    <p class="tutorial-title">Approving &amp; Confirm</p>
                                    <p>6. Send Approve transaction</p>
                                    <p>7. Confirm bulksending data, include txs, fees</p>
                                    <p>8. Click SEND</p>
                                    <p class="padding-small"></p>
                                    <p class="tutorial-title">Send transaction</p>
                                    <p>9. Confirm transaction in your wallet</p>
                                    <p>10. Wait for an airdrop to complete</p>
                                    <p class="padding-small"></p>
                                    <p class="tutorial-title">Done</p>
                                </div>
                            ) : (
                                <div>
                                    <p class="tutorial-title">Prepare data</p>
                                    <p>1. Connect a wallet and select the network you want</p>
                                    <p>2. Manually insert your NFT smart contract address, the dapp will automatically detect your token is ERC721 or ERC1155</p>
                                    <p>3. Provide list of recipients, you can upload file(CSV, XLS, XLSX) or manually insert ERC721 addresses with token IDs or ERC1155 addresses with token IDs and amounts, separated by comma</p>
                                    <p>4. Click NEXT</p>
                                    <p class="padding-small"></p>
                                    <p class="tutorial-title">Approving &amp; Confirm</p>
                                    <p>6. Send Approve transaction</p>
                                    <p>7. Confirm bulksending data, include txs, fees</p>
                                    <p>8. Click SEND</p>
                                    <p class="padding-small"></p>
                                    <p class="tutorial-title">Send transaction</p>
                                    <p>9. Confirm transaction in your wallet</p>
                                    <p>10. Wait for an airdrop to complete</p>
                                    <p class="padding-small"></p>
                                    <p class="tutorial-title">Done</p>
                                </div>

                            )}

                            <p class="padding-large"></p>
                        </div>
                        <div class="column is-4">
                            <img src={tutorialBg} alt="tutorialBg" class="tutorial-bg" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="hero-footer footer-container main-screen-width"></div>
        </section>
    )
}
