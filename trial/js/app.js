// ===== Configuration =====
const CONFIG = {
    apiEndpoint: 'http://localhost:8000/api', // Change this to your backend URL
    autoSave: true,
};

// ===== State Management =====
const STATE = {
    currentChatId: null,
    messages: [],
    chatHistory: [],
    uploadedFiles: [],
    isTyping: false,
};

// ===== DOM Elements =====
const DOM = {
    // Navigation
    sidebarToggle: document.getElementById('sidebarToggle'),
    uploadBtn: document.getElementById('uploadBtn'),
    historyBtn: document.getElementById('historyBtn'),
    settingsBtn: document.getElementById('settingsBtn'),
    newChatBtn: document.getElementById('newChatBtn'),
    sidebar: document.getElementById('sidebar'),

    // Main containers
    welcomeScreen: document.getElementById('welcomeScreen'),
    chatContainer: document.getElementById('chatContainer'),
    chatMessages: document.getElementById('chatMessages'),
    chatHistory: document.getElementById('chatHistory'),

    // Input
    chatInput: document.getElementById('chatInput'),
    sendBtn: document.getElementById('sendBtn'),
    attachBtn: document.getElementById('attachBtn'),
    uploadedFiles: document.getElementById('uploadedFiles'),

    // Modals
    uploadModal: document.getElementById('uploadModal'),
    historyModal: document.getElementById('historyModal'),
    settingsModal: document.getElementById('settingsModal'),
    loadingOverlay: document.getElementById('loadingOverlay'),

    // Upload modal elements
    uploadArea: document.getElementById('uploadArea'),
    fileInput: document.getElementById('fileInput'),
    fileList: document.getElementById('fileList'),
    closeUploadModal: document.getElementById('closeUploadModal'),
    cancelUpload: document.getElementById('cancelUpload'),
    confirmUpload: document.getElementById('confirmUpload'),

    // History modal elements
    historyList: document.getElementById('historyList'),
    closeHistoryModal: document.getElementById('closeHistoryModal'),

    // Settings modal elements
    apiEndpoint: document.getElementById('apiEndpoint'),
    apiKey: document.getElementById('apiKey'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    autoSaveToggle: document.getElementById('autoSaveToggle'),
    closeSettingsModal: document.getElementById('closeSettingsModal'),
    cancelSettings: document.getElementById('cancelSettings'),
    saveSettings: document.getElementById('saveSettings'),

    // Action pills
    actionPills: document.querySelectorAll('.action-pill'),
};

// ===== Initialization =====
function init() {
    loadSettings();
    loadChatHistory();
    attachEventListeners();
    renderChatHistory();
}

// ===== Event Listeners =====
function attachEventListeners() {
    // Navigation buttons
    DOM.sidebarToggle.addEventListener('click', toggleSidebar);
    DOM.uploadBtn.addEventListener('click', () => openModal('uploadModal'));
    DOM.historyBtn.addEventListener('click', () => openModal('historyModal'));
    DOM.settingsBtn.addEventListener('click', () => openModal('settingsModal'));
    DOM.newChatBtn.addEventListener('click', startNewChat);

    // Chat input
    DOM.sendBtn.addEventListener('click', sendMessage);
    DOM.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    DOM.attachBtn.addEventListener('click', () => openModal('uploadModal'));

    // Upload modal
    DOM.uploadArea.addEventListener('click', () => DOM.fileInput.click());
    DOM.fileInput.addEventListener('change', handleFileSelect);
    DOM.closeUploadModal.addEventListener('click', () => closeModal('uploadModal'));
    DOM.cancelUpload.addEventListener('click', () => closeModal('uploadModal'));
    DOM.confirmUpload.addEventListener('click', confirmFileUpload);

    // Drag and drop
    DOM.uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        DOM.uploadArea.classList.add('drag-over');
    });
    DOM.uploadArea.addEventListener('dragleave', () => {
        DOM.uploadArea.classList.remove('drag-over');
    });
    DOM.uploadArea.addEventListener('drop', handleFileDrop);

    // History modal
    DOM.closeHistoryModal.addEventListener('click', () => closeModal('historyModal'));

    // Settings modal
    DOM.closeSettingsModal.addEventListener('click', () => closeModal('settingsModal'));
    DOM.cancelSettings.addEventListener('click', () => closeModal('settingsModal'));
    DOM.saveSettings.addEventListener('click', saveSettingsHandler);

    // Action pills
    DOM.actionPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            const action = e.currentTarget.getAttribute('data-action');
            handleActionPill(action);
        });
    });

    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (DOM.sidebar.classList.contains('visible') && 
            !DOM.sidebar.contains(e.target) && 
            !DOM.sidebarToggle.contains(e.target)) {
            toggleSidebar();
        }
    });
}

