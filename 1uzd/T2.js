const StellarSdk = require('stellar-sdk')
const crypto = require('crypto')
StellarSdk.Network.useTestNetwork();

const keys = {
    A: StellarSdk.Keypair.fromPublicKey(process.argv[2]),
    B: StellarSdk.Keypair.fromSecret   (process.argv[3]),
    D: StellarSdk.Keypair.fromSecret   (process.argv[4]),
}
const x = new Buffer(process.argv[5], 'hex');

var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
server.loadAccount(keys.B.publicKey())
    .then(function(account) {
        const hash_x = crypto.createHash('sha256').update(x).digest('hex');
        const transaction = new StellarSdk.TransactionBuilder(account)
            .addOperation(StellarSdk.Operation.payment({
                destination: keys.D.publicKey(),
                asset: StellarSdk.Asset.native(),
                amount: "1000"
            }))
            .addOperation(StellarSdk.Operation.setOptions({
                source: keys.D.publicKey(),
                signer: {weight: 3, sha256Hash: hash_x},
            }))
            .addOperation(StellarSdk.Operation.setOptions({
                source: keys.D.publicKey(),
                signer: {weight: 3, ed25519PublicKey: keys.A.publicKey()},
            }))
            .addOperation(StellarSdk.Operation.setOptions({
                source: keys.D.publicKey(),
                highThreshold: 5,
                medThreshold: 5,
                lowThreshold: 5,
                masterWeight: 3,
                signer: {weight: 3, ed25519PublicKey: keys.B.publicKey()},
            }))
            .build();
        transaction.sign(keys.B);
        transaction.sign(keys.D);
        return server.submitTransaction(transaction)
    });
