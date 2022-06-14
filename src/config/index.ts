import homestead from './homestead.json';
import kovan from './kovan.json';
import rinkeby from './ares_rinkeby.json';

interface Connector {
    id: string;
    name: string;
    options: any;
}

export interface AssetMetadata {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string | undefined;
}

interface Config {
    network: string;
    chainId: number;
    precision: number;
    infuraKey: string;
    alchemyKey: string;
    subgraphUrl: string;
    subgraphBackupUrl: string;
    addresses: {
        bFactory: string;
        bActions: string;
        dsProxyRegistry: string;
        exchangeProxy: string;
        weth: string;
        multicall: string;
        sorMulticall: string | null;
    };
    assets: Record<string, AssetMetadata>;
    untrusted: string[];
    connectors: Record<string, Connector>;
}

const configs = {
    1: {
        untrusted: [],
        ...homestead,
    },
    42:{
        untrusted: [],
        ...kovan,
    },
    4:{
        untrusted: [],
        ...rinkeby,
    },
};
// eslint-disable-next-line no-undef
const network = process.env.APP_CHAIN_ID || 4;

const config: Config = configs[network];

export default config;
