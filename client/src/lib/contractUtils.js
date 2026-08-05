import { getContract } from './web3';
export const checkIsOwner = async () => {
    try {
        const { contract, account } = await getContract();
        const owner = await contract.methods.Owner().call();
        return owner.toLowerCase() === account.toLowerCase();
    }
    catch (err) {
        console.error('Error checking owner:', err);
        return false;
    }
};
export const getContractOwner = async () => {
    try {
        const { contract } = await getContract();
        const owner = await contract.methods.Owner().call();
        return owner;
    }
    catch (err) {
        console.error('Error getting owner:', err);
        return null;
    }
};
