import React from 'react';
import loadingImg from '../images/loader.gif';
import { useWeb3React } from "@web3-react/core";
import { checkValidation } from '../context/context';
// import { getWeb3 } from '../helper/connectors';
// import nftAbi from '../json/nftAbi.json'; 

export default function ErrorComp(props) {
    const { chainId , account } = useWeb3React();
    let { setMultisendApp, multisendApp, step1Loader } = props;

    const handleRemoveInvalidAddress = () => {
        try {
            let invalid_addresses = multisendApp.invalidAddresses;
            let breakLineArray = multisendApp.userInputAddress.split("\n");


            Promise.all(invalid_addresses.map(async (rowdata, index) => {
                let indexInvalid = rowdata[0] - 1 > 0 ? rowdata[0] - 1 : 0;
                breakLineArray.splice(indexInvalid, 1);
                return true;
            })).then(() => {
                let finalString = breakLineArray.join('\r\n');
                checkValidation({ ...multisendApp, userInputAddress: finalString }, chainId, account).then((backData) => {
                    setMultisendApp({ ...multisendApp, ...backData.data})
                });
                
            })
        }
        catch (err) {
            console.log(err.message);
        }
    }

    const handleKeepFirstOne = () => {
        try {
            let dublicates_address = multisendApp.dublicatesAddress;
            let breakLineArray = multisendApp.userInputAddress.split("\n");


            Promise.all(dublicates_address.map(async (rowdata, index) => {
                let indexInvalid = rowdata[0] - 1 - index > 0 ? rowdata[0] - 1 - index : 0;
                breakLineArray.splice(indexInvalid, 1);
                return true;
            })).then(() => {
                let finalString = breakLineArray.join('\r\n');
                checkValidation({ ...multisendApp, userInputAddress: finalString }, chainId, account).then((backData) => {
                    setMultisendApp({ ...multisendApp, ...backData.data})
                });
            })
        }
        catch (err) {
            console.log(err.message);
        }
    }

    const handleCombineBalance = () => {
        try {
            let dublicates_address = multisendApp.dublicatesAddress;
            let breakLineArray = multisendApp.userInputAddress.split("\n");
            let send_address = multisendApp.sendAddress;
            let send_amounts = multisendApp.sendAmounts;



            Promise.all(dublicates_address.map(async (rowdata, index) => {
                let indexInvalid = rowdata[0] - 1 - index;
                const indexAddr = send_address.indexOf(rowdata[1]);
                let sAddress = breakLineArray[indexAddr].trim().split(',')[0].toString().toLowerCase();
                let sAmount = breakLineArray[indexAddr].trim().split(',')[1];
                let totalAmount = parseFloat(sAmount) + parseFloat(send_amounts[rowdata[0] - 1]);
                breakLineArray[indexAddr] = `${sAddress},${parseFloat(parseFloat(totalAmount).toFixed(5))}`;
                breakLineArray.splice(indexInvalid, 1);
                return true;
            })).then(() => {
                let finalString = breakLineArray.join('\r\n');
                checkValidation({ ...multisendApp, userInputAddress: finalString }, chainId, account).then((backData) => {
                    setMultisendApp({ ...multisendApp, ...backData.data})
                });
            })
        }
        catch (err) {
            console.log(err.message);
        }
    }

    const handleKeepDuplicates = () => {
        checkValidation({ ...multisendApp,  keepDuplicates: true }, chainId, account).then((backData) => {
            setMultisendApp({ ...multisendApp, ...backData.data})
        });
        
    }

    const handleDeleteInvalidNFTId = () => {
        try {
            let invalid_nftids = multisendApp.invalidNftId;
            let breakLineArray = multisendApp.userInputAddress.split("\n");


            Promise.all(invalid_nftids.map(async (rowdata, index) => {
                let indexInvalid = rowdata[0] - 1 - index > 0 ? rowdata[0] - 1 - index : 0;
                breakLineArray.splice(indexInvalid, 1);
                return true;
            })).then(() => {
                let finalString = breakLineArray.join('\r\n');
                checkValidation({ ...multisendApp, userInputAddress: finalString }, chainId, account).then((backData) => {
                    setMultisendApp({ ...multisendApp, ...backData.data})
                });
            })
        }
        catch (err) {
            console.log(err.message);
        }
    }

    const handleDeleteWrongOwnerNFTId = () => {
        try {
            let invalid_nftids = multisendApp.invalidOwnerNftId;
            let breakLineArray = multisendApp.userInputAddress.split("\n");


            Promise.all(invalid_nftids.map(async (rowdata, index) => {
                let indexInvalid = rowdata[0] - 1 - index > 0 ? rowdata[0] - 1 - index : 0;
                breakLineArray.splice(indexInvalid, 1);
                return true;
            })).then(() => {
                let finalString = breakLineArray.join('\r\n');
                checkValidation({ ...multisendApp, userInputAddress: finalString }, chainId, account).then((backData) => {
                    setMultisendApp({ ...multisendApp, ...backData.data})
                });
            })
        }
        catch (err) {
            console.log(err.message);
        }
    }

    const handleDublicatesNftId = () => {
        try {
            let dublicates_nftId = multisendApp.dublicatesNftId;
            let breakLineArray = multisendApp.userInputAddress.split("\n");


            Promise.all(dublicates_nftId.map(async (rowdata, index) => {
                let indexInvalid = rowdata[0] - 1 - index;
                breakLineArray.splice(indexInvalid, 1);
                return true;
            })).then(() => {
                let finalString = breakLineArray.join('\r\n');
                checkValidation({ ...multisendApp, userInputAddress: finalString }, chainId, account).then((backData) => {
                    setMultisendApp({ ...multisendApp, ...backData.data})
                });
            })
        }
        catch (err) {
            console.log(err.message);
        }
    }



    return (
        <React.Fragment>
            {!step1Loader ?
                (
                    <div>

                        {!multisendApp.isFile && multisendApp.invalidAddresses && multisendApp.invalidAddresses.length > 0 ?
                            (
                                <>
                                    <div class="label-container mt-4">
                                        <div class="label is-danger-alert">The below addresses cannot be processed</div>
                                        <div class="action has-text-danger" >
                                            <button type='button' class="has-text-danger link-button" onClick={() => {
                                                handleRemoveInvalidAddress()
                                            }}>Delete them</button>
                                        </div>
                                    </div>
                                    <article class="notification is-danger">
                                        <ul>
                                            {multisendApp.invalidAddresses.map((invlaidData, index) => {
                                                return (
                                                    <li key={index}>
                                                        Line {invlaidData[0] ? invlaidData[0] : '-'} invalid address {invlaidData[1] ? invlaidData[1] : '-'}
                                                    </li>
                                                )
                                            })}

                                        </ul>
                                    </article>
                                </>
                            ) :
                            (
                                !multisendApp.isFile && (multisendApp.type === 2 || multisendApp.type === 1) && multisendApp.dublicatesAddress && multisendApp.dublicatesAddress.length > 0 ?
                                    (
                                        <>
                                            <div class="label-container mt-4">
                                                <div class="label is-danger-alert">Duplicated addresses</div>
                                                <div class="action has-text-danger text-dark">
                                                    <button type='button' class="has-text-danger link-button" onClick={() => {
                                                        handleKeepFirstOne()
                                                    }}>Keep the first one </button> &nbsp;|&nbsp;
                                                    <button type='button' class="has-text-danger link-button" onClick={() => {
                                                        handleCombineBalance()
                                                    }}>Combine balances</button> &nbsp;|&nbsp;
                                                    <button type='button' class="has-text-danger link-button" onClick={() => {
                                                        handleKeepDuplicates()
                                                    }}>Ignore</button>

                                                </div>
                                            </div>
                                            <article class="notification is-danger">
                                                <ul>
                                                    {multisendApp.dublicatesAddress.map((invlaidData, index) => {
                                                        return (
                                                            <li key={index}>
                                                                Line {invlaidData[0] ? invlaidData[0] : '-'} dublicates address {invlaidData[1] ? invlaidData[1] : '-'}
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </article>
                                        </>
                                    )
                                    :
                                    (
                                        !multisendApp.isFile && multisendApp.type === 3 && !multisendApp.keepDuplicates && multisendApp.dublicatesAddress && multisendApp.dublicatesAddress.length > 0 ?
                                            (
                                                <>
                                                    <div class="label-container mt-4">
                                                        <div class="label is-danger-alert">Duplicated addresses</div>
                                                        <div class="action has-text-danger">
                                                            <button type='button' class="has-text-danger link-button" onClick={() => {
                                                                handleKeepDuplicates()
                                                            }}>Keep the dublicates</button>
                                                        </div>
                                                    </div>
                                                    <article class="notification is-danger">
                                                        <ul>
                                                            {multisendApp.dublicatesAddress.map((invlaidData, index) => {
                                                                return (
                                                                    <li key={index}>
                                                                        Line {invlaidData[0] ? invlaidData[0] : '-'} dublicates address {invlaidData[1] ? invlaidData[1] : '-'}
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul>
                                                    </article>
                                                </>
                                            )
                                            :
                                            (
                                                !multisendApp.isFile && multisendApp.type === 3 && multisendApp.invalidNftId && multisendApp.invalidNftId.length > 0 ?
                                                    (
                                                        <>
                                                            <div class="label-container mt-4">
                                                                <div class="label is-danger-alert">Invalid NFT IDs</div>
                                                                <div class="action has-text-danger">
                                                                    <button type='button' class="has-text-danger link-button" onClick={() => {
                                                                        handleDeleteInvalidNFTId()
                                                                    }}>Delete them</button>
                                                                </div>
                                                            </div>
                                                            <article class="notification is-danger">
                                                                <ul>
                                                                    {multisendApp.invalidNftId.map((invlaidData, index) => {
                                                                        return (
                                                                            <li key={index}>
                                                                                Line {invlaidData[0] ? invlaidData[0] : '-'} invalid NFT ID {invlaidData[1] ? invlaidData[1] : '-'}
                                                                            </li>
                                                                        )
                                                                    })}
                                                                </ul>
                                                            </article>
                                                        </>
                                                    )
                                                    : (


                                                        !multisendApp.isFile && multisendApp.type === 3 && multisendApp.dublicatesNftId && multisendApp.dublicatesNftId.length > 0 ?
                                                            (
                                                                <>
                                                                    <div class="label-container mt-4">
                                                                        <div class="label is-danger-alert">Duplicated NFT ID</div>
                                                                        <div class="action has-text-danger">
                                                                            <button type='button' class="has-text-danger link-button" onClick={() => {
                                                                                handleDublicatesNftId()
                                                                            }}>Keep the first one </button>
                                                                        </div>
                                                                    </div>
                                                                    <article class="notification is-danger">
                                                                        <ul>
                                                                            {multisendApp.dublicatesNftId.map((invlaidData, index) => {
                                                                                return (
                                                                                    <li key={index}>
                                                                                        Line {invlaidData[0] ? invlaidData[0] : '-'} dublicates NFT ID {invlaidData[1] ? invlaidData[1] : '-'}
                                                                                    </li>
                                                                                )
                                                                            })}
                                                                        </ul>
                                                                    </article>
                                                                </>
                                                            ) :
                                                            !multisendApp.isFile && multisendApp.type === 3 && multisendApp.invalidOwnerNftId && multisendApp.invalidOwnerNftId.length > 0 ?
                                                                (
                                                                    <>
                                                                        <div class="label-container mt-4">
                                                                            <div class="label is-danger-alert">Wrong Owner NFT ID</div>
                                                                            <div class="action has-text-danger">
                                                                                <button type='button' class="has-text-danger link-button" onClick={() => {
                                                                                    handleDeleteWrongOwnerNFTId()
                                                                                }}>Delete them</button>
                                                                            </div>
                                                                        </div>
                                                                        <article class="notification is-danger">
                                                                            <ul>
                                                                                {multisendApp.invalidOwnerNftId.map((invlaidData, index) => {
                                                                                    return (
                                                                                        <li key={index}>
                                                                                            Line {invlaidData[0] ? invlaidData[0] : '-'} not owned NFT ID {invlaidData[1] ? invlaidData[1] : '-'}
                                                                                        </li>
                                                                                    )
                                                                                })}
                                                                            </ul>
                                                                        </article>
                                                                    </>
                                                                )
                                                                :
                                                                (
                                                                    <>
                                                                    </>
                                                                )
                                                    )

                                            )
                                    )
                            )
                        }

                    </div>
                ) :
                (
                    <div className='mt-5'>
                        <article class="notification is-info d-flex justify-content-between">

                            <span>Checking the address list...</span>

                            <img src={loadingImg} alt="loader" height={20} width={20} />


                        </article>
                    </div>
                )}
        </React.Fragment>
    )
}
