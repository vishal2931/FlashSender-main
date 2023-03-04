import React, { useContext, useEffect, useRef } from "react";
import { Col, Form, Row, Container } from "react-bootstrap";
import { Context, multisend_default } from "../context/context";
import { contract } from "../helper/contract";
import { useWeb3React } from "@web3-react/core";
import { getContract } from "../helper/contractHelper";
import multisendAbi from '../json/multisenderAbi.json';
import { ethers } from "ethers";
import exactMathNode from "exact-math";
import Transaction from "./Transaction";


const Step3 = () => {
    const { setMultisendApp, multisendApp, loading, setLoading, txhash, setTxhash, suceess, setSuccess, rejectedtx, setRejectTx, cancelProcess } = useContext(Context);
    const { chainId, account, library } = useWeb3React();
    const isCalledRef = useRef(false);

    const sleep = ms => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    useEffect(() => {

        if (account && chainId && !isCalledRef.current && !multisendApp.sentTxDone) {
            try{
                document.getElementById("submit-btn").click()
                isCalledRef.current = true;
                setMultisendApp({ ...multisendApp, step: 3, sentTxDone: true });
            }
            catch(err){
                console.log(err.message);
            }
        }
        // eslint-disable-next-line
    }, [account]);


    const handleSubmit = async () => {
        setLoading(true);
        setRejectTx(false);

        console.log(multisendApp);

        let multiSenderAddress = contract[chainId] ? contract[chainId].MULTISENDERADDRESS : contract['default'].MULTISENDERADDRESS;
        let multisenderContract = getContract(multisendAbi, multiSenderAddress, library);
        let getCharges = await multisenderContract.charges();

        async function* asyncGenerator() {
            let i = 0;
            while (i < multisendApp.sendAddressChunk.length) {
                yield i++;
            }
        }


        for await (const num of asyncGenerator()) {
            if ((txhash[num] === 'undefined' || txhash[num] === undefined || txhash[num].hash === '' || txhash[num].status === 5) && !cancelProcess) {
                try {

                    let tx;
                    if (multisendApp.type === 3) {
                        tx = await multisenderContract.flashNft(
                            num === 0 ? multisendApp.refAddress : "0x0000000000000000000000000000000000000000",
                            multisendApp.tokenAddress,
                            multisendApp.sendAddressChunk[num],
                            multisendApp.sendBalanceChunk[num],
                            { 'from': account, gasPrice: ethers.utils.parseUnits(parseFloat(multisendApp.currentGas).toFixed(8).toString(), 9), 
                                value: getCharges
                               
                            });
                    }
                    else if (multisendApp.type === 2) {
                        tx = await multisenderContract.flashToken(
                            num === 0 ? multisendApp.refAddress : "0x0000000000000000000000000000000000000000",
                            multisendApp.tokenAddress,
                            multisendApp.sendAddressChunk[num],
                            multisendApp.sendBalanceChunk[num].map((value) => ethers.utils.parseUnits(parseFloat(value).toFixed(multisendApp.tokenDecimal).toString(), multisendApp.tokenDecimal)),
                            { 'from': account, gasPrice: ethers.utils.parseUnits(parseFloat(multisendApp.currentGas).toFixed(8).toString(), 9), 
                            value: getCharges
                            
                        });
                    }
                    else if (multisendApp.type === 1) {
                        let totalAmount = multisendApp.sendBalanceChunk[num].reduce((partialSum, a) => parseFloat(partialSum) + parseFloat(a), 0)
                        totalAmount = exactMathNode.add(getCharges.toString() / Math.pow(10, 18), totalAmount)
                        tx = await multisenderContract.flashNative(
                            num === 0 ? multisendApp.refAddress : "0x0000000000000000000000000000000000000000",
                            multisendApp.sendAddressChunk[num],
                            multisendApp.sendBalanceChunk[num].map((value) => ethers.utils.parseUnits(value.toString(), 18)),
                            {
                                'from': account,
                                gasPrice: ethers.utils.parseUnits(parseFloat(multisendApp.currentGas).toFixed(8).toString(), 9),
                                value: ethers.utils.parseUnits(totalAmount.toString(), 18)
                                
                            });
                    }
                    txhash[num] = { hash: tx.hash, status: 2 }
                    setTxhash({ ...txhash });
                    if (num === (multisendApp.sendAddressChunk.length - 1)) {
                        setLoading(false);
                        setSuccess(true);
                    }
                    await sleep(3000).then();
                }
                catch (err) {
                    console.log(err.message);
                    setRejectTx(true);
                    txhash[num] = { hash: '', status: 5 }
                    setTxhash({ ...txhash });
                    if (num === (multisendApp.sendAddressChunk.length - 1)) {
                        setLoading(false);
                        setSuccess(true);
                    }
                }
            }
            else {
                if (num === (multisendApp.sendAddressChunk.length - 1)) {
                    setLoading(false);
                    setSuccess(true);
                }
            }
        }
    }

    return (
        <>
            <div className='main-section'>
                <Container>
                    <div className="step-container">
                        <ul className="step3">
                            <li className="step-li">Prepare</li>
                            <li className="step-li">Approve</li>
                            <li className="step-li step-li-actived">Send</li>
                        </ul>
                    </div>
                    <div className="process-step">
                        <div className="process-active-step3">
                            <div className="process-left"></div>
                        </div>
                    </div>

                    <Row className="mt-5">
                        <Col sm={12} md={12} lg={12}>
                            <Form>
                                <Row>
                                    <Col sm={12} md={12} lg={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Transactions were sent out. Now wait till all the transactions were mined. (Please don't refresh or close page, may affect transaction.)</Form.Label>
                                            {txhash && Object.keys(txhash).length > 0 && Object.keys(txhash).map((rowdata, index) => {
                                                return (
                                                    txhash[index].status === 5 ? (
                                                        <article className="media notification is-white">
                                                            <div className="media-left">{index + 1}</div>
                                                            <div className="media-content">
                                                                <div className="content">
                                                                    <a href="#sec">Transaction was rejected by your wallet, please click the resend button below</a>
                                                                </div>
                                                            </div>
                                                            <div className="media-right">
                                                                <span>
                                                                    <span className="icon has-text-success is-small">
                                                                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="#FF0000" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </article>
                                                    ) :
                                                        (
                                                            <Transaction
                                                                key={index}
                                                                txhash={txhash}
                                                                index={index}
                                                                setTxhash={setTxhash}
                                                            />
                                                        )
                                                )
                                            })}



                                        </Form.Group>
                                        {suceess &&
                                            <article class="notification is-success">
                                                Congratulations, your bulksend transactions were sent out successfully
                                            </article>
                                        }
                                    </Col>
                                    <Col sm={12} md={12} lg={12}>
                                        <button type="button"
                                            onClick={() => { setMultisendApp({ ...multisendApp, step: 2 }) }}

                                            className='btn btn-prev mt-5 mb-4'>
                                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" ><polyline points="15 18 9 12 15 6"></polyline></svg>
                                        </button>


                                        {rejectedtx ? (
                                            <>
                                                <button
                                                    type="button"
                                                    className='btn btn-next mt-5 mb-4'
                                                    disabled={loading}
                                                    onClick={() => !loading && rejectedtx ? handleSubmit() : ''}
                                                >

                                                    {loading ? 'loading...' : rejectedtx ? 'Resend' : 'Done'}
                                                </button>
                                            </>
                                        ) : (
                                            !multisendApp.sentTxDone ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        className='btn btn-next mt-5 mb-4'
                                                        id="submit-btn"
                                                        disabled={loading}
                                                        onClick={() => !loading ? handleSubmit() : ''}
                                                    >

                                                        {loading ? 'loading...' : rejectedtx ? 'Resend' : 'Done'}
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        type="button"
                                                        className='btn btn-next mt-5 mb-4'
                                                        id="submit-btn"
                                                        disabled={loading}
                                                        onClick={() => setMultisendApp({ ...multisend_default })}
                                                    >

                                                        {loading ? 'loading...' : rejectedtx ? 'Resend' : 'Done'}
                                                    </button>
                                                </>
                                            )


                                        )}






                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default Step3
