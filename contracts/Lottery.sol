// SPDX-License-Identifier: MIT
pragma solidity ^0.4.17;

contract Lottery {
    // the third party that tells the contract to pick a winner
    address public manager;
    // array of players that are taking part in the lottery
    address[] public players;
    
    constructor() public {
        manager = msg.sender;
    }
    
    
    function enter() public payable {
        // ether is keyword that follows the fixedpoint number to
        // specify the number in ether
        require(msg.value > .01ther, "Not enough money to enter the lottery!");
        players.push(msg.sender);
    }
    
    function random() internal view returns (uint) {
        return uint(keccak256(block.difficulty, now, players));
    }
    
    function pickWinner() onlyManager public {
        uint index = random() % players.length;
        // transfer() can send money to an address
        // this.balance amount of money this contract has!!
        players[index].transfer(this.balance);
        // this creates a brand new dyanmic address
        // the initial size of the address is 0
        players = new address[](0);
    }
    
    modifier onlyManager() {
        require(manager == msg.sender, "Only the manager can use this function!");
        // the underscore takes all the function's code and adds it in place of the 
        // underscore. Classic method of DRY.
        _;
    }
    
    function returnPlayers() public view returns (address[]) {
        return players;
    }
    
}