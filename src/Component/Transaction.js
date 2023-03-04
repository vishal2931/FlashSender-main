import React, { useEffect, useState } from 'react';
import { getWeb3 } from '../helper/connectors';
import { useWeb3React } from "@web3-react/core";
import { supportNetwork } from '../helper/network';
import loadingImg from '../images/loader.gif';


export default function Transaction({ txhash, setTxhash , index }) {
    const { chainId } = useWeb3React();
    const [txStatus, setTxStatus] = useState(2)
    
    
    useEffect(() => {
        function fetch() {
            let web3 = getWeb3(chainId);
            console.log(txhash[index].hash)
            if (txhash[index].hash && txhash[index].hash !== '') {
                var interval = setInterval(async function () {

                    var response = await web3.eth.getTransactionReceipt(txhash[index].hash);
                    if (response != null) {
                        clearInterval(interval)
                        if (response.status === true) {
                            txhash[index] = { hash: txhash[index].hash, status: 1 }
                            setTxStatus(1)
                            // setTxhash({ ...txhash });

                        }
                        else if (response.status === false) {
                            txhash[index] = { hash: txhash[index].hash, status: 3 }
                            setTxStatus(3)
                            // setTxhash({ ...txhash });
                        }
                        else {
                            txhash[index] = { hash: txhash[index].hash, status: 3 }
                            setTxStatus(3)
                            // setTxhash({ ...txhash });
                        }
                    }
                }, 5000);
            }

        }

        fetch()
        // eslint-disable-next-line 
    }, [])


    return (

        // console.log(txhash[index]);

        <article className="media notification is-white">
            <div className="media-left">{index + 1}</div>
            <div className="media-content">
                <div className="content">
                    <a target="_blank" rel="noreferrer" href={`${supportNetwork[chainId ? chainId : 'default'].txUrl}${txhash[index].hash ? txhash[index].hash : ''}`}>{txhash[index].hash ? txhash[index].hash : ''}</a>
                </div>
            </div>
            <div className="media-right">
                <span>
                    <span className="icon has-text-success is-small">
                        {txStatus === 1 ? (
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            // <img src={loadingImg} alt="loading" height={20} width={20} />
                        ) : (
                            txStatus === 3 ? (
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="#FF0000" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>

                            ) : (
                                <img src={loadingImg} alt="loading" height={20} width={20} />
                            )
                        )}

                    </span>
                </span>
            </div>
        </article>



    )
}
