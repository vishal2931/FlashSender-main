import React, { useContext, useState } from "react";
import { Col, Form, Row, Container } from "react-bootstrap";
import Slider from 'react-rangeslider'

import { Context, setupGas } from "../context/context";
import { supportNetwork } from "../helper/network";
import { useWeb3React } from "@web3-react/core";
import { formatPrice, getContract } from "../helper/contractHelper";
import { contract } from "../helper/contract";
import tokenAbi from '../json/token.json';
import { toast } from "react-toastify";
import { getWeb3 } from "../helper/connectors";
import { ethers } from "ethers";
import nftAbi from '../json/nftAbi.json';
import exactMathNode from 'exact-math';
// import fromExponential from "from-exponential";


const Step2 = () => {
    const { chainId, account, library } = useWeb3React();
    const { setMultisendApp, multisendApp } = useContext(Context);
    const [approveLimit, setApproveLimit] = useState(1);
    const [loading, setALoading] = useState(false);





    const handleApprove = async () => {
        if (account) {
            if (chainId) {
                try {
                    setALoading(true);
                    let multiSenderAddress = contract[chainId] ? contract[chainId].MULTISENDERADDRESS : contract['default'].MULTISENDERADDRESS;
                    let tx;
                    if (multisendApp.type === 3) {
                        let tokenContract = getContract(nftAbi, multisendApp.tokenAddress, library);
                        tx = await tokenContract.setApprovalForAll(multiSenderAddress, true, { 'from': account });
                    }
                    else {
                        let tokenContract = getContract(tokenAbi, multisendApp.tokenAddress, library);
                        let amount = 0;
                        if (approveLimit === 1) {
                            let totalAmounts = parseFloat(parseFloat(multisendApp.totalAmountSend) + 1).toFixed(5);
                            console.log(totalAmounts);
                            amount = ethers.utils.parseUnits(totalAmounts.toString(), multisendApp.tokenDecimal).toString();
                        }
                        else {
                            amount = ethers.utils.parseEther('100000000000000000000000000000000000000').toString();
                        }


                        tx = await tokenContract.approve(multiSenderAddress, amount, { 'from': account });
                    }
                    toast.loading('Waiting for confirmation...');
                    var interval = setInterval(async function () {
                        let web3 = getWeb3(chainId);
                        var response = await web3.eth.getTransactionReceipt(tx.hash);
                        if (response != null) {
                            clearInterval(interval)
                            if (response.status === true) {
                                toast.dismiss();
                                toast.success('Your last transaction is success!!');

                                let totalGasPrice = await setupGas(multisendApp, chainId, account);

                                if (totalGasPrice && totalGasPrice.response.error === 'OK') {
                                    setMultisendApp({
                                        ...multisendApp,
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
                                        step: 2,
                                        isApprove: true
                                    });
                                }
                                else {
                                    toast.error(totalGasPrice.error);
                                    setMultisendApp({
                                        ...multisendApp,
                                        isApprove: true
                                    });
                                }
                                setALoading(false);
                            }
                            else if (response.status === false) {
                                toast.error('error ! Your last transaction is failed.');
                                setALoading(false);
                            }
                            else {
                                toast.error('error ! something went wrong.');
                                setALoading(false);
                            }
                        }
                    }, 5000);


                }
                catch (err) {

                    toast.error(err.reason);
                    setALoading(false);
                }
            }
            else {
                toast.error('Please connect to valid network !');
                setALoading(false);
            }

        }
        else {
            toast.error('Please Connect Wallet!');
            setALoading(false);
        }
    }


    const handleSubmit = async () => {
        if (account) {
            if (chainId) {
                if (parseFloat(multisendApp.totalCurrencyValue) < parseFloat(multisendApp.currencyBalance)) {
                    setMultisendApp({ ...multisendApp, step: 3 });
                }
                else {
                    toast.error('don\'t have enough fund for transaction submit!!');
                }
            }
            else {
                toast.error('Please connect to valid network !');

            }

        }
        else {
            toast.error('Please Connect Wallet!');

        }
    }


    const handleGasChange = async (value) => {
        let totalCurrencyValue = (parseFloat(multisendApp.txGasCount) * parseFloat(value)) / Math.pow(10, 9);
        // totalCurrencyValue = totalCurrencyValue + ((parseFloat(multisendApp.totalCurrencyValue) * 30) / 100);

        setMultisendApp({
            ...multisendApp,
            currentGas : value,
            totalCurrencyValue: parseFloat(totalCurrencyValue).toFixed(5)
        });
    }



    return (
        <>
            <div className='main-section'>
                <Container>
                    <div className="step-container">
                        <ul className="step2">
                            <li className="step-li">Prepare</li>
                            <li className="step-li step-li-actived">{multisendApp.isApprove ? 'Submit' : 'Approve'}</li>
                            <li className="step-li">Send</li>
                        </ul>
                    </div>
                    <div className="process-step">
                        <div className="process-active-step2">
                            <div className="process-left"></div>
                            <div className="process-right"></div>
                        </div>
                    </div>

                    <Row className="mt-5">
                        <Col sm={12} md={12} lg={8}>
                            <Form>
                                <Row>
                                    <Col sm={12} md={12} lg={12}>
                                        {multisendApp && multisendApp.isApprove &&
                                            <>
                                                <Form.Label>Network Speed ({multisendApp.currentGas ? multisendApp.currentGas : 0} Gwei)</Form.Label>
                                                <Slider
                                                    progress
                                                    min={multisendApp.minGas ? parseFloat(multisendApp.minGas) : 0}
                                                    max={multisendApp.maxGas ? parseFloat(multisendApp.maxGas) : 0}
                                                    step={multisendApp.gasStep ? parseFloat(multisendApp.gasStep) : 0}
                                                    value={multisendApp.currentGas ? parseFloat(multisendApp.currentGas) : 0}
                                                    renderTooltip={value => `${formatPrice(parseFloat(value))} Gwei`}
                                                    onChange={value => {
                                                        handleGasChange(value);
                                                    }}
                                                    className="mt-5"
                                                />
                                                <div className="d-flex justify-content-between">
                                                    <span class="b-slider-tick-label">Slow</span>
                                                    <span class="b-slider-tick-label">Fast</span>
                                                    <span class="b-slider-tick-label">Instant</span>

                                                </div>
                                            </>
                                        }
                                        <Form.Group className="mb-3">
                                            <Form.Label>Summary</Form.Label>
                                            <table className="blockTable table">
                                                <tbody>
                                                    {multisendApp && multisendApp.isApprove ? (
                                                        <>
                                                            <tr>
                                                                <td className="td-container">
                                                                    <p className="td-title">
                                                                        {multisendApp.sendAddress ? multisendApp.sendAddress.length : '-'}
                                                                    </p>
                                                                    <p className="td-value">
                                                                        Total number of addresses
                                                                    </p>
                                                                </td>
                                                                <td className="td-container">
                                                                    <p className="td-title">
                                                                        {multisendApp.type === 3 ? multisendApp.sendAmounts.length : multisendApp.totalAmountSend ? formatPrice(multisendApp.totalAmountSend) : '-'}&nbsp;
                                                                        {multisendApp.tokenSymbol ? multisendApp.tokenSymbol : '-'}
                                                                    </p>
                                                                    <p className="td-value">
                                                                        Total number of tokens to be sent
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="td-container">
                                                                    <p className="td-title">
                                                                        {multisendApp.totalTx ? multisendApp.totalTx : 0}
                                                                    </p>
                                                                    <p className="td-value">
                                                                        Total number of transactions needed
                                                                    </p>
                                                                </td>
                                                                <td className="td-container">
                                                                    <p className="td-title">
                                                                        {multisendApp.tokenBalance ? formatPrice(multisendApp.tokenBalance) : '-'}&nbsp;
                                                                        {multisendApp.tokenSymbol ? multisendApp.tokenSymbol : '-'}
                                                                    </p>
                                                                    <p className="td-value">
                                                                        Your token balance
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="td-container">
                                                                    <p className="td-title">
                                                                        {(multisendApp.totalCurrencyValue && multisendApp.totalCharges) ? exactMathNode.add(multisendApp.totalCurrencyValue, multisendApp.totalCharges) : '.....'}&nbsp;
                                                                        {supportNetwork && supportNetwork[chainId ? chainId : 'default'].symbol}
                                                                    </p>
                                                                    <p className="td-value">
                                                                        Approximate cost of operation

                                                                    </p>
                                                                </td>
                                                                <td className="td-container">
                                                                    <p className="td-title">
                                                                        {multisendApp.currencyBalance ? formatPrice(multisendApp.currencyBalance) : '-'}&nbsp;
                                                                        {supportNetwork[chainId ? chainId : 'default'].symbol}
                                                                    </p>
                                                                    <p className="td-value">
                                                                        Your
                                                                        {supportNetwork[chainId ? chainId : 'default'].symbol}
                                                                        balance

                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <tr>
                                                                <td className="td-container">
                                                                    <p className="td-title">
                                                                        {multisendApp.totalAllowence ? parseFloat(multisendApp.totalAllowence) > 10000000000000000000000 ? '&infin;' : formatPrice(multisendApp.totalAllowence) : 0}&nbsp;
                                                                        {multisendApp.tokenSymbol ? multisendApp.tokenSymbol : '-'}
                                                                    </p>
                                                                    <p className="td-value">
                                                                        Your current flashsender allowance
                                                                    </p>
                                                                </td>
                                                                <td className="td-container">
                                                                    <p className="td-title">
                                                                        {multisendApp.type === 3 ? multisendApp.sendAmounts.length : multisendApp.totalAmountSend ? formatPrice(multisendApp.totalAmountSend) : '-'}&nbsp;
                                                                        {multisendApp.tokenSymbol ? multisendApp.tokenSymbol : '-'}
                                                                    </p>
                                                                    <p className="td-value">
                                                                        Total number of tokens to be sent
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="td-container">
                                                                    <p className="td-title">
                                                                        {multisendApp.currencyBalance ?
                                                                            formatPrice(multisendApp.currencyBalance) : '-'}&nbsp;
                                                                        {supportNetwork[chainId ? chainId : 'default'].symbol}
                                                                    </p>
                                                                    <p className="td-value">
                                                                        Your
                                                                        {supportNetwork[chainId ? chainId : 'default'].symbol}
                                                                        balance

                                                                    </p>
                                                                </td>
                                                                <td className="td-container">
                                                                    <p className="td-title">
                                                                        {multisendApp.tokenBalance ? formatPrice(multisendApp.tokenBalance) : '-'} &nbsp;
                                                                        {multisendApp.tokenSymbol ? multisendApp.tokenSymbol : '-'}
                                                                    </p>
                                                                    <p className="td-value">
                                                                        Your token balance
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </>
                                                    )}
                                                </tbody>
                                            </table>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            {!multisendApp.isApprove && multisendApp.type === 2 &&
                                                <React.Fragment>
                                                    <Form.Label>Amount to approve</Form.Label>
                                                    <div className="">

                                                        <div key={`inline-radio`} className="d-flex align-items-center justify-content-between">
                                                            <Form.Check
                                                                inline
                                                                label={`Exact amount to be sent (${multisendApp.totalAmountSend ? formatPrice(multisendApp.totalAmountSend) : 0} ${multisendApp.tokenSymbol ? multisendApp.tokenSymbol : '-'})`}
                                                                name="limit"
                                                                value={1}
                                                                type="radio"
                                                                onClick={() => setApproveLimit(1)}
                                                                checked={approveLimit === 1 ? true : false}
                                                                id={`inline-radio-1`}
                                                            />
                                                            <Form.Check
                                                                inline
                                                                label="Unlimited amount"
                                                                name="limit"
                                                                value={2}
                                                                onClick={() => setApproveLimit(2)}
                                                                checked={approveLimit === 2 ? true : false}
                                                                type="radio"
                                                                id={`inline-radio-2`}
                                                            />
                                                        </div>

                                                    </div>
                                                </React.Fragment>
                                            }
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12} md={12} lg={12}>
                                        <button type="button" onClick={() => {
                                            setMultisendApp({ ...multisendApp, sendAddressChunk: [], sendBalanceChunk: [], sentTxDone: false, txGasCount: 0, totalCharges: 0, totalAmountSend: 0, 'step': 1  });
                                        }}
                                            className='btn btn-prev mt-5 mb-4'>
                                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" ><polyline points="15 18 9 12 15 6"></polyline></svg>
                                        </button>
                                        {multisendApp && !multisendApp.isApprove ? (
                                            <button
                                                type="button"
                                                className='btn btn-next mt-5 mb-4'
                                                disabled={loading}
                                                onClick={() => handleApprove()}
                                            >
                                                {loading ? 'loading...' : 'Approve'}
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className='btn btn-next mt-5 mb-4'
                                                disabled={loading}
                                                onClick={() => handleSubmit()}
                                            >
                                                {loading ? 'loading...' : 'Submit'}
                                            </button>
                                        )
                                        }
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

export default Step2;