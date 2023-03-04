import React, { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Context } from "../context/context";
import Step1 from "../Component/Step1";
import Step2 from "../Component/Step2";
import Step3 from "../Component/Step3";
import bnbImg from '../images/bnb_blue.png';
import ethImg from '../images/eth_blue.png';
import avaxImg from '../images/avax_blue.png';
import maticImg from '../images/matic_blue.png';
import arbitrumImg from '../images/arbitrum.svg';
import headerRightImg from '../images/headerRight5.png';


const Home = () => {
    const { multisendApp, open } = useContext(Context);

    return (
        <>
            <div className={`${open ? 'header-background1' : ''} header-background`}>
                <div className={`${open ? 'headerBg1 fadingEffect' : ''} headerBg0 `}></div>
                <div className={`${open ? 'content_fix_step' : 'content_fix_step1'}`}>

                    <Container>
                        <Row className="align-items-center">
                            <Col xs={12} sm={12} md={12} lg={8}>
                                <h1 className="left-title">WELCOME <span className="text-white">TO</span> <br />
                                    <span className="text-white">TOKEN </span>FLASH&nbsp;
                                    <span className="text-white">SENDER</span>
                                </h1>
                                <div className="networks">
                                    <h4 className="networks-support">Network supports</h4>
                                    <br />
                                    <span className="network-item-left">
                                        <img src={ethImg} alt="" className="network-icon" />
                                        Ethereum Mainnet
                                    </span>
                                    <span className="network-item-left">
                                        <img src={bnbImg} alt="" className="network-icon" />
                                        BNB Smart Chain
                                    </span>
                                    <span className="network-item-left">
                                        <img src={avaxImg} alt="" className="network-icon" />
                                        Avalanche
                                    </span>
                                    <span className="network-item-left">
                                        <img src={maticImg} alt="maticImg" className="network-icon" />
                                        Matic
                                    </span>
                                    <span className="network-item-left">
                                        <img src={arbitrumImg} alt="arbitrumImg" className="network-icon" />
                                        Arbitrum One
                                    </span>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={4}>
                                <img src={headerRightImg} alt="" className="right-icon" />
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
            {multisendApp.step === 1 &&
                <Step1 />
            }
            {multisendApp.step === 2 &&
                <Step2 />
            }
            {multisendApp.step === 3 &&
                <Step3 />
            }


            <Container className="mt-3">
                {/* <Row>
                    <Col>
                        <div className="contractInfo">
                            <span>FlashSender Address ({supportNetwork[chainId ? chainId : 'default'].name}):</span>
                            <a target="_blank" rel="noreferrer" href={`${supportNetwork[chainId ? chainId : 'default'].accountUrl}${contract[chainId ? chainId : 'default'].MULTISENDERADDRESS}`}>{contract[chainId ? chainId : 'default'].MULTISENDERADDRESS}</a>
                        </div>
                    </Col>
                </Row> */}

            </Container>

            <div class="footer text-dark mt-3">
                Copyright © 2023. All rights reserved by FlashSender.
            </div>
        </>
    )
}
export default Home