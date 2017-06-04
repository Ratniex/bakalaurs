import subprocess
import random
import serpent
from pyetherum import tester, utils, abi
from json import JSONDecoder
dec = JSONDecoder()
# setup ethereum chain
ethereum_state = tester.state()
ethereum_keys = 'none'
print(ethereum_keys)
# setup stellar chain
b = subprocess.check_output(['node', 'generate_keys.js'])
stellar_keys = dec.decode(b.decode())
print(stellar_keys)

# A creates and signs unfreezing transaction 48 hours in the future
# this transaction is sent to B
unfreeze_xdr = subprocess.check_output([
    'node',
    'unfreeze.js',
    stellar_keys['A']['secret'],
    stellar_keys['B']['public'],
    stellar_keys['C']['public'],
    ])
print('partially signed unfreezing transaction:', unfreeze_xdr)

# A chooses random x
x = ''.join(random.choices('0123456789ABCDEF', k=512))

# A freezes her funds in contract C on ethereum

#  serpent_code = '''
#  def multiply(a):
    #  return(a*2)
#  '''
#  c = s.abi_contract(serpent_code)
#  o = c.multiply(5)
#  print(str(o))

# B freezes his funds in account D on stellar
subprocess.check_call([
    'node',
    'T2.js',
    stellar_keys['A']['public'],
    stellar_keys['B']['public'],
    stellar_keys['C']['secret'],
    x
    ])
print('T2 done')

