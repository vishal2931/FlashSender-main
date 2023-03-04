import axios from "axios";
export const trimAddress = (addr) => {
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
}

export const transactionBreak = {
  0: 50,
  200: 60,
  500: 60
}


export const MORALIS_API_KEY = 'nZK3TIk90KyMWy7mRTQXsQ48VO93JtqQuaFt0QduWFNmssJL5GuzXSH0A9Gm5izJ';


export const getNFTOwner = async (tokenAddress = '', chainName = '', userAddress = '') => {


  let useNFTList = [];

  const options = {
    method: 'GET',
    url: `https://deep-index.moralis.io/api/v2/${userAddress}/nft?chain=${chainName}&format=decimal&limit=100&token_addresses=${tokenAddress}&normalizeMetadata=false`,
    headers:
    {
      accept: 'application/json',
      'X-API-Key': MORALIS_API_KEY
    }
  }

  let firstRes = await axios.request(options);
  if (firstRes.data.total > 0) {
    let totalLoop = Math.ceil(parseInt(firstRes.data.total) / 100);
    async function* asyncGenerator() {
      let i = 0;
      while (i < totalLoop) {
        yield i++;
      }
    }

    let cursor = [];
    for await (const num of asyncGenerator()) {
      try {
        let options;
        if (num > 0) {
          options = {
            method: 'GET',
            url: `https://deep-index.moralis.io/api/v2/${userAddress}/nft?chain=${chainName}&format=decimal&limit=100&token_addresses=${tokenAddress}&normalizeMetadata=false&cursor=${cursor[num - 1]}`,
            headers:
            {
              accept: 'application/json',
              'X-API-Key': MORALIS_API_KEY
            }
          }
          let response = await axios.request(options);
          if (response.data) {
            useNFTList[num] = response.data.result
            cursor[num] = response.data.cursor;
          }
          else {
            useNFTList[num] = [];
            break;
          }
        }
        else {

          useNFTList[num] = firstRes.data.result
          cursor[num] = firstRes.data.cursor;
        }
      }
      catch (err) {
        console.log(err.message);
        useNFTList[num] = [];
      }
    }


    let nftlist = [];
    let i = 0;
    await useNFTList.map((rowdata) => {
      rowdata.map((value) => {
        nftlist[i] = value.token_id;
        i++;
        return true;
      })
      return true;
    })
    
    return nftlist;



  }
  else {
    return useNFTList;
  }






}



