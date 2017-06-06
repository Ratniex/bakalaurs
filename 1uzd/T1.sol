
contract T1 {
    address public alicesAddress;
    address public bobsAddress;
    uint public amount; // amount to be recieved by Bob
    uint public targetAmount = 1000;
    bytes32 public hash_x;
    uint public deadline;
    uint public price;
    bool deadlinePassed = false;

    function T1(address sendTo, bytes32 hashValue, uint duration) {
        alicesAddress = msg.sender;
        bobsAddress = sendTo;
        amount = msg.value;
        deadline = now + duration * 1 minutes;
        hash_x = hashValue;
    }

    function claim(bytes32 x) afterDeadline {
        if (amount >= targetAmount && sha256(x) == hash_x){
            bobsAddress.send(targetAmount);
        }
    }

    modifier afterDeadline() { if (now >= deadline) _; }

    function safeWithdrawal() afterDeadline {
        alicesAddress.send(amount);
    }
}
