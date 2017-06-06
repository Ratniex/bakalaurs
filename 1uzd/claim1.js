const StellarSdk = require('stellar-sdk')
const crypto = require('crypto')
StellarSdk.Network.useTestNetwork();

const keys = {
    A: StellarSdk.Keypair.fromSecret   (process.argv[2]),
    D: StellarSdk.Keypair.fromPublicKey(process.argv[3]),
}
const x = process.argv[4] // read this from ethereum chain

var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
server.loadAccount(keys.D.publicKey())
    .then(function(account) {
        const transaction = new StellarSdk.TransactionBuilder(account)
            .addOperation(StellarSdk.Operation.payment({
                destination: keys.A.publicKey(),
                asset: StellarSdk.Asset.native(),
                amount: "1000"
            }))
            .build();
        transaction.sign(keys.A);
        transaction.signHashX(x);
        return server.submitTransaction(transaction)
    });
