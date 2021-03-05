// checks if a given value is true or not. If false, terminate program.
const { AssertionError } = require("assert");
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

    // check for existence of lottery.options.address
    assert.ok(lottery.options.address);
  });
  it("allows one account to enter", async () => {
    // send({}) with an object can specify the msg.sender and
    // the msg.value through the from and value respectively.
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const players = await lottery.methods
      .returnPlayers()
      .call({ from: accounts[0] });

    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  });
  it("allows multiple accounts to enter", async () => {
    // send({}) with an object can specify the msg.sender and
    // the msg.value through the from and value respectively.
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const players = await lottery.methods
      .returnPlayers()
      .call({ from: accounts[0] });

    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3, players.length);
  });
  // we use try-catch to handle expected errors in our contract
  it("requires a minimum amount of ether", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei("0.001", "ether"),
      });
      // assert that it's false
      assert(false);
    } catch (err) {
      // the test will pass because we successfully caught
      // the err object and asserted that it's true
      // (the error).
      assert(err);
    }
  });
  // check if any other account can pick a winner
  it("only manager can pick winner", async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  // check if we can pick the winner and send the money
  it("sends money to the winner and resets the players array", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("2", "ether"),
    });

    // check balance in accounts[0] (should be < 2 ether)
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    // pick winner
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    // check balance in accounts[0] again (should be +2 ether)
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    // check difference between finalBalance and initialBalance
    const difference = finalBalance - initialBalance;
    // assert that difference is greater than 1.8 ether. we say
    // 1.8 as we leave a margin of error due to gas costs.
    assert(difference > web3.utils.toWei("1.8", "ether"));
    assert.equal(players.length, 0);
  });
});
