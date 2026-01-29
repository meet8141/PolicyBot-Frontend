/**
 * PolicyBot - AI Legal Assistant
 * Main JavaScript Application
 * Handles chat functionality, API communication, and UI interactions
 */

// ===================================
// Configuration & State Management
// ===================================
const config = {
    apiEndpoint: localStorage.getItem('apiEndpoint') || 'http://localhost:8000/api/query',
    maxTokens: parseInt(localStorage.getItem('maxTokens')) || 500,
    requestMethod: localStorage.getItem('requestMethod') || 'POST', // POST or GET
    demoMode: localStorage.getItem('demoMode') === 'true' || false,
};

const state = {
    messages: JSON.parse(localStorage.getItem('chatHistory')) || [],
    isTyping: false,
    currentRequestController: null,
    currentSessionId: localStorage.getItem('currentSessionId') || generateSessionId(),
    chatSessions: JSON.parse(localStorage.getItem('chatSessions')) || {},
};

// ===================================
// DOM Elements
// ===================================
const elements = {
    welcomeScreen: document.getElementById('welcomeScreen'),
    messagesArea: document.getElementById('messagesArea'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn'),
    newChatBtn: document.getElementById('newChatBtn'),
    clearChatBtn: document.getElementById('clearChatBtn'),
    settingsBtn: document.getElementById('settingsBtn'),
    historyBtn: document.getElementById('historyBtn'),
    typingIndicator: document.getElementById('typingIndicator'),
    settingsModal: document.getElementById('settingsModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    cancelBtn: document.getElementById('cancelBtn'),
    apiEndpointInput: document.getElementById('apiEndpoint'),
    maxTokensInput: document.getElementById('maxTokens'),
    historyModal: document.getElementById('historyModal'),
    closeHistoryBtn: document.getElementById('closeHistoryBtn'),
    closeHistoryFooterBtn: document.getElementById('closeHistoryFooterBtn'),
    historyList: document.getElementById('historyList'),
    emptyHistory: document.getElementById('emptyHistory'),
    // Sidebar elements
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebarOverlay'),
    menuBtn: document.getElementById('menuBtn'),
    sidebarCloseBtn: document.getElementById('sidebarCloseBtn'),
    sidebarNewChatBtn: document.getElementById('sidebarNewChatBtn'),
    sidebarHistoryBtn: document.getElementById('sidebarHistoryBtn'),
    sidebarClearChatBtn: document.getElementById('sidebarClearChatBtn'),
    sidebarSettingsBtn: document.getElementById('sidebarSettingsBtn'),
};

// ===================================
// Initialization
// ===================================
function init() {
    console.log('🤖 PolicyBot initializing...');
    
    // Load settings
    loadSettings();
    
    // Restore chat history
    if (state.messages.length > 0) {
        hideWelcomeScreen();
        renderChatHistory();
    }
    
    // Event Listeners
    setupEventListeners();
    
    // Auto-resize textarea
    autoResizeTextarea();
    
    console.log('✅ PolicyBot ready!');
}

// ===================================
// Event Listeners Setup
// ===================================
function setupEventListeners() {
    // Sidebar events
    elements.menuBtn.addEventListener('click', openSidebar);
    elements.sidebarCloseBtn.addEventListener('click', closeSidebar);
    elements.sidebarOverlay.addEventListener('click', closeSidebar);
    
    // Sidebar navigation items
    elements.sidebarNewChatBtn.addEventListener('click', () => {
        closeSidebar();
        handleNewChat();
    });
    
    elements.sidebarHistoryBtn.addEventListener('click', () => {
        closeSidebar();
        openHistoryModal();
    });
    
    elements.sidebarClearChatBtn.addEventListener('click', () => {
        closeSidebar();
        handleClearChat();
    });
    
    elements.sidebarSettingsBtn.addEventListener('click', () => {
        closeSidebar();
        openSettingsModal();
    });
    
    // Send message events
    elements.sendBtn.addEventListener('click', handleSendMessage);
    elements.messageInput.addEventListener('keydown', handleKeyPress);
    
    // Form submission (for mobile keyboards)
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSendMessage();
        });
    }
    
    // Suggestion cards
    document.querySelectorAll('.suggestion-card').forEach(card => {
        card.addEventListener('click', () => {
            const query = card.getAttribute('data-query');
            elements.messageInput.value = query;
            handleSendMessage();
        });
    });
    
    // Clear chat - keeping old buttons for backward compatibility
    if (elements.newChatBtn) {
        elements.newChatBtn.addEventListener('click', handleNewChat);
    }
    if (elements.clearChatBtn) {
        elements.clearChatBtn.addEventListener('click', handleClearChat);
    }
    
    // Settings modal - keeping old buttons for backward compatibility
    if (elements.settingsBtn) {
        elements.settingsBtn.addEventListener('click', openSettingsModal);
    }
    elements.closeModalBtn.addEventListener('click', closeSettingsModal);
    elements.cancelBtn.addEventListener('click', closeSettingsModal);
    elements.saveSettingsBtn.addEventListener('click', saveSettings);
    
    // History modal - keeping old buttons for backward compatibility
    if (elements.historyBtn) {
        elements.historyBtn.addEventListener('click', openHistoryModal);
    }
    elements.closeHistoryBtn.addEventListener('click', closeHistoryModal);
    elements.closeHistoryFooterBtn.addEventListener('click', closeHistoryModal);
    
    // Close modal on outside click
    elements.settingsModal.addEventListener('click', (e) => {
        if (e.target === elements.settingsModal) {
            closeSettingsModal();
        }
    });
    
    elements.historyModal.addEventListener('click', (e) => {
        if (e.target === elements.historyModal) {
            closeHistoryModal();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (elements.settingsModal.classList.contains('active')) {
                closeSettingsModal();
            }
            if (elements.historyModal.classList.contains('active')) {
                closeHistoryModal();
            }
            if (elements.sidebar.classList.contains('active')) {
                closeSidebar();
            }
        }
    });
    
    // Auto-resize textarea on input
    elements.messageInput.addEventListener('input', autoResizeTextarea);
    
    // Handle window resize for responsive adjustments
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            autoResizeTextarea();
            scrollToBottom();
        }, 250);
    });
    
    // Trap focus in modal when open
    trapFocusInModal();
}

