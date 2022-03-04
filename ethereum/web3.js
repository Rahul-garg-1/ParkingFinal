import Web3 from 'web3';

let web3;

if(typeof window != 'undefined' && typeof window.web3 != 'undefined'){
    web3 = new Web3(window.web3.currentProvider);
    window.ethereum.enable();
} else {
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/6440eb0c5643454d96dc88adf3a1a256'
    );
    web3 = new Web3(provider);
}

export default web3;