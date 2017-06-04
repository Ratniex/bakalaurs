const StellarSdk = require('stellar-sdk')
const crypto = require('crypto')
StellarSdk.Network.useTestNetwork();

const keys = {
    A: StellarSdk.Keypair.fromPublicKey(process.argv[1]),
    B: StellarSdk.Keypair.fromPublicKey(process.argv[2]),
    C: StellarSdk.Keypair.fromSecret   (process.argv[3]),
}
const x = new Buffer(process.argv[4], 'hex');

var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
server.loadAccount(keys.A.publicKey())
    .then(function(account) {
        const hash_x = crypto.createHash('sha256').update(x).digest('hex');
        const transaction = new StellarSdk.TransactionBuilder(account)
            .addOperation(StellarSdk.Operation.setOptions({
                source: keys.C.publicKey(),
                signer: {weight: 3, sha256Hash: hash_x},
            }))
            .addOperation(StellarSdk.Operation.setOptions({
                source: keys.C.publicKey(),
                signer: {weight: 3, ed25519PublicKey: keys.A.publicKey()},
            }))
            .addOperation(StellarSdk.Operation.setOptions({
                source: keys.C.publicKey(),
                highThreshold: 5,
                medThreshold: 5,
                lowThreshold: 5,
                masterWeight: 3,
                signer: {weight: 3, ed25519PublicKey: keys.B.publicKey()},
            }))
            .build();
        transaction.sign(keys.C);
        return server.submitTransaction(transaction);
    });
