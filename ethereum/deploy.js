const hdwallet = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const ParkingDApp = require('./build/ParkingDApp.json');

const provider = new hdwallet(
    'journey machine focus crop prosper improve brief apple together divide chef fold',
    'https://rinkeby.infura.io/v3/6440eb0c5643454d96dc88adf3a1a256'
);

const web3 = new Web3(provider);

const deploy = async ()=> {
    const accounts = await web3.eth.getAccounts();

    console.log(accounts[0])

    const result = await new web3.eth.Contract(JSON.parse(ParkingDApp.interface))
    .deploy( {data: '0x' + ParkingDApp.bytecode, arguments: [] })
    .send({ from: accounts[0] });

    console.log(result.options.address);

};

deploy();