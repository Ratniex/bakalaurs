var Web3 = require('web3')

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:2222"));

var alices_account = process.argv[2]
var source = fs.readFileSync('./T1.sol')
var compiled = web3.eth.compile.solidity(source);
var code = compiled.code;
var abi = compiled.info.abiDefinition;
web3.eth.defaultAccount = alices_account
web3.eth.contract(abi).new({data: code}, function (err, contract) {
    if(err) {
        console.error(err);
        return;
    } else if(contract.address){
        console.log(contract.address);
    }
});
