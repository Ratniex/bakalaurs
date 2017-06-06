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
        var time = new Date();
        time.setDate(time.getDate() + 2);
        const transaction = new StellarSdk.TransactionBuilder(
                account,
                {timebounds: {minTime: time.getTime()}}
            )
            .addOperation(StellarSdk.Operation.payment({
                destination: keys.B.publicKey(),
                asset: StellarSdk.Asset.native(),
                amount: "1000"
            }))
            .build();
        transaction.sign(keys.A);
        console.log(transaction.toEnvelope().toXDR())
    });
