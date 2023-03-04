import { ethers } from "ethers";
import {contract}  from './contract';
import {getWeb3} from './connectors';
import tokenAbi from '../json/token.json';
import nftAbi from '../json/nftAbi.json';
import multicallAbi from '../json/multicall.json';
import multisenderAbi from '../json/multisenderAbi.json';

export const getContract =  (abi, address, library) => {
  try{
    return new ethers.Contract(address, abi, library.getSigner())
  }
  catch(err){
    return false;
  }
}

export const formatPrice = (num) => {
  return new Intl.NumberFormat('en-US').format(parseFloat(parseFloat(num).toFixed(8)));
}

export const getTokenContract = (address,chainId) =>{
  let web3 = getWeb3(chainId);
  return new web3.eth.Contract(tokenAbi, address);
} 

export const getNftContract = (address,chainId) =>{
  let web3 = getWeb3(chainId);
  return new web3.eth.Contract(nftAbi, address);
} 

export const getMultisenderContract = (chainId) =>{
  let address = contract[chainId] ? contract[chainId].MULTISENDERADDRESS : contract['default'].MULTISENDERADDRESS;
  let web3 = getWeb3(chainId);
  return new web3.eth.Contract(multisenderAbi, address);
} 

export const getMultiCallContractConnect = (chainId) =>{
  let address = contract[chainId] ? contract[chainId].MULTICALLADDRSS : contract['default'].MULTICALLADDRSS;
  let web3 = getWeb3(chainId);
  return new web3.eth.Contract(multicallAbi, address);
}

export const getMultiCall = async (calls = [],chainId) => {
  let web3 = getWeb3(chainId);
  let multiCalladdress = contract[chainId] ? contract[chainId].MULTICALLADDRSS : contract['default'].MULTICALLADDRSS;
  const mc = new web3.eth.Contract(multicallAbi, multiCalladdress);
  const callRequests = calls.map((call) => {
    const callData = call.encodeABI();
    return {
      target: call._parent._address,
      callData,
    };
  });

  const { returnData } = await mc.methods
    .aggregate(callRequests)
    .call({});

  let finalData = returnData.map((hex, index) => {
    const types = calls[index]._method.outputs.map((o) =>
      o.internalType !== o.type && o.internalType !== undefined ? o : o.type
    );

    let result = web3.eth.abi.decodeParameters(types, hex);

    delete result.__length__;

    result = Object.values(result);

    return result.length === 1 ? result[0] : result;
  });

  return finalData;
}