// ===================================
// Message Handling
// ===================================
async function handleSendMessage() {
    const message = elements.messageInput.value.trim();
    
    if (!message || state.isTyping) {
        return;
    }
    
    // Clear input
    elements.messageInput.value = '';
    autoResizeTextarea();
    
    // Hide welcome screen if visible
    hideWelcomeScreen();
    
    // Add user message to UI
    addMessage('user', message);
    
    // Save to state
    state.messages.push({ role: 'user', content: message, timestamp: Date.now() });
    saveChatHistory();
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Call API
        const response = await queryAPI(message);
        
        // Hide typing indicator
        hideTypingIndicator();
        
        // Add bot response to UI
        addMessage('bot', response);
        
        // Save to state
        state.messages.push({ role: 'bot', content: response, timestamp: Date.now() });
        saveChatHistory();
        
    } catch (error) {
        hideTypingIndicator();
        
        const errorMessage = error.message || 'Sorry, I encountered an error. Please try again.';
        addMessage('bot', `❌ ${errorMessage}`);
        
        state.messages.push({ role: 'bot', content: errorMessage, timestamp: Date.now() });
        saveChatHistory();
    }
}

function handleKeyPress(e) {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
}

// ===================================
// API Communication
// ===================================
async function queryAPI(message) {
    // Create abort controller for cancellation
    state.currentRequestController = new AbortController();
    
    try {
        let response;
        
        // Choose request method
        if (config.requestMethod === 'GET' || config.demoMode) {
            // GET request - send query as URL parameter
            const url = new URL(config.apiEndpoint);
            url.searchParams.append('query', message);
            url.searchParams.append('q', message); // Some APIs use 'q'
            
            response = await fetch(url.toString(), {
                method: 'GET',
                signal: state.currentRequestController.signal,
            });
        } else {
            // POST request - send as JSON body
            response = await fetch(config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: message,
                    max_tokens: config.maxTokens,
                    timestamp: Date.now(),
                }),
                signal: state.currentRequestController.signal,
            });
        }
        
        if (!response.ok) {
            // Try to parse error message from response
            let errorMessage = `Server error: ${response.status}`;
            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData.detail || errorData.message || errorMessage;
                } else {
                    const text = await response.text();
                    // If it's HTML, show a cleaner error
                    if (text.includes('<!DOCTYPE') || text.includes('<html')) {
                        errorMessage = `The API endpoint returned an HTML page instead of data. Please verify the API URL in settings. (Status: ${response.status})`;
                    } else {
                        errorMessage = text || errorMessage;
                    }
                }
            } catch (e) {
                // If parsing fails, use default message
            }
            throw new Error(errorMessage);
        }
        
        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            // Check if it's HTML
            if (text.includes('<!DOCTYPE') || text.includes('<html')) {
                throw new Error('The API endpoint returned an HTML page instead of JSON data. Please check your API endpoint URL in settings.');
            }
            // Return plain text if it's not HTML
            return text || 'Received empty response from server';
        }
        
        const data = await response.json();
        
        // Handle different response formats
        // PolicyBot backend
        if (data.response) {
            return data.response;
        } else if (data.answer) {
            return data.answer;
        } else if (data.result) {
            return data.result;
        }
        // JSONPlaceholder format
        else if (data.title && data.completed !== undefined) {
            return `📝 **${data.title}**\n\nStatus: ${data.completed ? '✅ Completed' : '⏳ Pending'}\nID: ${data.id}\nUser ID: ${data.userId}`;
        }
        else if (data.title && data.body) {
            return `📝 **${data.title}**\n\n${data.body}\n\nID: ${data.id}`;
        }
        // Array response (e.g., list of items)
        else if (Array.isArray(data)) {
            if (data.length === 0) return "No results found.";
            const first = data[0];
            if (first.title) {
                const items = data.slice(0, 5).map((item, i) => 
                    `${i + 1}. **${item.title}** ${item.completed !== undefined ? (item.completed ? '✅' : '⏳') : ''}`
                ).join('\n');
                return `Found ${data.length} items:\n\n${items}${data.length > 5 ? `\n\n... and ${data.length - 5} more` : ''}`;
            }
            return JSON.stringify(data.slice(0, 3), null, 2);
        }
        // Generic string
        else if (typeof data === 'string') {
            return data;
        }
        // Generic object
        else {
            return JSON.stringify(data, null, 2);
        }
        
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request was cancelled');
        }
        
        // Network error
        if (!navigator.onLine) {
            throw new Error('No internet connection. Please check your network.');
        }
        
        // API endpoint error
        if (error.message.includes('Failed to fetch')) {
            throw new Error(`Cannot connect to API at ${config.apiEndpoint}. Please check the endpoint in settings.`);
        }
        
        throw error;
    } finally {
        state.currentRequestController = null;
    }
}

