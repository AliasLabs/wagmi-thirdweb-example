# Use Alias + thirdweb in a WAGMI application

This repo is a modified fork of thirdweb's example [repo here](https://github.com/thirdweb-example/wagmi-thirdweb). It demonstrates how to use Alias' OAuth + wallet and thirdweb Pay or any other thirdweb features within an existing WAGMI application.

## 1. Get an API key

Get yourself a [thirdweb API key](https://thirdweb.com/dashboard/settings/api-keys) and add it to the top of `page.tsx`. We recommend putting this in a .env file.

## 2. Setup the provider

To use the thirdweb react feature, you need to wrap your application with a `<ThirdwebProvider>` like shown in `providers.tsx`.

## 3. Setup Alias
There are a few steps to setup Alias with NextAuth (required) and wagmi:
1. Get your client ID and client secret from Alias and add them to your .env file set as `AUTH_ALIAS_ID` and `AUTH_ALIAS_SECRET`.
2. Include `AUTH_SECRET` in your .env file. NextAuth will throw an error if this is not set.
3. Add the following files to your project: `auth.ts`, `middleware.ts` and `api/auth/[...nextauth]/route.ts`. These files are used to authenticate users with Alias handled by NextAuth.
4. Import the `connecter` from `alias-wallet` and set it alongside the other wagmi connectors in your wagmi config (in `wagmi.ts`).

## 4. Convert the wagmi wallet client

Once connected with a wagmi connector, you can get the wallet client and convert it to a thirdweb compatible wallet.

Once you have a thirdweb compatible wallet, you simply set it as 'active' and all the thirdweb components and hooks will then use this active wallet.

```tsx
// This is how to set a wagmi account in the thirdweb context to use with all the thirdweb components including Pay
const { data: walletClient } = useWalletClient(); // from wagmi
const { switchChainAsync } = useSwitchChain(); // from wagmi
const setActiveWallet = useSetActiveWallet(); // from thirdweb
useEffect(() => {
    const setActive = async () => {
        if (walletClient) {
            const adaptedAccount = viemAdapter.walletClient.fromViem({
                walletClient: walletClient as any, // accounts for wagmi/viem version mismatches
            });
            const w = createWalletAdapter({
                adaptedAccount,
                chain: defineChain(await walletClient.getChainId()),
                client,
                onDisconnect: async () => {
                    await disconnectAsync();
                },
                switchChain: async (chain) => {
                    await switchChainAsync({ chainId: chain.id as any });
                },
            });
            setActiveWallet(w);
        }
    };
    setActive();
}, [walletClient, disconnectAsync, switchChainAsync, setActiveWallet]);
```

View the full source code in `page.tsx`.

## 5. Use thirdweb normally

You can now use <PayEmbed>, <TransactionButton> or any other thirdweb component / hook and it will use the active connected wallet to perform transactions.