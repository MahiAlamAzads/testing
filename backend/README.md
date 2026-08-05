# Supply Chain Blockchain — Backend

A blockchain-based supply chain management backend built with Hardhat, Solidity, and JavaScript.

## Project Structure

```
backend/
├── contracts/          # Solidity smart contracts
├── scripts/            # Hardhat deployment scripts
├── ignition/           # Hardhat Ignition modules
├── test/               # Test files
└── hardhat.config.js   # Hardhat configuration
```

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

```bash
npm install
```

## Smart Contract Development

### Compile Contracts

```bash
npm run compile
```

Compiled artifacts are written to `./artifacts`.

### Deploy Contracts

Deploy to Hardhat Network (default):
```bash
npm run deploy
```

Deploy to local Hardhat node:
```bash
# Terminal 1: Start Hardhat node
npm run node

# Terminal 2: Deploy to localhost
npm run deploy:local
```

Deploy to Ganache:
```bash
npm run deploy:ganache
```

After deployment, the contract address is saved to `deployments.json` in the project root, keyed by network chain ID.

### Run Tests

```bash
npm test
```

## Configuration

### Hardhat Networks

The project is configured with the following networks:
- `hardhat`: Local Hardhat Network (chainId: 1337)
- `localhost`: Connect to a running Hardhat node (chainId: 1337)
- `ganache`: Connect to Ganache (chainId: 5777)
- `ganache5777`: Connect to Ganache using chainId 5777

### Contract Deployment

After deploying the contract, `deployments.json` will contain the deployed address per network:

```json
{
  "networks": {
    "1337": {
      "SupplyChain": {
        "address": "0xYourDeployedAddress"
      }
    }
  }
}
```

## Features

- **Register Roles**: Assign roles (Raw Material Supplier, Manufacturer, Distributor, Retailer)
- **Order Materials**: Add new medicine orders
- **Supply Materials**: Manage supply chain flow
- **Track Materials**: Track medicine through the supply chain with QR codes

## Technology Stack

- **Hardhat**: Development environment
- **Solidity**: Smart contract language
- **JavaScript**: Development language

## License

MIT
