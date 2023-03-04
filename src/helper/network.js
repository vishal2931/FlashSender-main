import avaxImg from '../images/avax_blue.png';
import bnbImg from '../images/bnb_blue.png';
import ethImg from '../images/eth_blue.png';
import maticImg from '../images/matic_blue.png';
import arbitrumImg from '../images/arbitrum.svg';

export const supportNetwork = {
    1: {
        name: "ETH Mainnet",
        chainId: 1,
        hexId: '0x1',
        rpc: "https://mainnet.infura.io/v3/63f4b8ee61284419b46c780d03befc4e",
        image: ethImg,
        symbol: 'ETH',
        txUrl: 'https://etherscan.io/tx/',
        accountUrl: 'https://etherscan.io/address/',
        index: 0,
        gasSymbol: 'eth',
        suggestedGasFees: true,
        perTx: 250,
        maxValue: 0.25
    },
    56: {
        name: "Binance Mainnet",
        chainId: 56,
        hexId: '0x38',
        rpc: "https://bsc-dataseed1.binance.org/",
        image: bnbImg,
        symbol: 'BNB',
        txUrl: 'https://bscscan.com/tx/',
        accountUrl: 'https://bscscan.com/address/',
        index: 1,
        gasSymbol: 'bsc',
        perTx: 250,
        maxValue: 0.05
    },
    137: {
        name: "Polygon Mainnet",
        chainId: 137,
        hexId: '0x38',
        rpc: "https://polygon-rpc.com/",
        image: maticImg,
        symbol: 'MATIC',
        txUrl: 'https://polygonscan.com/tx/',
        accountUrl: 'https://polygonscan.com/address/',
        index: 2,
        gasSymbol: 'polygon',
        perTx: 250,
        maxValue: 4
    },
    43114: {
        name: "Avalanche Mainnet",
        chainId: 43114,
        hexId: '0xa86a',
        rpc: "https://api.avax.network/ext/bc/C/rpc",
        image: avaxImg,
        symbol: 'AVAX',
        txUrl: 'https://polygonscan.com/tx/',
        accountUrl: 'https://polygonscan.com/address/',
        index: 3,
        gasSymbol: 'avax',
        perTx: 250,
        maxValue: 0.20
    },
    42161: {
        name: "Arbitrum One Mainnet",
        chainId: 42161,
        hexId: '0xa4b1',
        rpc: "https://arb1.arbitrum.io/rpc",
        image: arbitrumImg,
        symbol: 'ETH',
        txUrl: 'https://arbiscan.io/tx/',
        accountUrl: 'https://arbiscan.io/address/',
        index: 3,
        gasSymbol: 'arb',
        perTx: 250,
        maxValue: 0.025
    },
    5: {
        name: "Testnet goerli",
        chainId: 5,
        hexId: '0x5',
        rpc: "https://goerli.infura.io/v3/63f4b8ee61284419b46c780d03befc4e",
        image: ethImg,
        symbol: 'GETH',
        txUrl: 'https://goerli.etherscan.io/tx/',
        accountUrl: 'https://goerli.etherscan.io/address/',
        index: 4,
        suggestedGasFees: true,
        gasSymbol: 'goerli',
        perTx: 250,
        maxValue: 0.25
    },
    97: {
        name: "Testnet BSC",
        chainId: 97,
        hexId: '0x61',
        rpc: "https://data-seed-prebsc-1-s3.binance.org:8545/",
        image: bnbImg,
        symbol: 'TBNB',
        txUrl: 'https://testnet.bscscan.com/tx/',
        accountUrl: 'https://testnet.bscscan.com/address/',
        index: 5,
        gasSymbol: '',
        perTx: 250,
        maxValue: 0.05
    },
    43113: {
        name: "Testnet Avalanche",
        chainId: 43113,
        hexId: '0xa869',
        rpc: "https://api.avax-test.network/ext/bc/C/rpc",
        image: avaxImg,
        symbol: 'AVAX',
        txUrl: 'https://testnet.snowtrace.io/tx/',
        accountUrl: 'https://testnet.snowtrace.io/address/',
        index: 6,
        gasSymbol: '',
        perTx: 250,
        maxValue: 0.20
    },
    80001: {
        name: "Testnet Mumbai Matic",
        chainId: 80001,
        hexId: '0x13881',
        rpc: "https://matic-mumbai.chainstacklabs.com",
        image: maticImg,
        symbol: 'TMATIC',
        txUrl: 'https://mumbai.polygonscan.com/tx/',
        accountUrl: 'https://mumbai.polygonscan.com/address/',
        index: 7,
        gasSymbol: '',
        perTx: 250,
        maxValue: 4
    },
    'default': {
        name: "ETH Mainnet",
        chainId: 1,
        hexId: '0x1',
        rpc: "https://mainnet.infura.io/v3/63f4b8ee61284419b46c780d03befc4e",
        image: ethImg,
        symbol: 'ETH',
        txUrl: 'https://etherscan.io/tx/',
        accountUrl: 'https://etherscan.io/address/',
        index: 0,
        gasSymbol: 'eth',
        suggestedGasFees: true,
        perTx: 250,
        maxValue: 0.25
    }

}

export const RPC_URLS = {
    56: "https://bsc-dataseed.binance.org/",
    43113: "https://api.avax.network/ext/bc/C/rpc",
    43114: "https://api.avax-test.network/ext/bc/C/rpc",
    97: "https://data-seed-prebsc-1-s3.binance.org:8545/",
    5: "https://goerli.infura.io/v3/63f4b8ee61284419b46c780d03befc4e",
    80001: "https://matic-mumbai.chainstacklabs.com",
    137: "https://polygon-rpc.com/",
    1: "https://mainnet.infura.io/v3/63f4b8ee61284419b46c780d03befc4e"
};

