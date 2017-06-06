var Web3 = require('web3')

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:2222"));

var alices_account = process.argv[2]
var bobs_account = process.argv[3]
var hash_x = process.argv[4]
var amount = 1000
var source = fs.readFileSync('./T1.sol', 'utf8')
var compiled = web3.eth.compile.solidity(source);
var code = compiled.code;
var abi = compiled.info.abiDefinition;
web3.eth.defaultAccount = alices_account;
web3.eth.contract(abi).new(bobs_account, hash_x, 48 * 60, {data: code, value: amount}, 
    function (err, contract) { // callback
    if(err) {
        console.error(err);
        return;
    } else if(contract.address){
        console.log(contract.address);
    }
});
