// cross platform workability
const path = require('path');
// file system module
const fs = require('fs');
// solidity compiler 
const solc = require('solc');
// create cross platform path to Inbox.sol
const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
// read Inbox.sol in UTF8 encoding
const source = fs.readFileSync(lotteryPath, 'utf8');

// we can export this object now. it contains ABI + ByteCode
module.exports = solc.compile(source, 1).contracts[':Lottery'];