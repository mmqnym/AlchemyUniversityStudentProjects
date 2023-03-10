# Intermediate Contarct

## The Goal: Emit the Winner event

The goal is simple! Emit the winner event on this smart contract on the Goerli testnet: https://goerli.etherscan.io/address/0xcF469d3BEB3Fc24cEe979eFf83BE33ed50988502#code

```solidity
// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Contract {
    event Winner(address);

    function attempt() external {
        require(msg.sender != tx.origin, "msg.sender is equal to tx.origin");
        emit Winner(msg.sender);
    }
}
```

## My solution

To emit this event, we need to solve the condition `msg.sender != tx.origin`. The solution is to create an intermediate contract to call the target contract, so that `msg.sender` becomes the address of the intermediate contract, and `tx.origin` is the EOA address of the call to the intermediate contract, which are not equal.

Use hardhat to deploy the following intermediate contract:
https://goerli.etherscan.io/address/0xe519a0543e8184aa36b57ae38ec5aada17982a76#code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface TargetInterface {
    function attempt() external;
}

contract IntermediateContract {
    address public constant TARGET_CONTRACT_ADDRESS = 0xcF469d3BEB3Fc24cEe979eFf83BE33ed50988502;
    TargetInterface TargetContract = TargetInterface(TARGET_CONTRACT_ADDRESS);

    function callTarget() external {
        TargetContract.attempt();
    }
}
```

After linking the wallet on [etherscan](https://goerli.etherscan.io/address/0xe519a0543e8184aa36b57ae38ec5aada17982a76#writeContract), execute `callTarget() ` to call `attempt()` in the target contract to complete our goal for this project.

My transaction:
[0x3e861062b279a6ba6c7596ef87a167e8cf47ca3fca548c1d53321fb13657d402](https://goerli.etherscan.io/tx/0x3e861062b279a6ba6c7596ef87a167e8cf47ca3fca548c1d53321fb13657d402)
