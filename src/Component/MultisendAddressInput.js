import React, { useState } from 'react';
import { Col, Form, InputGroup } from "react-bootstrap"
import { useWeb3React } from "@web3-react/core";
import { getWeb3 } from '../helper/connectors';
import { ClipLoader } from 'react-spinners';
import { getMultiCall, getNftContract, getTokenContract } from '../helper/contractHelper';
import { contract } from '../helper/contract';
import { supportNetwork } from '../helper/network';
import InputOutside from './InputOutside';
import { checkValidation } from '../context/context';

export default function MultisendAddressInput(props) {
    const { chainId, account, library } = useWeb3React();
    let { multisendApp, setMultisendApp, inputDrop, setInputDrop } = props;
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const override = {
        display: "block",
        margin: "0 auto",
    };

    const handleInputChange = async (e) => {
        let setArray = {
            ...multisendApp,
            inputTokenAddress: "",
            tokenAddress: e.target.value ? e.target.value : '',
            useWalletNFT : [],
            tokenName: "",
            tokenBalance: 0,
            tokenDecimal: 0,
            tokenSymbol: "",
            totalAllowence: 0,
            tokenset: false,
            type: 0,
        }

        try {
            setInputDrop(false)
            setIsLoading(true);
            if (account) {
                let inputAddress = e.target.value;
                let web3 = getWeb3(chainId);
                let checkAddress = await web3.utils.isAddress(inputAddress);
                let userBalance = await library.getBalance(account);
                if (checkAddress) {
                    let checkSumaddress = await web3.utils.toChecksumAddress(inputAddress);
                    let isCode = await web3.eth.getCode(inputAddress);
                    if (checkSumaddress && isCode !== '0x') {
                        let nftContract = getNftContract(inputAddress, chainId);
                        try {
                            let data = await getMultiCall([
                                nftContract.methods.name(), //0
                                nftContract.methods.symbol(), //1
                                nftContract.methods.isApprovedForAll(account, contract[chainId] ? contract[chainId].MULTISENDERADDRESS : contract['default'].MULTISENDERADDRESS), //2
                                nftContract.methods.balanceOf(account) //3
                            ], chainId);


                            await checkValidation({
                                ...multisendApp,
                                inputTokenAddress: `${data[1]} - ${inputAddress}`,
                                tokenAddress: inputAddress,
                                tokenName: data[0],
                                tokenBalance: data[3],
                                tokenDecimal: 0,
                                tokenSymbol: data[1],
                                totalAllowence: data[2] ? 1 : 0,
                                tokenset: true,
                                type: 3,
                                currencyBalance: userBalance.toString() / Math.pow(10, 18),

                            }, chainId, account).then((backData) => {
                                setMultisendApp({ ...multisendApp, ...backData.data })
                            });
                            setError('');
                            setIsLoading(false);

                        }
                        catch (err) {
                            try {
                                let tokenContract = getTokenContract(inputAddress, chainId);

                                let data = await getMultiCall([
                                    tokenContract.methods.name(), //0
                                    tokenContract.methods.symbol(), //1
                                    tokenContract.methods.decimals(), //2
                                    tokenContract.methods.allowance(account, contract[chainId] ? contract[chainId].MULTISENDERADDRESS : contract['default'].MULTISENDERADDRESS), //3
                                    tokenContract.methods.balanceOf(account) //4

                                ], chainId);

                                await checkValidation({
                                    ...multisendApp,
                                    inputTokenAddress: `${data[1]} - ${inputAddress}`,
                                    tokenAddress: inputAddress,
                                    tokenName: data[0],
                                    tokenBalance: data[4] / Math.pow(10, data[2]),
                                    tokenDecimal: data[2],
                                    tokenSymbol: data[1],
                                    totalAllowence:  data[3] / Math.pow(10, data[2]),
                                    tokenset: true,
                                    type: 2,
                                    currencyBalance: userBalance.toString() / Math.pow(10, 18)

                                }, chainId, account).then((backData) => {
                                    setMultisendApp({ ...multisendApp, ...backData.data })
                                });
                                setError('');
                                setIsLoading(false);

                            }
                            catch (err) {

                                setError('Something went wrong ! try again later.');
                                await checkValidation(setArray, chainId, account).then((backData) => {
                                    setMultisendApp({ ...multisendApp, ...backData.data })
                                });
                                setIsLoading(false);
                            }
                        }
                    }
                    else {
                        checkValidation(setArray, chainId, account).then((backData) => {
                            setMultisendApp({ ...multisendApp, ...backData.data })
                        });
                        setError('Please Enter Valid Address1.');
                        setIsLoading(false);
                    }

                }
                else {
                    checkValidation(setArray, chainId, account).then((backData) => {
                        setMultisendApp({ ...multisendApp, ...backData.data })
                    });
                    setError('Please Enter Valid Address2.');
                    setIsLoading(false);
                }
            }
            else {
                checkValidation(setArray, chainId, account).then((backData) => {
                    setMultisendApp({ ...multisendApp, ...backData.data })
                });
                setError('Please connect wallet and try again.');
                setIsLoading(false);
            }
        }
        catch (err) {
            console.log(err.message);
            setError('Something went wrong ! try again later.');
            checkValidation(setArray, chainId, account).then((backData) => {
                setMultisendApp({ ...multisendApp, ...backData.data })
            });
            setIsLoading(false);
        }
    }


    const handleNativSelect = async () => {
        setInputDrop(false);
        let userBalance = 0;
        if (account) {
            userBalance = await library.getBalance(account);
        }

        let setArray = {
            ...multisendApp,
            inputTokenAddress: `${supportNetwork[chainId ? chainId : 'default'].symbol} - ${supportNetwork[chainId ? chainId : 'default'].name} Native Currency`,
            tokenAddress: '',
            tokenName: supportNetwork[chainId ? chainId : 'default'].name,
            tokenBalance: userBalance.toString() / Math.pow(10, 18),
            currencyBalance: userBalance.toString() / Math.pow(10, 18),
            tokenDecimal: 18,
            tokenSymbol: supportNetwork[chainId ? chainId : 'default'].symbol,
            totalAllowence: 0,
            tokenset: false,
            type: 1,
            useWalletNFT : []
            
        }

        checkValidation(setArray, chainId, account).then((backData) => {
            setMultisendApp({ ...multisendApp, ...backData.data })
        });
        

    }


    return (
        <React.Fragment>
            <Col sm={12} md={12} lg={10}>
                <Form.Group className="mb-3">
                    <Form.Label>Token / NFT address</Form.Label>
                    <InputGroup className="mb-3">
                        <button type="button" className="dropdown-toggle btn btn-outline-secondary"></button>
                        <Form.Control
                            name="tokenAddess"
                            onChange={(e) => handleInputChange(e)}
                            onClick={() => {
                                setInputDrop(true);
                                setMultisendApp({ ...multisendApp, inputTokenAddress: '' });
                            }}
                            onBlur={() => {
                                checkValidation(multisendApp, chainId, account).then((backData) => {
                                    setMultisendApp({ ...multisendApp, ...backData.data , inputTokenAddress: multisendApp.type !== 1 ? `${(multisendApp.tokenAddress && multisendApp.tokenSymbol) ? `${multisendApp.tokenSymbol} - ${multisendApp.tokenAddress} ` : ''}` : `${supportNetwork[chainId ? chainId : 'default'].symbol} - ${supportNetwork[chainId ? chainId : 'default'].name} Native Currency` });
                                });
                                
                            }}
                            placeholder="ex. 0xc748673057861a797275CD8A068AbB95A902e8de"
                            value={multisendApp.inputTokenAddress ? multisendApp.inputTokenAddress : ''}
                        />
                        <InputOutside>
                            <div class="dropdown-menu custom-menu-main dropdown-main dropdown-input-main" style={{ "display": `${inputDrop ? 'block' : 'none'}` }} >
                                <div role="menu" class="dropdown-content-input overflow-auto">
                                    <ul>
                                        <li disabled={true}>For NFT distribution, please insert token address manually </li>
                                        <li onClick={() => { handleNativSelect() }}>{supportNetwork[chainId ? chainId : 'default'].symbol} - {supportNetwork[chainId ? chainId : 'default'].name} Native Currency</li>
                                    </ul>
                                </div>
                            </div>
                        </InputOutside>

                    </InputGroup>


                    {error && <span className='text-danger'>{error}</span>}

                </Form.Group>

            </Col>





            <Col sm={12} md={12} lg={2}>
                <Form.Group className="mb-3">
                    <Form.Label>Decimals</Form.Label>
                    <Form.Control type="text" disabled={true} value={multisendApp.tokenDecimal ? multisendApp.tokenDecimal : 0} />
                </Form.Group>
            </Col>
            {isLoading &&
                <div className='row'>
                    <ClipLoader color='#000' loading={isLoading} cssOverride={override} size={30} />
                </div>
            }


        </React.Fragment>
    )
}
