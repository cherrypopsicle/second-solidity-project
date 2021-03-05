const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");

// Here we set up our Truffle provider. First argument we have to
// supply is our 12-word Mnemonic phrase for our wallets. The second
// argument is the API link to our Infura node, which will help us
// connect our provider.
const provider = new HDWalletProvider(
  "crew express nothing company wet enforce rural pioneer surround evidence trigger file",
  "https://rinkeby.infura.io/v3/877a59f4a10342a5aff775080ec9fc06"
);
const web3 = new Web3(provider);

const INITIAL_STRING = "Hi there!";

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from account", accounts[0]);
  const inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [INITIAL_STRING] })
    .send({ from: accounts[0] });
  console.log("Contract deployed to: ", inbox.options.address);
};
deploy();