// ===== Sidebar Functions =====
function toggleSidebar() {
    DOM.sidebar.classList.toggle('visible');
}

// ===== Modal Functions =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        if (modalId === 'historyModal') {
            renderHistoryList();
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function showLoading(show = true) {
    DOM.loadingOverlay.style.display = show ? 'flex' : 'none';
}

// ===== Chat Functions =====
function startNewChat() {
    STATE.currentChatId = generateId();
    STATE.messages = [];
    DOM.chatMessages.innerHTML = '';
    DOM.uploadedFiles.innerHTML = '';
    STATE.uploadedFiles = [];
    
    showChatInterface();
}

function showChatInterface() {
    DOM.welcomeScreen.style.display = 'none';
    DOM.chatContainer.style.display = 'flex';
    DOM.chatInput.focus();
}

function showWelcomeScreen() {
    DOM.welcomeScreen.style.display = 'flex';
    DOM.chatContainer.style.display = 'none';
}

async function sendMessage() {
    const message = DOM.chatInput.value.trim();
    
    if (!message && STATE.uploadedFiles.length === 0) return;

    // Create new chat if needed
    if (!STATE.currentChatId) {
        startNewChat();
    }

    // Add user message
    const userMessage = {
        id: generateId(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
        files: [...STATE.uploadedFiles],
    };

    STATE.messages.push(userMessage);
    renderMessage(userMessage);

    // Clear input
    DOM.chatInput.value = '';
    DOM.uploadedFiles.innerHTML = '';

    // Show typing indicator
    showTypingIndicator();

    try {
        // Call backend API
        const response = await callBackendAPI(message, STATE.uploadedFiles);
        
        // Remove typing indicator
        removeTypingIndicator();

        // Add bot response
        const botMessage = {
            id: generateId(),
            role: 'assistant',
            content: response.message || response.text || 'I received your message.',
            timestamp: new Date().toISOString(),
        };

        STATE.messages.push(botMessage);
        renderMessage(botMessage);

        // Save chat
        if (CONFIG.autoSave) {
            saveChatToHistory();
        }

    } catch (error) {
        console.error('Error sending message:', error);
        removeTypingIndicator();
        
        const errorMessage = {
            id: generateId(),
            role: 'assistant',
            content: 'Sorry, I encountered an error processing your request. Please try again.',
            timestamp: new Date().toISOString(),
            isError: true,
        };

        STATE.messages.push(errorMessage);
        renderMessage(errorMessage);
    }

    // Clear uploaded files
    STATE.uploadedFiles = [];
}

function renderMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.role}`;
    messageDiv.innerHTML = `
        <div class="message-avatar">
            ${message.role === 'user' 
                ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
                : '<img src="assests/PolicyBot_logo.png" alt="PolicyBot">'
            }
        </div>
        <div class="message-content">
            <div class="message-text">${formatMessageContent(message.content)}</div>
            <div class="message-time">${formatTime(message.timestamp)}</div>
            ${message.files && message.files.length > 0 ? renderMessageFiles(message.files) : ''}
        </div>
    `;

    DOM.chatMessages.appendChild(messageDiv);
    DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
}

function formatMessageContent(content) {
    // Basic markdown-like formatting
    return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

function renderMessageFiles(files) {
    const filesList = files.map(file => `
        <div class="message-file">
            📄 ${file.name}
        </div>
    `).join('');
    return `<div class="message-files">${filesList}</div>`;
}

function showTypingIndicator() {
    STATE.isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant typing';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <img src="assests/PolicyBot_logo.png" alt="PolicyBot">
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    DOM.chatMessages.appendChild(typingDiv);
    DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    STATE.isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// ===== File Upload Functions =====
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    addFilesToList(files);
}

function handleFileDrop(e) {
    e.preventDefault();
    DOM.uploadArea.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files);
    addFilesToList(files);
}

function addFilesToList(files) {
    files.forEach(file => {
        // Validate file type
        const validTypes = ['.pdf', '.doc', '.docx', '.txt'];
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validTypes.includes(fileExt)) {
            alert(`File type ${fileExt} is not supported. Please upload PDF, DOC, DOCX, or TXT files.`);
            return;
        }

        // Add to state
        STATE.uploadedFiles.push(file);
    });

    renderFileList();
}

function renderFileList() {
    DOM.fileList.innerHTML = '';
    
    STATE.uploadedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                    </svg>
                </div>
                <div class="file-details">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <button class="btn-icon" onclick="removeFile(${index})">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        `;
        DOM.fileList.appendChild(fileItem);
    });
}

