var Web3 = require('web3')

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:2222"));

var contract_account = process.argv[2]
var x = process.argv[3]
var source = fs.readFileSync('./T1.sol', 'utf8')
var compiled = web3.eth.compile.solidity(source);
var code = compiled.code;
var abi = compiled.info.abiDefinition;
var contract = web3.eth.contract(abi).at(contract_account);
contract.claim(x)
