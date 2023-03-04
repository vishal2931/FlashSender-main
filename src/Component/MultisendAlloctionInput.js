import React, { useState } from 'react';
import { Col, Form, Modal } from "react-bootstrap"
import CodeMirror from "@uiw/react-codemirror";
import { ExcelRenderer } from "react-excel-renderer";
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import { checkValidation } from '../context/context';
import { useWeb3React } from "@web3-react/core";
import { ClipLoader } from 'react-spinners';



export default function MultisendAlloctionInput(props) {
    const { chainId , account } = useWeb3React();
    let { setMultisendApp, multisendApp , setApiLoader , apiLoader } = props;
    const [show, setShow] = useState(false);

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setApiLoader(true)
            const fileReader = new FileReader();

            if (acceptedFiles[0]) {
                let fileExSplit = acceptedFiles[0].name ? acceptedFiles[0].name.split('.') : [];
                let fileType = fileExSplit[fileExSplit.length - 1];

                fileReader.onload = function (event) {
                    if (fileType === 'txt' || fileType === 'csv') {
                        checkValidation({ ...multisendApp, isFile: false, userInputAddress: event.target.result }, chainId, account).then((backData) => {
                            setMultisendApp({ ...multisendApp, ...backData.data })
                        });
                    }
                    else if (fileType === 'xlsx') {
                        let excelData = '';
                        ExcelRenderer(acceptedFiles[0], (err, resp) => {
                            if (err) {
                                toast.error(err);
                            } else {
                                const { rows } = resp;

                                if (rows && rows.length > 0) {
                                    Promise.all(rows.map((rowdata) => {
                                        if(rowdata[0] &&  rowdata[1]){
                                            excelData += `${rowdata[0]},${rowdata[1]}\r\n`;
                                        }
                                        return true
                                    })).then(() => {
                                       
                                        checkValidation({ ...multisendApp, isFile: false, userInputAddress: excelData }, chainId, account).then((backData) => {
                                            setApiLoader(false);
                                            setMultisendApp({ ...multisendApp, ...backData.data })
                                        });
                                    });
                                }
                                else {
                                    toast.error('data not found in correct format or may some error in upload data!!');
                                }
                            }
                        });
                    }
                    else {
                        toast.error('file not supported!!');
                    }
                };

                fileReader.readAsText(acceptedFiles[0]);


            }

        }
        else {
            toast.error('file not found , try again!!');
        }

    }
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const override = {
        display: "block",
        margin: "0 auto",
    };



    return (
        <React.Fragment>
            {multisendApp.isFile ?
                (
                    <Col sm={12} md={12} lg={12}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <Form.Label className="mb-0">Addresses with Amounts</Form.Label>
                            <p className="mb-0">
                                <a href="#send" onClick={(e) => setMultisendApp({ ...multisendApp, isFile: false })}>Insert manually</a>
                            </p>
                        </div>
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <div class="content text-center">
                                <p>
                                    {/* <span class="icon text-center is-medium"> */}
                                    <svg viewBox="0 0 24 24" width="52" height="52" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                    {/* </span> */}
                                </p>
                                <strong style={{ "color": "rgb(0, 23, 75)" }}>Drop your files here or <strong>click to upload</strong></strong><br />
                                <em>(Only *.csv,*.xlsx,*.txt file will be accepted)</em>
                               
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mt-3">
                            <p className="label-desc mb-0">Accepted: CSV / Excel / Txt</p>
                            {apiLoader && <ClipLoader color='#000' loading={apiLoader} cssOverride={override} size={30} />}
                            <a href="#send" className="label-desc" onClick={() => setShow(true)}>Show examples</a>
                        </div>
                    </Col>
                )
                :
                (
                    <>
                        <Col sm={12} md={12} lg={12}>
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <Form.Label className="mb-0">Addresses with Amounts</Form.Label>
                                <p className="mb-0">
                                    <a href="#send" onClick={(e) => setMultisendApp({ ...multisendApp, isFile: true })}>Upload File</a>
                                </p>
                            </div>

                            <CodeMirror
                                value={multisendApp.userInputAddress}
                                onBlur={() => {
                                    multisendApp.type !== 3 &&
                                    setApiLoader(true)
                                    checkValidation({...multisendApp , keepDuplicates : false}, chainId, account).then((backData) => {
                                        setApiLoader(false)
                                        setMultisendApp({ ...multisendApp, ...backData.data })
                                    });
                                }}
                                height="200px"
                                theme={'light'}
                                placeholder="Insert address and amount,separate with comma"
                                onChange={(e) => setMultisendApp({ ...multisendApp, userInputAddress: e })}
                                style={{
                                    border: "1px solid #000",
                                    color: "#000"
                                }}
                            />

                            <div className="d-flex align-items-center justify-content-between mt-3">
                                <p className="label-desc mb-0">Separated by commas</p>
                                <a href="#send" className="label-desc" onClick={() => setShow(true)}>Show examples</a>
                            </div>

                        </Col>
                    </>
                )
            }



            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className='example-title'>Examples</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!multisendApp.isFile ? (
                        <React.Fragment>
                            <div className="example">
                                <div className="erc20-title erc-padding">for ERC20 or AVAX(address, amount)</div>
                                <div className="erc20-content">0x3df332e44a0bbff025838c187873d77f92caf5e9,0.001</div>
                                <div className="erc20-content">0x76d31966abf3edeb29e599eac4adcb72fba85e6a,1</div>
                                <div className="erc20-content">0xC8c30Fa803833dD1Fd6DBCDd91Ed0b301EFf87cF,3.45</div>
                                <div className="erc721-title erc-padding">for ERC721(address, token id)</div>
                                <div className="erc20-content">0x3df332e44a0bbff025838c187873d77f92caf5e9,1</div>
                                <div className="erc20-content">0x76d31966abf3edeb29e599eac4adcb72fba85e6a,2</div>
                                <div className="erc20-content">0xC8c30Fa803833dD1Fd6DBCDd91Ed0b301EFf87cF,3</div>
                            </div>
                            <div className="example-desc erc-padding">
                                Separated by commas
                            </div>

                        </React.Fragment>
                    ) :
                        (
                            <React.Fragment>
                                <div className='example p-4'>
                                    {/* <a href="#sec" role="listitem" tabindex="0" class="dropdown-item"> */}
                                    <div class="media">
                                        <div class="media-content">
                                            <h5 style={{ "fontWeight": "bold" }}>ERC20 or tBNB</h5>
                                            <a target="_blank" href="/flashsender_example_erc20_excel.xlsx" class="text-link fix">
                                                <span class="icon is-small">
                                                    <i class="mdi mdi-file-excel"></i>
                                                </span>Excel</a>
                                            <span>|&nbsp;&nbsp;
                                            </span>
                                            <a target="_blank" href="/flashsender_example_erc20_csv.csv" class="text-link fix">
                                                <span class="icon is-small">
                                                    <i class="mdi mdi-file-delimited"></i>
                                                </span>
                                                CSV
                                            </a>
                                            <span>|&nbsp;&nbsp;
                                            </span>
                                            <a target="_blank" href="/flashsender_example_erc20_txt.txt" class="text-link fix">
                                                <span class="icon is-small">
                                                    <i class="mdi mdi-note-text"></i>
                                                </span>
                                                Txt
                                            </a>
                                        </div>
                                    </div>
                                    {/* </a> */}
                                    <hr class="dropdown-divider" />
                                    {/* <a href="#sec" role="listitem" tabindex="0" class="dropdown-item"> */}
                                    <div class="media">
                                        <div class="media-content">
                                            <h5 style={{ "fontWeight": "bold" }}>ERC721 (NFT)</h5>
                                            <a target="_blank" href="/flashsender_example_erc721_excel.xlsx" class="text-link fix">
                                                <span class="icon is-small">
                                                    <i class="mdi mdi-file-excel"></i>
                                                </span>
                                                Excel
                                            </a>
                                            <span>|&nbsp;&nbsp;
                                            </span>
                                            <a target="_blank" href="/flashsender_example_erc721_csv.csv" class="text-link fix">
                                                <span class="icon is-small">
                                                    <i class="mdi mdi-file-delimited"></i>
                                                </span>
                                                CSV
                                            </a>
                                            <span>|&nbsp;&nbsp;
                                            </span>
                                            <a target="_blank" href="/flashsender_example_erc721_txt.txt" class="text-link fix">
                                                <span class="icon is-small">
                                                    <i class="mdi mdi-note-text"></i>
                                                </span>
                                                Txt
                                            </a>
                                        </div>
                                    </div>
                                    {/* </a> */}

                                </div>
                                <div className="example-desc erc-padding">
                                    Accepted: CSV / Excel / Txt
                                </div>
                            </React.Fragment>

                        )}
                </Modal.Body>
            </Modal>

        </React.Fragment >


    )
}
