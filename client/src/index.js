const ethers = require('ethers');

const TestContract = require('../build/contracts/TestContract');

function toTokens(value) {
  return ethers.utils.parseEther(value.toString());
}

function fromTokens(value) {
  return parseFloat(ethers.utils.formatEther(value));
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function getTransactionReceipt(provider, txn) {
  let receipt = await provider.getTransactionReceipt(txn.hash);
  while (receipt === null) {
    await sleep(1000);
    receipt = await provider.getTransactionReceipt(txn.hash);
  }
  return receipt;
}

async function deployContract(contract, wallet) {
  // console.log(`Deploying contracts to ${env}`);
  const ct = new ethers.ContractFactory(
    contract.abi,
    contract.bytecode,
    wallet,
  );
  const result = await ct.deploy();
  console.log(result.deployTransaction);
  const receipt = await getTransactionReceipt(wallet.provider, result.deployTransaction);
  console.log(`Contract deployment: ${receipt.status?'succeeded':'failed'}`);

  return result.address;
}

async function runTest(name, url) {
  console.log(`Running test on: ${name} at ${url}`);

  const provider = new ethers.providers.JsonRpcProvider(url, 'unspecified');
  // const wallet = new ethers.Wallet(config.contractKey, provider);
  const wallet = ethers.Wallet.createRandom().connect(provider);

  console.log(`${name}: Deploying contract`);
  try {
    const contractAddr = await deployContract(TestContract, wallet);
    console.log(`Contract address ${contractAddr}`);

    const contract = new ethers.Contract(
      contractAddr,
      TestContract.abi,
      wallet,
    );

    //
    let txn;
    let receipt;
    console.log(`${name}: Setting account balance to 100`);
    txn = await contract.functions.setBalance(toTokens(100));
    receipt = await getTransactionReceipt(provider, txn);
    console.log(`Transaction ${receipt.status?'succeeded':'failed'}`);

    try {
      console.log(`${name}: Setting account balance to 0`);
      txn = await contract.functions.setBalance(toTokens(0));
      receipt = await getTransactionReceipt(provider, txn);
      console.log(`Transaction ${receipt.status?'succeeded':'failed'}`);
    } catch (e) { // catch besu error
      console.log(`${name}: Setting account balance to 0 error`, e)
    }

    try {
      console.log(`${name}: Zeroing account balance`);
      txn = await contract.functions.zeroBalance();
      receipt = await getTransactionReceipt(provider, txn);
      console.log(`${name}: Transaction ${receipt.status?'succeeded':'failed'}`);
    } catch (e) { // catch besu error
      console.log(`${name}: Zeroing account balance error`, e)
    }

    try {
      console.log(`${name}: resetBalance account balance`);
      txn = await contract.functions.resetBalance();
      receipt = await getTransactionReceipt(provider, txn);
      console.log(`${name}: Transaction ${receipt.status?'succeeded':'failed'}`);
    } catch (e) { // catch besu error
      console.log(`${name}: resetBalance account balance error`, e)
    }
  } catch (e) {
    console.log(`${name}: Test on failed, with unexpected error`, e)
  }
}

async function main() {

  await runTest("ganache", "http://ganache:4100")
  await runTest("geth", "http://geth:4200")
  await runTest("besu", "http://besu:4300")
}

main();
