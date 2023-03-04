import React, { useState, useEffect } from "react";
import { Form, Col, Container, Row, Button } from "react-bootstrap";
import refImg from '../images/referra_info_en.png';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { getWeb3 } from "../helper/connectors";
import { useWeb3React } from "@web3-react/core";
import { useHistory } from "react-router-dom";
import Footer from '../Component/Footer';


const Referral = () => {
    const { chainId } = useWeb3React();
    const [refAddress, setRefAddress] = useState('');
    const [isLinkGenrate, setIsLinkGenrate] = useState(false);
    const [genratedLink, setGenratedLink] = useState('');
    const [refcopy, setRefcopy] = useState(false);
    const [error, setError] = useState('');

    const history = useHistory()

    useEffect(() => {
        return history.listen((location) => {
            if (location.pathname === '/') {
                window.location.reload();
            }
        })
    }, [history])

    const handleGenrate = () => {
        let web3 = getWeb3(chainId);
        let checkAddressisValid = web3.utils.isAddress(refAddress);
        if (checkAddressisValid) {
            setGenratedLink(`${window.location.origin}?referrer=${refAddress}`)
            setIsLinkGenrate(true);
            setError('');
        }
        else {
            setError('please enter valid address.');

        }

    }

    return (
        <>
            <section className="main-container" >
                <div className="referra-body-container" >
                    <Container style={{ "marginBottom": "100px" }}>
                        <Row>
                            <Col>
                                <p className="title is-2 referra-title text-red">Flash Sender Referral Program</p>
                                <img src={refImg} alt="referral info" className="img-fluid mb-3" />
                                <p className="tips1 title is-5">You will earn 10% from any airdrop done by your referral.</p>
                            </Col>
                        </Row>
                        <Row className="mt-5">
                            <Col sm={12} md={12} lg={12}>
                                <p className="label-title">Put your wallet address below :</p>
                            </Col>
                            <Col sm={12} md={12} lg={10}>
                                <Form.Group className="mb-3">
                                    <Form.Control type="text" name="refAdress" onChange={(e) => setRefAddress(e.target.value)} value={refAddress} />
                                    <span className="text-danger mt-2">{error}</span>
                                </Form.Group>
                            </Col>

                            <Col sm={12} md={12} lg={2}>
                                <Button variant="outline-primary" onClick={() => handleGenrate()}>Generate</Button>
                            </Col>
                        </Row>
                        {isLinkGenrate &&
                            <Row className="mb-5">
                                <Col sm={12} md={12} lg={12}>
                                    <p className="label-title">Generated referral link</p>
                                </Col>
                                <Col sm={12} md={12} lg={10}>
                                    <div className="linkContent"><a target="_blank" rel="noreferrer" href={genratedLink}>{genratedLink ? genratedLink : '-'}</a></div>
                                </Col>
                                <Col sm={12} md={12} lg={2}>

                                    <CopyToClipboard text={genratedLink} onCopy={() => {
                                        setRefcopy(true);
                                        setTimeout(() => {
                                            setRefcopy(false);
                                        }, 2000)
                                    }}>
                                        <Button variant="outline-primary">{refcopy ? 'copied' : 'Copy Link'}</Button>
                                    </CopyToClipboard>
                                </Col>
                            </Row>
                        }
                    </Container>
                </div>
                <div className='footer-text'>
                    <Footer />
                </div>
            </section>
        </>
    )
}
export default Referral
