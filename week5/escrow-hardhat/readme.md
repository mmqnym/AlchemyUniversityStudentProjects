# Decentralized Escrow Application

This is an Escrow Dapp built with [Hardhat](https://hardhat.org/).

## Goals

- Challenge 1: Run the dApp on a Live Testnet
- Challenge 2: Stylize
- Challenge 3: Wei to Ether Conversion
- Challenge 4: Persistence
- Challenge 5: What else?
- Further Research

## My solution

I have converted the input field to use ether as the unit, because it is more in line with human habits. We only need to multiply the value entered by users by `10^18`. Additionally, I used `tailwindcss` to beautify the interface and later used `wagmi` and `rainbowkit` with `Alchemy provider` as the default web3 provider, users can choose different wallets, solving the problem that only at the beginning users can connect to wallets and can only use default inject wallet.

During the development process I tested the DApp functionality on my local `hardhat node` to see if it could present the correct results I wanted. Finally I made my DApp support `Ethereum`, `Goerli`, `Sepolia` networks. The reason I support `Sepolia` is that `Goerli` will probably be deprecated in the near future.

\*I don't implement the goal of making the page still present the original data after refresh. Because I want to set up my DApp on a free cloud server with permanent demo. This goal can be achieved by simply setting up a server (with a database or simply using memory) and requesting the previous data from the server before each loading.

Online Demo: https://escrowdapp.whileweb3.dev/

## Project Layout

There are three top-level folders:

1. `/app` - contains the front-end application
2. `/contracts` - contains the solidity contract
3. `/tests` - contains tests for the solidity contract

## Setup

Install dependencies in the top-level directory with `npm install`.

After you have installed hardhat locally, you can use commands to test and compile the contracts, among other things. To learn more about these commands run `npx hardhat help`.

Compile the contracts using `npx hardhat compile`. The artifacts will be placed in the `/app` folder, which will make it available to the front-end. This path configuration can be found in the `hardhat.config.js` file.

## Front-End

`cd` into the `/app` directory and run `npm install`

To run the front-end application run `npm start` from the `/app` directory. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
