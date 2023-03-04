import React, { useContext } from 'react';
import { Col, Form, Row, Container } from "react-bootstrap"
import { Context, setupGas } from "../context/context";
import upArrowImg from '../images/up-arrow.png';
import MultisendAddressInput from './MultisendAddressInput';
import MultisendAlloctionInput from './MultisendAlloctionInput';
import { useWeb3React } from "@web3-react/core";
import ErrorComp from './ErrorComp';
import loadingImg from '../images/loader-btn.gif';
import { toast } from 'react-toastify';
import { checkValidation } from '../context/context';
import { getWeb3 } from '../helper/connectors';
import { useLocation } from "react-router-dom";
import { contract } from '../helper/contract';
import { supportNetwork } from '../helper/network';
import tokenAbi from '../json/token.json';
import nftAbi from '../json/nftAbi.json';




const Step1 = () => {
    const { chainId, account } = useWeb3React();
    const { open, setOpen, setMultisendApp, multisendApp, setApiLoader, apiLoader, step1Loader, setstep1Loader, inputDrop, setInputDrop , setTxhash, setSuccess, setRejectTx, setCancelProcess, setLoading } = useContext(Context);
    const search = useLocation().search;


    const handleNextPage = async () => {
        try {
            setTxhash([]);
            setSuccess(false);
            setRejectTx(false);
            setCancelProcess(false);
            setLoading(false);
            if (account && chainId) {
                setstep1Loader(true);
                let web3 = getWeb3(chainId);



                if ((multisendApp.type === 3) || parseFloat(multisendApp.tokenBalance) >= parseFloat(multisendApp.totalAmountSend)) {
                    checkValidation(multisendApp, chainId, account).then(async (validateData) => {

                        if (parseInt(validateData.error) <= 0) {
                            const refAdd = new URLSearchParams(search).get('referrer');
                            let refAddress = refAdd !== null ? refAdd : '0x0000000000000000000000000000000000000000';
                            let allowance = 0;
                            if (multisendApp.type === 2) {
                                let tokenContract = new web3.eth.Contract(tokenAbi, multisendApp.tokenAddress);
                                allowance = await tokenContract.methods.allowance(account, contract[chainId] ? contract[chainId].MULTISENDERADDRESS : contract['default'].MULTISENDERADDRESS).call();
                                allowance = allowance / Math.pow(10, multisendApp.tokenDecimal);
                            }
                            else if (multisendApp.type === 3) {
                                let nftContract = new web3.eth.Contract(nftAbi, multisendApp.tokenAddress);
                                allowance = await nftContract.methods.isApprovedForAll(account, contract[chainId] ? contract[chainId].MULTISENDERADDRESS : contract['default'].MULTISENDERADDRESS).call();
                                allowance = allowance ? 10 : 0;
                            }

                            if (parseFloat(allowance) > 0 || multisendApp.type === 1) {

                                if (multisendApp.type === 2 && parseFloat(allowance) < parseFloat(multisendApp.totalAmountSend)) {
                                    setMultisendApp({ ...multisendApp, ...validateData.data, step: 2, isApprove: false, refAddress });
                                    setstep1Loader(false);
                                    return;
                                }
                                else if (multisendApp.type === 3 && parseFloat(allowance) < 1) {

                                    setMultisendApp({ ...multisendApp, ...validateData.data, step: 2, isApprove: false, refAddress });
                                    setstep1Loader(false);
                                    return;
                                }
                            }
                            else {

                                setMultisendApp({ ...multisendApp, totalAllowence: allowance, ...validateData.data, step: 2, isApprove: false, refAddress });
                                setstep1Loader(false);
                                return;
                            }




                            let totalGasPrice = await setupGas({ ...multisendApp, ...validateData.data }, chainId, account);

                            if (totalGasPrice && totalGasPrice.response.error === 'OK') {
                                console.log(totalGasPrice);
                                setMultisendApp({
                                    ...multisendApp,
                                    ...validateData.data,
                                    currentGas: totalGasPrice.currentGas,
                                    minGas: totalGasPrice.minGas,
                                    maxGas: totalGasPrice.maxGas,
                                    gasStep: totalGasPrice.gasStep,
                                    totalCurrencyValue: parseFloat(totalGasPrice.response.totalCurrencyValue).toFixed(5),
                                    totalCharges: totalGasPrice.response.totalCharges,
                                    txGasCount: totalGasPrice.response.txGasCount,
                                    totalTx: totalGasPrice.response.totalTx,
                                    sendAddressChunk: totalGasPrice.response.sendAddressChunk,
                                    sendBalanceChunk: totalGasPrice.response.sendBalanceChunk,
                                    txGasLimit: totalGasPrice.response.txGasLimit,
                                    refAddress,
                                    step: 2,
                                    isApprove: true
                                });
                            }
                            else {
                                toast.error(totalGasPrice.response.error);
                                setMultisendApp({
                                    ...multisendApp,
                                    ...validateData.data,
                                    refAddress
                                });
                            }

                        }
                        else {
                            setMultisendApp({ ...multisendApp, ...validateData.data });
                            toast.error(validateData.errorMessage);
                        }
                        setstep1Loader(false);
                    });
                }
                else {
                    toast.error('insufficient funds to transfer!');
                    setstep1Loader(false);
                }
            }
            else {
                toast.error('Please connect wallet!!');
                setstep1Loader(false);
            }
        }
        catch (err) {
            console.log(err.message);
            setstep1Loader(false);
            toast.error('Something went wrong! please try again');
        }

        return true;

    }


    return (
        <>
            <div className='main-section'>
                <Container>
                    <div className="step-container">
                        <ul className="step0">
                            <li className="step-li step-li-actived">Prepare</li>
                            <li className="step-li">Approve</li>
                            <li className="step-li">Send</li>
                        </ul>
                        {open ? (
                            <div class="closeButton" onClick={() => setOpen(!open)}>
                                <span class="icon is-medium">
                                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </span>
                            </div>
                        ) : (
                            <div class="closeButton" onClick={() => setOpen(!open)}>
                                <span class="icon is-medium">
                                    <img src={upArrowImg} height="15" width="15" alt="up-arrow" />
                                </span>
                            </div>
                        )}

                    </div>

                    <div className="process-step">
                        <div className="process-active-step1">
                            <div className="process-left"></div>
                            <div className="process-right"></div>
                        </div>
                    </div>

                    <Row className="mt-5">
                        <Col sm={12} md={12} lg={8}>
                            <Form>
                                <Row>
                                    <MultisendAddressInput
                                        multisendApp={multisendApp}
                                        setMultisendApp={setMultisendApp}
                                        inputDrop={inputDrop}
                                        setInputDrop={setInputDrop}
                                        setApiLoader={setApiLoader}
                                        apiLoader={apiLoader}
                                    />
                                    <MultisendAlloctionInput
                                        multisendApp={multisendApp}
                                        setMultisendApp={setMultisendApp}
                                        setApiLoader={setApiLoader}
                                        apiLoader={apiLoader}
                                    />
                                    <ErrorComp
                                        multisendApp={multisendApp}
                                        setMultisendApp={setMultisendApp}
                                        step1Loader={step1Loader}
                                        setApiLoader={setApiLoader}
                                        apiLoader={apiLoader}
                                    />


                                    <Col sm={12} md={4} lg={4}>
                                        <button type='button' disabled={apiLoader} className='btn btn-next mt-5 mb-4' onClick={() => {
                                            handleNextPage()
                                        }}>
                                            Next
                                            <img style={{ "display": `${step1Loader ? 'inline-block' : 'none'}` }} src={loadingImg} alt="loading" height={20} width={20} />
                                        </button>
                                    </Col>

                                    <span className='text-danger mt-3 mb-5' style={{ "fontSize": "13px" }}>Note : Please exclude FlashSender address <a target="_blank" rel="noreferrer" className='text-danger' href={`${supportNetwork[chainId ? chainId : 'default'].accountUrl}${contract[chainId ? chainId : 'default'].MULTISENDERADDRESS}`}>{contract[chainId ? chainId : 'default'].MULTISENDERADDRESS}</a> from fees, max tx amount.</span>

                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default Step1