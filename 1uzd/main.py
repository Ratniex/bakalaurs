import subprocess
import random
import serpent
import hashlib
#  from pyetherum import tester, utils, abi
from json import JSONDecoder
dec = JSONDecoder()
# setup ethereum chain
#  ethereum_state = tester.state()
ethereum_keys = {
        A: {public: 'aaa', secret: 's3cr3t'},
        B: {public: 'bbb', secret: '5e¢re7'},
        }
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
contract_address = subprocess.check_call([
    'node',
    'T1.js',
    ethereum_keys['A']['secret'],
    ethereum_keys['B']['public'],
    hash_x
    ])
print('T1 done')

# B freezes his funds in account D on stellar
subprocess.check_call([
    'node',
    'T2.js',
    stellar_keys['A']['public'],
    stellar_keys['B']['secret'],
    stellar_keys['D']['secret'],
    ])
print('T2 done')

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
