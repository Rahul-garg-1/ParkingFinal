import web3 from "./web3";
import ParkingDApp from "./build/ParkingDApp.json";

const instance = new web3.eth.Contract(
  JSON.parse(ParkingDApp.interface),
  "0x97BdD1240C60cdA4d1e76Ba586f86690A41Fd02a" //address of deployed contract  ------------------------------>>
);

export default instance;
