pragma solidity >=0.5.0 <0.7.0;

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
