import { createContext, useEffect, useState } from 'react';
import { getWeb3 } from '../helper/connectors';
import { getNFTOwner } from '../helper/constant';
import { getMultisenderContract } from '../helper/contractHelper';
import { ethers } from 'ethers';
import exactMathNode from 'exact-math';
import { supportNetwork } from '../helper/network';
import fromExponential from 'from-exponential';
import axios from 'axios';


export const Context = createContext();

export const multisend_default = {
    step: 1,
    inputTokenAddress: "",
    tokenAddress: "",
    tokenSymbol: "",
    tokenName: "",
    tokenDecimal: "",
    tokenBalance: 0,
    currencyBalance: 0,
    totalAllowence: 0,
    isApprove: false,
    type: 0, // 0=nothing , 1=native , 2= token , 3=NFT
    userInputAddress: '',
    isFile: false,
    sendAddress: [],
    sendAmounts: [],
    invalidAddresses: [],
    dublicatesAddress: [],
    dublicatesNftId: [],
    invalidNftId: [],
    invalidOwnerId: [],
    useWalletNFT: [],
    totalAmountSend: 0,
    keepDuplicates: false,
    refresh: 0,
    currentGas: 0,
    minGas: 0,
    maxGas: 0,
    gasStep: 0,
    totalCurrencyValue: 0,
    totalCharges: 0,
    txGasCount: 0,
    refAddress: '',
    totalTx: 0,
    sentTxDone: false,
    sendAddressChunk: [],
    sendBalanceChunk: [],
    txGasLimit: []
}


export const ContextProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [connectDrop, setConnectDrop] = useState(false);
    const [networkModal, setNetworkModal] = useState(false);
    const [inputDrop, setInputDrop] = useState(false);
    const [multisendApp, setMultisendApp] = useState(multisend_default);
    const [step1Loader, setstep1Loader] = useState(false);
    const [apiLoader, setApiLoader] = useState(false);
    const [loading, setLoading] = useState(false);
    const [txhash, setTxhash] = useState([]);
    const [suceess, setSuccess] = useState(false);
    const [rejectedtx, setRejectTx] = useState(false);

    const [cancelProcess, setCancelProcess] = useState(false);



    useEffect(() => {
        const onScroll = () => {
            const scrollTotal =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;
            if (document.documentElement.scrollTop / scrollTotal > 0.1) {
                setOpen(true);
            } else {
                // setOpen(false);
            }
        };
        document.addEventListener("scroll", onScroll, true);
        return () => document.removeEventListener("scroll", onScroll, true);
    }, []);


    return (
        <Context.Provider
            value={{
                open,
                setOpen,
                connectDrop,
                setConnectDrop,
                networkModal,
                setNetworkModal,
                multisendApp,
                setMultisendApp,
                inputDrop,
                setInputDrop,
                step1Loader,
                setstep1Loader,
                apiLoader,
                setApiLoader,
                loading,
                setLoading,
                txhash,
                setTxhash,
                suceess,
                setSuccess,
                rejectedtx,
                setRejectTx,
                cancelProcess,
                setCancelProcess
            }}
        >{children}</Context.Provider>
    )
}


