import { useState, useEffect } from 'react';

interface TokenData {
    price: number;
    marketCap: number;
    supply: number;
    holders: number | null; // Holders difficult to get from free public APIs reliably without RPC scan
    change24h: number;
}

export const useTokenData = () => {
    const [data, setData] = useState<TokenData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTokenData = async () => {
            const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS;
            if (!tokenAddress) {
                setLoading(false);
                return;
            }

            try {
                // Fetch from DexScreener for Price/MCAP
                const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
                const json = await response.json();

                if (json.pairs && json.pairs.length > 0) {
                    const pair = json.pairs[0];
                    setData({
                        price: parseFloat(pair.priceUsd),
                        marketCap: pair.fdv,
                        supply: 1000000000, // Often difficult to get dynamic supply without RPC, hardcoding generic or fetching specifically if needed
                        holders: null, // Placeholder as DexScreener doesn't provide holders
                        change24h: pair.priceChange.h24
                    });
                }
            } catch (error) {
                console.error("Error fetching token data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTokenData();
        const interval = setInterval(fetchTokenData, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, []);

    return { data, loading };
};
