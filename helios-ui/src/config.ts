export const CONFIG = {
    // Dynamic endpoints via Vite environment variables
    API_URL: import.meta.env.VITE_API_URL || "http://localhost:8890",
    WS_URL: import.meta.env.VITE_WS_URL || "ws://localhost:8890/ws",

    // System Parameters
    HEARTBEAT_INTERVAL: 10000,
    RECONNECT_INTERVAL: 5000
};
