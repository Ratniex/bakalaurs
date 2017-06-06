import subprocess
import hashlib
from json import JSONDecoder
dec = JSONDecoder()

# setup ethereum chain
# keys should be created beforehand
ethereum_keys = {
        A: {public: 'f410f4457a249786ffcbed4a5d880d9274be542f', secret: 'aoeu'},
        B: {public: '99b3c2e7d1754b131308eec4900063c1b03ad9ce', secret: 'snth'},
        }
subprocess.check_call(['geth', '--datadir data', '--networkid 123',
    '--nodiscover', '--maxpeers 0', 'init', 'g1.json'])
os = subprocess.os
os.spawnl(os.P_NOWAIT, 'geth', '--rpc', '--rpcaddr localhost', '--rpcport 2222')
print('Ethereum keys')
print(ethereum_keys)

# setup stellar chain
b = subprocess.check_output(['node', 'generate_keys.js'])
stellar_keys = dec.decode(b.decode())
print('Stellar keys')
print(stellar_keys)

# A creates and signs unfreezing transaction 48 hours in the future
# this transaction is sent to B
unfreeze_xdr = subprocess.check_output([
    'node',
    'unfreeze.js',
    stellar_keys['A']['secret'],
    stellar_keys['B']['public'],
    stellar_keys['D']['public'],
    ])
print('partially signed unfreeze transaction:', unfreeze_xdr)

# A chooses random x
x = 'PaSsW0rD'
h = hashlib.sha256()
h.update(x.encode())
hash_x = h.hexdigest()

# A freezes her funds in contract D on ethereum
# address of new contract is sent to B
contract_address = subprocess.check_call([
    'node',
    'T1.js',
    ethereum_keys['A']['secret'],
    ethereum_keys['B']['public'],
    hash_x
    ])
print('T1 frozen')

# B freezes his funds in account D on stellar
subprocess.check_call([
    'node',
    'T2.js',
    stellar_keys['A']['public'],
    stellar_keys['B']['secret'],
    stellar_keys['D']['secret'],
    hash_x
    ])
print('T2 frozen')

# A claims funds from account D
subprocess.check_call([
    'node',
    'claim1.js',
    stellar_keys['A']['secret'],
    stellar_keys['D']['public'],
    x
    ])
print('T2 claimed')

# B claims funds from account C
subprocess.check_call([
    'node',
    'claim2.js',
    contract_address,
    x
    ])
print('T1 claimed')
