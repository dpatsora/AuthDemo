const Web3 = require('web3')

//const testnet = `http://127.0.0.1:8545`
const testnet = `https://ropsten.infura.io/v3/7fd177555cfe4aa1b47493fe4e00d4b6`

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



export const getContractBalanceOf = async (account, contractAddress) => {
  // var tokenContract = new web3.eth.Contract(minABI, contractAddress);

  // return tokenContract.methods.balanceOf(account, contractAddress).call(function (err, res) {
  //     if (err) {
  //         console.log("An error occured", err)
  //         return
  //     }
  //     console.log("The balance is: ", res)
  //     return res;
  // })
  return ["0", "0"]

};



export const getWalletBalance2 = async (account) => {
  let myBalanceWei = await web3.eth.getBalance(account || web3.eth.defaultAccount);
  let myBalance = await web3.utils.fromWei(myBalanceWei, 'ether');

  window.console.log(`Your wallet balance is currently ${myBalance} ETH`)
  return myBalance;
};

export const getWalletBalance = async (account) => {


  var tokenContract = new web3.eth.Contract(minABI, "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984");

  var a = await tokenContract.methods.balanceOf(account).call(function (err, res) {
    if (err) {
      console.log("An error occured", err)
      return
    }
    console.log("The balance is: ", res)
    var message = "Some string"
    var hash = web3.utils.sha3(message)

    
    web3.eth.personal.sign(hash, account, function(error, signature) {
        console.log(signature, error)
    })


    return
  })

  return web3.utils.fromWei(a)
};



