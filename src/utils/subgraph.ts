import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import queries from '@/utils/queries.json';
import config from '@/config';
import { getAddress } from '@ethersproject/address';


export async function request (key: string | null, jsonQuery: any = {}) {
    jsonQuery = key ? merge(cloneDeep(queries[key]), cloneDeep(jsonQuery)) : jsonQuery;
    const query = typeof jsonQuery === 'string' ? jsonQuery : jsonToGraphQLQuery({ query: jsonQuery });
    const res = await fetch(config.subgraphUrl, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    });
    try {
        const { data } = await res.json();
        return data;
    } catch (e) {
        return Promise.reject(e);
    }
}


export function formatPool(pool: any) {
    // let colorIndex = 0;
    pool.tokens = pool.tokens.map((token: any) => {
        token.checksum = getAddress(token.address);
        token.weightPercent = (100 / pool.totalWeight) * token.denormWeight;
        // const configToken = config.tokens[token.checksum];
        // if (configToken) {
        //     token.color = configToken.color;
        // } else {
        //     token.color = unknownColors[colorIndex];
        //     colorIndex++;
        // }
        return token;
    });
    if (pool.shares) pool.holders = pool.shares.length;
    //pool.tokensList = pool.tokensList.map((token: any) => getAddress(token));
    pool.lastSwapVolume = 0;
    const poolTotalSwapVolume = pool.swaps && pool.swaps[0] && pool.swaps[0].poolTotalSwapVolume ? parseFloat(pool.swaps[0].poolTotalSwapVolume) : 0;
    pool.lastSwapVolume = parseFloat(pool.totalSwapVolume) - poolTotalSwapVolume;
    return pool;
}
