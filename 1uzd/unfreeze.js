const StellarSdk = require('stellar-sdk')
StellarSdk.Network.useTestNetwork();

const keys = {
    A: StellarSdk.Keypair.fromSecret   (process.argv[1]),
    B: StellarSdk.Keypair.fromPublicKey(process.argv[2]),
    C: StellarSdk.Keypair.fromPublicKey(process.argv[3]),
}

var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
server.loadAccount(keys.C.publicKey())
    .then(function(account) {
        const transaction = new StellarSdk.TransactionBuilder(account)
            .addOperation(StellarSdk.Operation.payment({
                destination: keys.B.publicKey(),
                asset: StellarSdk.Asset.native(),
                amount: "1000"
            }))
            .build();
        transaction.sign(keys.A);
        console.log(transaction.toEnvelope().toXDR())
    });