// ===================================
// UI Rendering
// ===================================
function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    messageDiv.setAttribute('role', 'article');
    messageDiv.setAttribute('aria-label', `${role === 'user' ? 'User' : 'Bot'} message`);
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.innerHTML = role === 'user' ? 'U' : '<img style="width: 34px; height: 34px;" src="/assests/PolicyBot_logo.webp" alt="Bot Avatar" />';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    
    // Format message content (handle code blocks, links, etc.)
    bubble.innerHTML = formatMessage(content);
    
    const time = document.createElement('div');
    time.className = 'message-time';
    time.setAttribute('aria-label', `Sent at ${formatTime(new Date())}`);
    time.textContent = formatTime(new Date());
    
    messageContent.appendChild(bubble);
    messageContent.appendChild(time);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    
    elements.messagesArea.appendChild(messageDiv);
    
    // Scroll to bottom
    scrollToBottom();
}

function formatMessage(content) {
    // Escape HTML to prevent XSS
    let formatted = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    
    // Format code blocks (```code```)
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Format inline code (`code`)
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Format bold (**text**)
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Format italic (*text*)
    formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Format links [text](url)
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Format line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
}

function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function renderChatHistory() {
    elements.messagesArea.innerHTML = '';
    state.messages.forEach(msg => {
        addMessage(msg.role, msg.content);
    });
}

