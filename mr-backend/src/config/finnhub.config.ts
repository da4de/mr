export default () => ({
    finnhub: {
        apiKey: process.env.FINNHUB_API_KEY,
        address: process.env.FINNHUB_ADDRESS,
        wsAddress: process.env.FINNHUB_WS_ADDRESS,
    }
})