export async function checkValidation(multisendApp = multisend_default, chainId, account) {

    let error = 0;
    let errorMessage = '';
    let dataSet = {};
    if ((multisendApp.tokenAddress && multisendApp.tokenAddress !== '' && multisendApp.type !== 0) || multisendApp.type === 1) {
        if (multisendApp.userInputAddress.length > 0) {
            let web3 = getWeb3(chainId);
            let breakLineArray = multisendApp.userInputAddress.split("\n");
            let dublicates_address = [];
            let dublicates_nftId = [];
            let invalid_nftId = [];
            let invalid_addresses = [];
            let balances_to_send = [];
            let addresses_to_send = [];
            let invalid_ownerNftId = [];

            if (breakLineArray.length > 0) {
                if (multisendApp.type === 3) {
                    let userNFTlist = [];
                    if (multisendApp.useWalletNFT.length <= 0) {
                        userNFTlist = await getNFTOwner(multisendApp.tokenAddress, supportNetwork[chainId ? chainId : 'default'].hexId, account)
                    }
                    else {
                        userNFTlist = multisendApp.useWalletNFT;
                    }
                    try {

                        if (userNFTlist && userNFTlist.length > 0) {


                            await Promise.all(
                                await breakLineArray.map(async (rowdata, index) => {
                                    let sAddress = rowdata.trim().split(',')[0].toString().toLowerCase();
                                    let sAmount = rowdata.trim().split(',')[1];
                                    if (sAddress !== '') {
                                        let checkAddressValid = web3.utils.isAddress(sAddress);
                                        if (!checkAddressValid) {
                                            invalid_addresses.push([index + 1, sAddress]);
                                        }

                                        const indexAddr = addresses_to_send.indexOf(sAddress);

                                        if ((indexAddr !== -1 && multisendApp.type !== 3) || (indexAddr !== -1 && multisendApp.type === 3 && !multisendApp.keepDuplicates)) {
                                            dublicates_address.push([index + 1, sAddress]);
                                        }
                                        //If NFT Send


                                        if (sAmount % 1 !== 0) {
                                            invalid_nftId.push([index + 1, sAmount]);
                                        }
                                        else if (account) {
                                            if (!userNFTlist.includes(sAmount)) {
                                                invalid_ownerNftId.push([index + 1, sAmount])
                                            }
                                        }

                                        const balAddr = balances_to_send.indexOf(sAmount);
                                        if (balAddr !== -1) {
                                            dublicates_nftId.push([index + 1, sAmount]);
                                        }


                                        addresses_to_send.push(sAddress);
                                        balances_to_send.push(sAmount)
                                    }
                                })
                            ).then(() => {

                                dataSet = {
                                    ...multisendApp,
                                    totalAmountSend: balances_to_send.reduce((partialSum, a) => exactMathNode.add(partialSum, a), 0),
                                    sendAddress: addresses_to_send,
                                    sendAmounts: balances_to_send,
                                    invalidAddresses: invalid_addresses,
                                    dublicatesAddress: dublicates_address,
                                    dublicatesNftId: dublicates_nftId,
                                    invalidNftId: invalid_nftId,
                                    invalidOwnerNftId: invalid_ownerNftId,
                                    useWalletNFT: userNFTlist,
                                    isFile: false
                                }

                                if (invalid_addresses.length > 0 || dublicates_address.length > 0 || dublicates_nftId.length > 0 || invalid_nftId.length > 0 || invalid_ownerNftId.length > 0 || addresses_to_send.length <= 0 || balances_to_send.length <= 0) {
                                    error += 1;
                                    errorMessage = 'Please check details and fix errors';
                                }

                            });
                        }
                        else {
                            dataSet = {
                                ...multisendApp,
                                isFile: false
                            }

                            error += 1;
                            errorMessage = 'no nft found in wallet!!!';
                        }
                    }
                    catch (err) {
                        dataSet = {
                            ...multisendApp,
                            isFile: false
                        }

                        error += 1;
                        errorMessage = err.reason ? err.reason : error.message;


                    }
                }
                else {
                    try {
                        await Promise.all(
                            breakLineArray.map(async (rowdata, index) => {
                                let sAddress = rowdata.trim().split(',')[0].toString().toLowerCase();
                                let sAmount = rowdata.trim().split(',')[1];
                                if (sAddress !== '') {
                                    let checkAddressValid = web3.utils.isAddress(sAddress);
                                    if (!checkAddressValid) {
                                        invalid_addresses.push([index + 1, sAddress]);
                                    }

                                    const indexAddr = addresses_to_send.indexOf(sAddress);

                                    if ((indexAddr !== -1 && !multisendApp.keepDuplicates)) {
                                        dublicates_address.push([index + 1, sAddress]);
                                    }
                                    //If NFT Send
                                    if (multisendApp.isNft) {

                                        if (sAmount % 1 !== 0) {
                                            invalid_nftId.push([index + 1, sAmount]);
                                        }

                                        const indexAddr = balances_to_send.indexOf(sAmount);
                                        if (indexAddr !== -1) {
                                            dublicates_nftId.push([index + 1, sAmount]);
                                        }
                                    }

                                    addresses_to_send.push(sAddress);
                                    balances_to_send.push(sAmount)
                                }
                            })
                        ).then(() => {

                            dataSet = {
                                ...multisendApp,
                                totalAmountSend: balances_to_send.reduce((partialSum, a) => exactMathNode.add(partialSum, a), 0),
                                sendAddress: addresses_to_send,
                                sendAmounts: balances_to_send,
                                invalidAddresses: invalid_addresses,
                                dublicatesAddress: dublicates_address,
                                dublicatesNftId: dublicates_nftId,
                                invalidNftId: invalid_nftId,
                                invalidOwnerNftId: invalid_ownerNftId,
                                isFile: false
                            }

                            if (invalid_addresses.length > 0 || dublicates_address.length > 0 || dublicates_nftId.length > 0 || invalid_nftId.length > 0 || invalid_ownerNftId.length > 0 || addresses_to_send.length <= 0 || balances_to_send.length <= 0) {
                                error += 1;
                                errorMessage = 'Please check details and fix errors';
                            }

                        });
                    }
                    catch (err) {
                        console.log(err.message);
                        dataSet = {
                            ...multisendApp,
                            isFile: false
                        }

                        error += 1;
                        errorMessage = err.reason ? err.reason : error.message;


                    }
                }
            }
            else {
                dataSet = {
                    ...multisendApp,
                    isFile: false
                }

                error += 1;
                errorMessage = "Please enter transfer address and amount!!";
            }
        }
        else {
            dataSet = {
                ...multisendApp,
                isFile: false
            }
            error += 1;
            errorMessage = "Please enter transfer address and amount!!";
        }
    }
    else {
        dataSet = {
            ...multisendApp,
            isFile: false
        }
        error += 1;
        errorMessage = "Please enter valid token,NFT or select Native Currency !!!";

    }


    return { error, errorMessage, data: dataSet };

}

