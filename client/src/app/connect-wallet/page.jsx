'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

const NETWORK_NAMES = {
  1: 'Ethereum Mainnet',
  5: 'Goerli',
  10: 'Optimism',
  56: 'BNB Smart Chain',
  97: 'BNB Smart Chain Testnet',
  137: 'Polygon',
  1337: 'Hardhat Local',
  8453: 'Base',
  31337: 'Hardhat Local',
  42161: 'Arbitrum One',
  80002: 'Polygon Amoy',
  11155111: 'Sepolia',
};

function findMetaMaskProvider(ethereum) {
  if (!ethereum) {
    return null;
  }

  if (Array.isArray(ethereum.providers)) {
    return (
      ethereum.providers.find(
        (provider) => provider?.isMetaMask
      ) ?? null
    );
  }

  return ethereum.isMetaMask ? ethereum : null;
}

function parseChainId(chainIdHex) {
  const id = Number.parseInt(chainIdHex, 16);

  if (!Number.isFinite(id)) {
    return {
      id: null,
      name: 'Unknown Network',
    };
  }

  return {
    id,
    name: NETWORK_NAMES[id] ?? `Chain ${id}`,
  };
}

function getErrorMessage(error) {
  if (error?.code === 4001) {
    return 'The MetaMask connection request was rejected.';
  }

  if (error?.code === -32002) {
    return 'A MetaMask request is already pending. Open MetaMask to continue.';
  }

  return error?.message ?? 'Unable to connect to MetaMask.';
}

export default function ConnectWalletPage() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [network, setNetwork] = useState({
    id: null,
    name: '',
  });
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState('');

  const updateNetwork = useCallback((chainIdHex) => {
    setNetwork(parseChainId(chainIdHex));
  }, []);

  useEffect(() => {
    const metaMaskProvider = findMetaMaskProvider(
      window.ethereum
    );

    if (!metaMaskProvider) {
      setStatus('missing');
      return undefined;
    }

    setProvider(metaMaskProvider);
    setStatus('idle');

    const handleAccountsChanged = (accounts) => {
      const nextAccount = accounts?.[0] ?? '';

      setAccount(nextAccount);
      setStatus(nextAccount ? 'connected' : 'idle');
      setError('');
    };

    const handleChainChanged = (chainIdHex) => {
      updateNetwork(chainIdHex);
      setError('');
    };

    const restoreWallet = async () => {
      try {
        const [accounts, chainIdHex] = await Promise.all([
          metaMaskProvider.request({
            method: 'eth_accounts',
          }),
          metaMaskProvider.request({
            method: 'eth_chainId',
          }),
        ]);

        handleAccountsChanged(accounts);
        updateNetwork(chainIdHex);
      } catch (restoreError) {
        setError(getErrorMessage(restoreError));
      }
    };

    restoreWallet();

    metaMaskProvider.on?.(
      'accountsChanged',
      handleAccountsChanged
    );

    metaMaskProvider.on?.(
      'chainChanged',
      handleChainChanged
    );

    return () => {
      metaMaskProvider.removeListener?.(
        'accountsChanged',
        handleAccountsChanged
      );

      metaMaskProvider.removeListener?.(
        'chainChanged',
        handleChainChanged
      );
    };
  }, [updateNetwork]);

  const connectWallet = async () => {
    if (!provider) {
      setStatus('missing');
      return;
    }

    setStatus('connecting');
    setError('');

    try {
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });

      const chainIdHex = await provider.request({
        method: 'eth_chainId',
      });

      const nextAccount = accounts?.[0] ?? '';

      setAccount(nextAccount);
      updateNetwork(chainIdHex);
      setStatus(nextAccount ? 'connected' : 'idle');
    } catch (connectError) {
      setStatus(account ? 'connected' : 'idle');
      setError(getErrorMessage(connectError));
    }
  };

  const shortAddress = useMemo(() => {
    if (!account) {
      return '';
    }

    return `${account.slice(0, 8)}...${account.slice(-6)}`;
  }, [account]);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex text-sm font-semibold text-indigo-700 transition hover:text-indigo-900"
        >
          ← Back to dashboard
        </Link>

        <header className="mb-8 mt-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
            Supply Chain DApp
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Connect your wallet
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Connect MetaMask to view your wallet address and
            currently selected blockchain network.
          </p>
        </header>

        {status === 'checking' && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <p className="font-medium text-slate-600">
              Checking for MetaMask...
            </p>
          </section>
        )}

        {status === 'missing' && (
          <section
            className="rounded-2xl border border-amber-300 bg-amber-50 p-6 shadow-xl md:p-8"
            role="alert"
          >
            <h2 className="text-2xl font-bold text-amber-950">
              MetaMask is not installed
            </h2>

            <p className="mt-3 max-w-xl leading-7 text-amber-900">
              Install the MetaMask browser extension and reload
              this page to connect your wallet.
            </p>

            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-900 px-5 py-3 font-semibold text-white transition hover:bg-amber-800"
            >
              Install MetaMask
            </a>
          </section>
        )}

        {status !== 'checking' && status !== 'missing' && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
                  Wallet
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-950">
                  {account
                    ? 'MetaMask connected'
                    : 'Connect MetaMask'}
                </h2>

                <p className="mt-2 max-w-xl leading-7 text-slate-600">
                  MetaMask will ask you to select and approve an
                  account after clicking the button.
                </p>
              </div>

              <button
                type="button"
                onClick={connectWallet}
                disabled={status === 'connecting'}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'connecting'
                  ? 'Connecting...'
                  : account
                    ? 'Reconnect Wallet'
                    : 'Connect Wallet'}
              </button>
            </div>

            {account && (
              <dl
                className="mt-8 grid gap-4 md:grid-cols-2"
                aria-live="polite"
              >
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Wallet address
                  </dt>

                  <dd
                    className="mt-3 break-all font-mono text-sm font-semibold text-slate-950"
                    title={account}
                  >
                    <span className="md:hidden">
                      {shortAddress}
                    </span>

                    <span className="hidden md:inline">
                      {account}
                    </span>
                  </dd>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Connected network
                  </dt>

                  <dd className="mt-3 text-sm font-semibold text-slate-950">
                    {network.name || 'Unknown Network'}

                    {network.id !== null && (
                      <span className="ml-2 font-mono text-slate-500">
                        Chain ID {network.id}
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            )}

            {error && (
              <p
                className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
                role="alert"
              >
                {error}
              </p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}