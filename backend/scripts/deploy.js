const { ethers } = require('hardhat')
const fs = require('fs')
const path = require('path')

async function main() {
  console.log('Deploying SupplyChain contract...')

  const [deployer] = await ethers.getSigners()
  console.log('Deploying with account:', deployer.address)

  const balance = await ethers.provider.getBalance(deployer.address)
  console.log('Account balance:', ethers.formatEther(balance), 'ETH')

  if (balance === 0n) {
    throw new Error('Account has no funds. Please fund the account or use a different account.')
  }

  const SupplyChain = await ethers.getContractFactory('SupplyChain')
  const supplyChain = await SupplyChain.deploy()

  await supplyChain.waitForDeployment()

  const address = await supplyChain.getAddress()
  const network = await ethers.provider.getNetwork()
  const chainId = network.chainId.toString()

  console.log('SupplyChain deployed to:', address)
  console.log('Network chain ID:', chainId)

  // Update deployments.json
  const deploymentsPath = path.join(__dirname, '../deployments.json')
  const deployments = fs.existsSync(deploymentsPath)
    ? JSON.parse(fs.readFileSync(deploymentsPath, 'utf8'))
    : { networks: {} }

  if (!deployments.networks[chainId]) {
    deployments.networks[chainId] = {}
  }

  deployments.networks[chainId].SupplyChain = {
    address: address,
  }

  fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2))
  console.log('Deployment info saved to deployments.json')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
