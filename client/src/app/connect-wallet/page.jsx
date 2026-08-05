"use client";

import { useState } from "react";

const networks = {
  "0x1": "Ethereum Mainnet",
  "0xaa36a7": "Sepolia",
  "0x89": "Polygon",
  "0x7a69": "Hardhat Local", // 31337
};

export default function ConnectWalletPage() {
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState("");
  const [message, setMessage] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      setMessage("MetaMask is not installed.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      setAddress(accounts[0]);
      setNetwork(networks[chainId] || chainId);
      setMessage("");
    } catch {
      setMessage("Failed to connect MetaMask.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          Connect Wallet
        </h1>

        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>

        {message && (
          <p className="mt-4 text-red-600">{message}</p>
        )}

        {address && (
          <div className="mt-6">
            <p>
              <strong>Wallet Address:</strong>
            </p>
            <p className="break-all">{address}</p>

            <p className="mt-4">
              <strong>Network:</strong> {network}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}