function removeFile(index) {
    STATE.uploadedFiles.splice(index, 1);
    renderFileList();
}

async function confirmFileUpload() {
    if (STATE.uploadedFiles.length === 0) {
        alert('Please select files to upload.');
        return;
    }

    showLoading(true);

    try {
        // Upload files to backend
        const uploadedFileData = await uploadFilesToBackend(STATE.uploadedFiles);
        
        // Add file chips to input area
        renderUploadedFileChips(uploadedFileData);
        
        closeModal('uploadModal');
        showChatInterface();
        
    } catch (error) {
        console.error('Error uploading files:', error);
        alert('Error uploading files. Please try again.');
    } finally {
        showLoading(false);
    }
}

function renderUploadedFileChips(files) {
    DOM.uploadedFiles.innerHTML = '';
    
    files.forEach((file, index) => {
        const chip = document.createElement('div');
        chip.className = 'uploaded-file-chip';
        chip.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span>${file.name || file.filename || 'Document'}</span>
            <button onclick="removeUploadedFileChip(${index})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        `;
        DOM.uploadedFiles.appendChild(chip);
    });
}

function removeUploadedFileChip(index) {
    STATE.uploadedFiles.splice(index, 1);
    renderUploadedFileChips(STATE.uploadedFiles);
}

// ===== Backend API Functions =====
async function callBackendAPI(message, files) {
    const endpoint = `${CONFIG.apiEndpoint}/chat`;
    
    const payload = {
        message: message,
        chatId: STATE.currentChatId,
        files: files.map(f => f.id || f.name),
        timestamp: new Date().toISOString(),
    };

    const headers = {
        'Content-Type': 'application/json',
    };

    if (CONFIG.apiKey) {
        headers['Authorization'] = `Bearer ${CONFIG.apiKey}`;
    }

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

async function uploadFilesToBackend(files) {
    const endpoint = `${CONFIG.apiEndpoint}/upload`;
    
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file);
    });

    const headers = {};
    if (CONFIG.apiKey) {
        headers['Authorization'] = `Bearer ${CONFIG.apiKey}`;
    }

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.files || result.data || files.map(f => ({ name: f.name, id: generateId() }));
}

// ===== Chat History Functions =====
function saveChatToHistory() {
    if (STATE.messages.length === 0) return;

    const chat = {
        id: STATE.currentChatId,
        title: generateChatTitle(),
        messages: STATE.messages,
        timestamp: new Date().toISOString(),
    };

    // Check if chat already exists
    const existingIndex = STATE.chatHistory.findIndex(c => c.id === STATE.currentChatId);
    
    if (existingIndex !== -1) {
        STATE.chatHistory[existingIndex] = chat;
    } else {
        STATE.chatHistory.unshift(chat);
    }

    // Keep only last 50 chats
    if (STATE.chatHistory.length > 50) {
        STATE.chatHistory = STATE.chatHistory.slice(0, 50);
    }

    localStorage.setItem('chatHistory', JSON.stringify(STATE.chatHistory));
    renderChatHistory();
}

function loadChatHistory() {
    const stored = localStorage.getItem('chatHistory');
    if (stored) {
        try {
            STATE.chatHistory = JSON.parse(stored);
        } catch (e) {
            console.error('Error loading chat history:', e);
            STATE.chatHistory = [];
        }
    }
}

