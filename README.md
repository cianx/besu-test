# BESU-TEST

This repo show how to generate errors in hyperledger besu related to solidity mapping operations. This repos sets up a set of docker containers that run these tests on ganache and geth for reference. 

client/contracts/TestContract.sol - defines a simple set of map operations that fail on on hyperledger/besu networks. 

```
contract TestContract {
  mapping (address => uint256) balances;

  function setBalance(uint256 amt) public {
    balances[msg.sender] = amt;
  }

  function zeroBalance() public {
    balances[msg.sender] = 0;
  }

  function resetBalance() public {
    delete balances[msg.sender];
  }

  function getBalance(address addr) public view returns(uint256) {
    return balances[addr];
  }
}
```

calling `TestContract.setBalance` succeeds with any value other than 0
calling `TestContract.zeroBalance` always fails (same as case above)
calling `TestContract.resetBalance` always fails

Generate the following response:
```
test_1     |   statusCode: 400,
test_1     |   responseText: '{\n' +
test_1     |     '  "jsonrpc" : "2.0",\n' +
test_1     |     '  "id" : 94,\n' +
test_1     |     '  "error" : {\n' +
test_1     |     '    "code" : -32003,\n' +
test_1     |     '    "message" : "Intrinsic gas exceeds gas limit"\n' +
test_1     |     '  }\n' +
test_1     |     '}',

```


# REQUIREMENTS
- docker
- docker-compose

# OPERATION

```
docker-compose up
```
