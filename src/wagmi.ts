import { http, createConfig } from "wagmi";
import { baseSepolia, sepolia } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { connector as alias } from "alias-wallet";

export const config = createConfig({
	chains: [
		sepolia, 
		baseSepolia
	],
	connectors: [
		injected(), 
		coinbaseWallet({ appName: "Create Wagmi" }),
		alias({
      keysUrl: `${process.env.NEXT_PUBLIC_ALIAS_URL}/wallet`,
      appName: 'Create Wagmi',
			oauthConfig: {
				signOutRedirect: { enabled: true, url: "/" }
			}
    })
	],
	ssr: true,
	transports: {
		[sepolia.id]: http(),
		[baseSepolia.id]: http(),
	},
});

declare module "wagmi" {
	interface Register {
		config: typeof config;
	}
}