function renderChatHistory() {
    DOM.chatHistory.innerHTML = '';
    
    if (STATE.chatHistory.length === 0) {
        DOM.chatHistory.innerHTML = '<p style="color: var(--color-text-tertiary); text-align: center; padding: 20px;">No chat history yet</p>';
        return;
    }

    STATE.chatHistory.forEach(chat => {
        const item = document.createElement('div');
        item.className = `chat-history-item ${chat.id === STATE.currentChatId ? 'active' : ''}`;
        item.innerHTML = `
            <div class="chat-history-title">${chat.title}</div>
            <div class="chat-history-date">${formatDate(chat.timestamp)}</div>
        `;
        item.addEventListener('click', () => loadChat(chat.id));
        DOM.chatHistory.appendChild(item);
    });
}

function renderHistoryList() {
    DOM.historyList.innerHTML = '';
    
    if (STATE.chatHistory.length === 0) {
        DOM.historyList.innerHTML = '<p style="color: var(--color-text-tertiary); text-align: center; padding: 40px;">No chat history yet. Start a conversation to see it here.</p>';
        return;
    }

    STATE.chatHistory.forEach(chat => {
        const item = document.createElement('div');
        item.className = 'history-item';
        const preview = chat.messages[0]?.content.substring(0, 100) || 'No messages';
        item.innerHTML = `
            <div class="history-item-header">
                <div class="history-item-title">${chat.title}</div>
                <div class="history-item-date">${formatDate(chat.timestamp)}</div>
            </div>
            <div class="history-item-preview">${preview}...</div>
        `;
        item.addEventListener('click', () => {
            loadChat(chat.id);
            closeModal('historyModal');
        });
        DOM.historyList.appendChild(item);
    });
}

function loadChat(chatId) {
    const chat = STATE.chatHistory.find(c => c.id === chatId);
    if (!chat) return;

    STATE.currentChatId = chat.id;
    STATE.messages = chat.messages;
    
    DOM.chatMessages.innerHTML = '';
    STATE.messages.forEach(msg => renderMessage(msg));
    
    showChatInterface();
    renderChatHistory();
}

function generateChatTitle() {
    const firstMessage = STATE.messages.find(m => m.role === 'user');
    if (firstMessage) {
        return firstMessage.content.substring(0, 50) + (firstMessage.content.length > 50 ? '...' : '');
    }
    return 'New Chat';
}

// ===== Action Pill Handlers =====
function handleActionPill(action) {
    startNewChat();
    
    const prompts = {
        analyze: 'I would like to analyze a legal document. Please help me understand the key points.',
        search: 'I need to search for relevant case precedents.',
        summarize: 'Can you help me summarize a case file?',
        compare: 'I want to compare multiple legal documents.',
    };

    DOM.chatInput.value = prompts[action] || '';
    DOM.chatInput.focus();
}

// ===== Settings Functions =====
function loadSettings() {
    const stored = localStorage.getItem('settings');
    if (stored) {
        try {
            const settings = JSON.parse(stored);
            CONFIG.apiEndpoint = settings.apiEndpoint || CONFIG.apiEndpoint;
            CONFIG.apiKey = settings.apiKey || CONFIG.apiKey;
            CONFIG.autoSave = settings.autoSave !== undefined ? settings.autoSave : CONFIG.autoSave;
        } catch (e) {
            console.error('Error loading settings:', e);
        }
    }
}

function saveSettingsHandler() {
    CONFIG.apiEndpoint = DOM.apiEndpoint.value || CONFIG.apiEndpoint;
    CONFIG.apiKey = DOM.apiKey.value || CONFIG.apiKey;
    CONFIG.autoSave = DOM.autoSaveToggle.checked;

    const settings = {
        apiEndpoint: CONFIG.apiEndpoint,
        apiKey: CONFIG.apiKey,
        autoSave: CONFIG.autoSave,
    };

    localStorage.setItem('settings', JSON.stringify(settings));
    
    closeModal('settingsModal');
    
    // Show success notification (you can enhance this)
    alert('Settings saved successfully!');
}

// ===== Utility Functions =====
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', init);

// ===== Export for inline handlers =====
window.removeFile = removeFile;
window.removeUploadedFileChip = removeUploadedFileChip;
