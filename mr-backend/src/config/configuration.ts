export default () => ({
    port: parseInt(process.env.PORT || '0', 10) || 3000,
    wsPort: parseInt(process.env.WS_PORT || '0', 10) || 3001,
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || [],
})