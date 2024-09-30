'use client'

import { useCallback, useState } from 'react';

import { useAccount, useConnect, useDisconnect } from 'wagmi'

import { getTokens } from '@coinbase/onchainkit/api'; 
import { TokenSearch } from '@coinbase/onchainkit/token'; 
import { TokenRow } from '@coinbase/onchainkit/token';
import type { Token } from '@coinbase/onchainkit/token'; 

function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  const [tokens, setTokens] = useState<Token[]>([]);

  // example of async onChange handler
  const handleChange = useCallback((value: string) => {
    async function getData(value) {
      const tokens: Token[] = await getTokens({ search: value }); 
      // Do something with tokens here
      setTokens(tokens);
    }
    getData(value);
  }, []);

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
      <div>
        <TokenSearch onChange={handleChange} delayMs={200} />
        {tokens.map((t) => <TokenRow token={t} />)}
      </div>
    </>
  )
}

export default App
