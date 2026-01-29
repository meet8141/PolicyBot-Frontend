/**
 * API Configuration File
 * Customize your backend connection settings here
 */

const API_CONFIG = {
    // Backend API Settings
    BASE_URL: 'http://localhost:8000',
    ENDPOINTS: {
        QUERY: '/api/query',
        UPLOAD: '/api/upload',  // For future file upload
        HEALTH: '/api/health',  // Health check endpoint
    },
    
    // Request Settings
    TIMEOUT: 30000, // 30 seconds
    MAX_RETRIES: 3,
    
    // Response Settings
    DEFAULT_MAX_TOKENS: 500,
    
    // UI Settings
    TYPING_DELAY: 800, // Milliseconds before showing typing indicator
    AUTO_SCROLL: true,
    SAVE_HISTORY: true,
};

// Helper function to get full API URL
function getApiUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
