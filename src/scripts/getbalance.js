const Web3 = require('web3')

var testnet = process.env.REACT_APP_NETWORK
if (!testnet) {
  testnet = `http://127.0.0.1:8545`
}
const networkToUse = testnet
const web3 = new Web3(new Web3.providers.HttpProvider(networkToUse))

// let minABI = [
//   // balanceOf
//   {
//     "constant":true,
//     "inputs":[{"name":"_owner","type":"address"}, {"name":"_contract","type":"address"}],
//     "name":"balanceOf",
//     "outputs":[{"name":"av_balance","type":"uint256"}, {"name":"locked_balance","type":"uint256"}],
//     "type":"function"
//   },

// ];


let minABI = [
  // balanceOf
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "type": "function"
  }

];


//const contractAddress = "0xa25b1c8d99a9f43a71a7873ae29587e9ebb9dade"


//const senderAddress = "0xe45196385B7f64C7cD901B80298Fd7947e204301"


// export const getContractBalanceOf = async (account, contractAddress) => {
//   // var tokenContract = new web3.eth.Contract(minABI, contractAddress);

//   // return tokenContract.methods.balanceOf(account, contractAddress).call(function (err, res) {
//   //     if (err) {
//   //         console.log("An error occured", err)
//   //         return
//   //     }
//   //     console.log("The balance is: ", res)
//   //     return res;
//   // })
//   // return ["0", "0"]
// };

export const getWalletBalance = async (account) => {
  var balanceWei = await web3.eth.getBalance(account || web3.eth.defaultAccount);
  var balance = await web3.utils.fromWei(balanceWei, 'ether');
  console.log(`Your ETH wallet balance is currently ${balance} ETH`)
  return balance;
};

// export const getWalletBalance = async (account) => {
//   var tokenContract = new web3.eth.Contract(minABI, "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984");
//   var bal = await tokenContract.methods.balanceOf(account).call(function (err, res) {
//     if (err) {
//       console.log("error:", err)
//       return
//     }    
//     return
//   })
//   return web3.utils.fromWei(bal)
// };



