const StellarSdk = require('stellar-sdk')
StellarSdk.Network.useTestNetwork();

const keys = {
    A: StellarSdk.Keypair.fromSecret   (process.argv[2]),
    B: StellarSdk.Keypair.fromPublicKey(process.argv[3]),
    D: StellarSdk.Keypair.fromPublicKey(process.argv[4]),
}

var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
server.loadAccount(keys.D.publicKey())
    .then(function(account) {
        const transaction = new StellarSdk.TransactionBuilder(account)
            .addOperation(StellarSdk.Operation.payment({
                destination: keys.B.publicKey(),
                asset: StellarSdk.Asset.native(),
                amount: "1000" // ransom
            }))
            .build();
        transaction.sign(keys.A);
        console.log(transaction.toEnvelope().toXDR())
    });