function scrollToBottom() {
    setTimeout(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
}

// ===================================
// UI State Management
// ===================================
function hideWelcomeScreen() {
    elements.welcomeScreen.style.display = 'none';
    elements.messagesArea.classList.add('active');
}

function showWelcomeScreen() {
    elements.welcomeScreen.style.display = 'flex';
    elements.messagesArea.classList.remove('active');
}

function showTypingIndicator() {
    state.isTyping = true;
    elements.typingIndicator.style.display = 'flex';
    elements.sendBtn.disabled = true;
    scrollToBottom();
}

function hideTypingIndicator() {
    state.isTyping = false;
    elements.typingIndicator.style.display = 'none';
    elements.sendBtn.disabled = false;
}

function autoResizeTextarea() {
    const textarea = elements.messageInput;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
}

// ===================================
// Sidebar Management
// ===================================
function openSidebar() {
    elements.sidebar.classList.add('active');
    elements.sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus first focusable element in sidebar for accessibility
    setTimeout(() => {
        elements.sidebarCloseBtn.focus();
    }, 100);
}

function closeSidebar() {
    elements.sidebar.classList.remove('active');
    elements.sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Return focus to menu button
    elements.menuBtn.focus();
}

// ===================================
// Chat Management
// ===================================
function handleNewChat() {
    // Save current session if it has messages
    if (state.messages.length > 0) {
        saveChatHistory();
    }
    
    // Start new session
    state.currentSessionId = generateSessionId();
    state.messages = [];
    
    // Clear UI
    elements.messagesArea.innerHTML = '';
    showWelcomeScreen();
    
    // Save new session state
    localStorage.setItem('chatHistory', JSON.stringify(state.messages));
    localStorage.setItem('currentSessionId', state.currentSessionId);
    
    // Focus on input
    elements.messageInput.focus();
    
    showNotification('Started new chat', 'success');
}

function handleClearChat() {
    if (state.messages.length === 0) {
        showNotification('Chat is already empty', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear the current chat and start a new conversation?')) {
        // Save current session before clearing
        saveChatHistory();
        
        // Start new session
        state.currentSessionId = generateSessionId();
        state.messages = [];
        saveChatHistory();
        
        elements.messagesArea.innerHTML = '';
        showWelcomeScreen();
        showNotification('Started new chat', 'success');
    }
}

function saveChatHistory() {
    try {
        // Save current chat to localStorage (for backward compatibility)
        localStorage.setItem('chatHistory', JSON.stringify(state.messages));
        
        // Save to chat sessions
        if (state.messages.length > 0) {
            const firstMessage = state.messages.find(m => m.role === 'user');
            const preview = firstMessage ? firstMessage.content.substring(0, 50) + '...' : 'New chat';
            
            state.chatSessions[state.currentSessionId] = {
                id: state.currentSessionId,
                messages: state.messages,
                timestamp: Date.now(),
                preview: preview,
                messageCount: state.messages.length,
            };
            
            localStorage.setItem('chatSessions', JSON.stringify(state.chatSessions));
            localStorage.setItem('currentSessionId', state.currentSessionId);
        }
    } catch (e) {
        console.error('Failed to save chat history:', e);
    }
}

// ===================================
// Settings Management
// ===================================
function openSettingsModal() {
    elements.settingsModal.classList.add('active');
    // Load current settings
    elements.apiEndpointInput.value = config.apiEndpoint;
    elements.maxTokensInput.value = config.maxTokens;
    
    // Focus first input for accessibility
    setTimeout(() => {
        elements.apiEndpointInput.focus();
    }, 100);
}

function closeSettingsModal() {
    elements.settingsModal.classList.remove('active');
    // Return focus to settings button
    elements.settingsBtn.focus();
}

function saveSettings() {
    const newEndpoint = elements.apiEndpointInput.value.trim();
    const newMaxTokens = parseInt(elements.maxTokensInput.value);
    const newMethod = document.querySelector('input[name="requestMethod"]:checked').value;
    const demoMode = document.getElementById('demoMode').checked;
    
    if (!newEndpoint) {
        showNotification('Please enter a valid API endpoint', 'error');
        return;
    }
    
    if (isNaN(newMaxTokens) || newMaxTokens < 1) {
        showNotification('Please enter a valid max token value', 'error');
        return;
    }
    
    // Save to config
    config.apiEndpoint = newEndpoint;
    config.maxTokens = newMaxTokens;
    config.requestMethod = newMethod;
    config.demoMode = demoMode;
    
    // Save to localStorage
    localStorage.setItem('apiEndpoint', newEndpoint);
    localStorage.setItem('maxTokens', newMaxTokens.toString());
    localStorage.setItem('requestMethod', newMethod);
    localStorage.setItem('demoMode', demoMode.toString());
    
    closeSettingsModal();
    showNotification(`Settings saved! Using ${newMethod} method` + (demoMode ? ' (Demo Mode)' : ''), 'success');
}

function loadSettings() {
    elements.apiEndpointInput.value = config.apiEndpoint;
    elements.maxTokensInput.value = config.maxTokens;
    
    // Set request method radio
    if (config.requestMethod === 'GET') {
        document.getElementById('methodGET').checked = true;
    } else {
        document.getElementById('methodPOST').checked = true;
    }
    
    // Set demo mode checkbox
    document.getElementById('demoMode').checked = config.demoMode;
}

// Focus trap for modal accessibility
function trapFocusInModal() {
    const modal = elements.settingsModal;
    
    modal.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Tab') {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// ===================================
// Notifications
// ===================================
function showNotification(message, type = 'info') {
    // Icon mapping for different notification types
    const icons = {
        info: 'info',
        success: 'check_circle',
        error: 'error',
        warning: 'warning'
    };
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `${type}-message`;
    notification.innerHTML = `
        <span class="material-icons">${icons[type] || icons.info}</span>
        <span>${message}</span>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Position at top center
    notification.style.position = 'fixed';
    notification.style.top = '100px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.zIndex = '2000';
    notification.style.minWidth = '300px';
    notification.style.maxWidth = '500px';
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        notification.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===================================
// Utility Functions
// ===================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ===================================
// Chat History Management
// ===================================
function openHistoryModal() {
    elements.historyModal.classList.add('active');
    renderChatSessions();
}

function closeHistoryModal() {
    elements.historyModal.classList.remove('active');
    elements.historyBtn.focus();
}

function renderChatSessions() {
    const sessions = Object.values(state.chatSessions).sort((a, b) => b.timestamp - a.timestamp);
    
    if (sessions.length === 0) {
        elements.historyList.style.display = 'none';
        elements.emptyHistory.style.display = 'flex';
        return;
    }
    
    elements.historyList.style.display = 'flex';
    elements.emptyHistory.style.display = 'none';
    
    elements.historyList.innerHTML = sessions.map(session => {
        const date = new Date(session.timestamp);
        const isCurrentSession = session.id === state.currentSessionId;
        
        return `
            <div class="history-item" data-session-id="${session.id}">
                <div class="history-item-header">
                    <div class="history-item-title">
                        <span class="material-icons" style="font-size: 18px;">chat</span>
                        ${isCurrentSession ? '<strong>Current Chat</strong>' : formatHistoryDate(date)}
                    </div>
                    <div class="history-item-date">${formatTime(date)}</div>
                </div>
                <div class="history-item-preview">${escapeHtml(session.preview)}</div>
                <div class="history-item-meta">
                    <span>${session.messageCount} message${session.messageCount !== 1 ? 's' : ''}</span>
                    <div class="history-item-actions">
                        ${!isCurrentSession ? `<button class="history-action-btn load-btn" onclick="loadChatSession('${session.id}')">Load</button>` : ''}
                        <button class="history-action-btn delete-btn" onclick="deleteChatSession('${session.id}')">Delete</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function loadChatSession(sessionId) {
    const session = state.chatSessions[sessionId];
    if (!session) {
        showNotification('Chat session not found', 'error');
        return;
    }
    
    // Save current session before switching
    saveChatHistory();
    
    // Load the selected session
    state.currentSessionId = sessionId;
    state.messages = [...session.messages];
    
    // Update UI
    elements.messagesArea.innerHTML = '';
    if (state.messages.length > 0) {
        hideWelcomeScreen();
        renderChatHistory();
    } else {
        showWelcomeScreen();
    }
    
    // Save to localStorage
    localStorage.setItem('chatHistory', JSON.stringify(state.messages));
    localStorage.setItem('currentSessionId', sessionId);
    
    closeHistoryModal();
    showNotification('Chat loaded successfully', 'success');
}

function deleteChatSession(sessionId) {
    const session = state.chatSessions[sessionId];
    if (!session) return;
    
    const isCurrentSession = sessionId === state.currentSessionId;
    const confirmMessage = isCurrentSession 
        ? 'Delete current chat? This will start a new conversation.'
        : 'Delete this chat session?';
    
    if (!confirm(confirmMessage)) return;
    
    // Delete the session
    delete state.chatSessions[sessionId];
    localStorage.setItem('chatSessions', JSON.stringify(state.chatSessions));
    
    // If deleting current session, start a new one
    if (isCurrentSession) {
        state.currentSessionId = generateSessionId();
        state.messages = [];
        localStorage.setItem('chatHistory', JSON.stringify(state.messages));
        localStorage.setItem('currentSessionId', state.currentSessionId);
        elements.messagesArea.innerHTML = '';
        showWelcomeScreen();
    }
    
    // Re-render the list
    renderChatSessions();
    showNotification('Chat deleted', 'success');
}

function formatHistoryDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

// ===================================
// Error Handling
// ===================================
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// ===================================
// Initialize Application
// ===================================
document.addEventListener('DOMContentLoaded', init);

// Export for testing/debugging (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { config, state, queryAPI, addMessage, formatMessage };
}