export async function setupGas(multisendApp = {}, chainId, account) {
    let response = [];
    let web3 = getWeb3(chainId);
    let multiSenderContract = getMultisenderContract(chainId);
    let gasDetails = {
        estimatedBaseFee: 12,
        high: 15,
        medium: 12,
        low: 10
    };
    let networkSymbol = supportNetwork[chainId].gasSymbol;

    if (networkSymbol) {
        let currentGas = await axios.get(`https://api.owlracle.info/v3/${networkSymbol}/gas?apikey=4988dd19d5414b66b784deb887607eec`)
        if (currentGas && currentGas.data && currentGas.data.speeds) {
            gasDetails = {
                estimatedBaseFee: currentGas.data.speeds[2].maxFeePerGas,
                high: currentGas.data.speeds[3].maxFeePerGas,
                medium: currentGas.data.speeds[2].maxFeePerGas,
                low: currentGas.data.speeds[0].maxFeePerGas
            }
        }
        else {
            let currentGasPrice = await web3.eth.getGasPrice();
            currentGasPrice = fromExponential(currentGasPrice / Math.pow(10, 9));
            if (parseFloat(currentGasPrice) <= 0.1) {
                currentGasPrice = 0.1;
            }
            let mediumGas = fromExponential((currentGasPrice * 200) / 100);
            let max = fromExponential((currentGasPrice * 400) / 100);


            gasDetails = {
                estimatedBaseFee: mediumGas,
                high: max,
                medium: mediumGas,
                low: currentGasPrice
            }
        }
    }
    else {
        let currentGasPrice = await web3.eth.getGasPrice();
        currentGasPrice = fromExponential(currentGasPrice / Math.pow(10, 9));
        if (parseFloat(currentGasPrice) <= 0.1) {
            currentGasPrice = 0.1;
        }
        let mediumGas = fromExponential((currentGasPrice * 200) / 100);
        let max = fromExponential((currentGasPrice * 400) / 100);


        gasDetails = {
            estimatedBaseFee: mediumGas,
            high: max,
            medium: mediumGas,
            low: currentGasPrice
        }

    }

    async function* fetchData() {
        let perTxCount = 150;
        while (true) {

            try {

                if (Object.keys(multisendApp).length > 0) {
                    // eslint-disable-next-line
                    const sendAddressChunk = multisendApp.sendAddress.reduce((resultArray, item, index) => {
                        // eslint-disable-next-line
                        const chunkIndex = Math.floor(index / perTxCount)

                        if (!resultArray[chunkIndex]) {
                            resultArray[chunkIndex] = [] // start a new chunk
                        }

                        resultArray[chunkIndex].push(item)

                        return resultArray
                    }, []);

                    // eslint-disable-next-line
                    const sendBalanceChunk = multisendApp.sendAmounts.reduce((resultArray, item, index) => {
                        // eslint-disable-next-line
                        const chunkIndex = Math.floor(index / perTxCount)

                        if (!resultArray[chunkIndex]) {
                            resultArray[chunkIndex] = [] // start a new chunk
                        }

                        resultArray[chunkIndex].push(item)

                        return resultArray
                    }, []);


                    let getCharges = await multiSenderContract.methods.charges().call();


                    async function* tokenData() {
                        let i = 0;
                        let txGas = 0;

                        while (i < sendAddressChunk.length) {
                            if (multisendApp.type === 2) {
                                txGas = await multiSenderContract.methods.flashToken(
                                    '0x0000000000000000000000000000000000000000',
                                    multisendApp.tokenAddress,
                                    sendAddressChunk[i],
                                    sendBalanceChunk[i].map((value) => ethers.utils.parseUnits(parseFloat(value).toFixed(5).toString(), multisendApp.tokenDecimal))

                                ).estimateGas({
                                    value: getCharges,
                                    from: account
                                });

                                yield txGas;
                            }
                            else if (multisendApp.type === 3) {
                                txGas = await multiSenderContract.methods.flashNft(
                                    '0x0000000000000000000000000000000000000000',
                                    multisendApp.tokenAddress,
                                    sendAddressChunk[i],
                                    sendBalanceChunk[i]

                                ).estimateGas({
                                    value: getCharges,
                                    from: account
                                });

                                yield txGas;
                            }
                            else if (multisendApp.type === 1) {
                                let totalAmount = sendBalanceChunk[i].reduce((partialSum, a) => exactMathNode.add(partialSum, a), 0)
                                totalAmount = exactMathNode.add(getCharges.toString() / Math.pow(10, 18), totalAmount)
                                txGas = await multiSenderContract.methods.flashNative(
                                    '0x0000000000000000000000000000000000000000',
                                    sendAddressChunk[i],
                                    sendBalanceChunk[i].map((value) => ethers.utils.parseUnits(parseFloat(value).toFixed(5).toString(), 18)),

                                ).estimateGas({
                                    value: ethers.utils.parseUnits(totalAmount.toString(), 18),
                                    from: account
                                });

                                yield txGas;
                            }
                            else {

                                yield txGas;
                            }
                            i++
                        }
                    }

                    let totalCharges = 0;
                    let txGasLimit = [];

                    for await (const txGas of tokenData()) {
                        txGasLimit.push(txGas)
                        totalCharges = exactMathNode.add(web3.utils.fromWei(getCharges), totalCharges);
                    }

                    let totalCurrencyValue = fromExponential(exactMathNode.mul(txGasLimit[0], gasDetails.estimatedBaseFee) / Math.pow(10, 9));
                    if (parseFloat(totalCurrencyValue) < parseFloat(supportNetwork[chainId].maxValue)) {
                        let totalGas = txGasLimit.reduce((partialSum, a) => exactMathNode.add(partialSum, a), 0);
                        let totalCurrencyValue = fromExponential(exactMathNode.mul(totalGas, gasDetails.estimatedBaseFee) / Math.pow(10, 9));

                        yield { error: 'OK', totalCurrencyValue, totalCharges, txGasCount: totalGas, totalTx: sendAddressChunk.length, sendAddressChunk: sendAddressChunk, sendBalanceChunk: sendBalanceChunk, txGasLimit };
                        break;
                    }
                    else {
                        perTxCount = Math.floor((parseFloat(supportNetwork[chainId].maxValue) * parseFloat(perTxCount)) / parseFloat(totalCurrencyValue));
                        console.log(perTxCount)
                    }
                }
                else {
                    yield { 'error': 'something went wrong ! please try again' };
                    break;
                }

            }
            catch (err) {
                yield { 'error': err.reason ? err.reason : err.message };
                break;
            }
        }

    }

    for await (const gasData of fetchData()) {
        response = gasData;
    }

    return { response, currentGas: Math.ceil(gasDetails.estimatedBaseFee), minGas: Math.ceil(gasDetails.low), maxGas: Math.ceil(gasDetails.high), gasStep: Math.ceil((gasDetails.high - gasDetails.low) / 10) > 1 ? 1 : Math.ceil((gasDetails.high - gasDetails.low) / 10) };
}

