// checks if a given value is true or not. If false, terminate program.
const assert = require("assert");
// required for testing solidity
const ganache = require("ganache-cli");
// library for interfacing with Etheureum networks.
// It isn't camel cased as Web3 is a constructor
const Web3 = require("web3");
// instance of web3 with a ganache provider() as a test network
const ganacheProvider = ganache.provider();
const web3 = new Web3(ganacheProvider);
// The ABI and the Bytecode are the two returned objects
// after we compile our contract
const { interface, bytecode } = require("../compile");

let accounts;
let lottery;

beforeEach(async () => {
  // Get a list of all unlocked accounts
  accounts = await web3.eth.getAccounts();
  // Use one account to deploy the contract

  // Teaches web3 about what methods an Inbox contract has.

  /**
    The first argument in Contract() is the ABI. ABI is the
    interface between the solidity world and the javascript
    world. We do this by deserializing the interface object.

    Deploy() is the data required to be passed on to this 
    contract in order to create it. Two arguments are 
    required: the bytecode and the arguments for the
    constructor. 

    Send() instructs web3 to send out a transaction to create
    the contract. It requires the gasLimit and an external
    account. In this case, we use an account provided by 
    ganache.

    The returned variable `inbox` allows us to interact directly
    with the contract on the blockchain.
   */
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  lottery.setProvider(ganacheProvider);
});

describe("Inbox contract", () => {
  it("deploys a contract", () => {
    // First we need to assert that a default value is
    // assigned to the contract. Second we need to assert
    // that the `message` has successfully been set. We
    // also need one more test that makes sure that we are
    // able to successfully deploy a contract.

    // We do this by asserting if an address exists in the
    // inbox contract.
    assert.ok(lottery.options.address);
  });
});
