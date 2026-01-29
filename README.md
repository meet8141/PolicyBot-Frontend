# PolicyBot - AI Legal Assistant Frontend

A modern, professional chatbot interface for legal document research and policy queries. Features a dark green AI-themed design with bright green accents, collapsible sidebar navigation, and comprehensive chat management. Built with pure HTML, CSS, and JavaScript.

## 🚀 Features

### Core Features
- **Dark Green AI Theme**: Professional dark interface with bright green (#00ff88) accent colors
- **Collapsible Sidebar**: Mobile-friendly navigation with menu, history, and settings
- **Real-time Chat Interface**: Smooth, responsive chat experience with typing indicators
- **Session Management**: Multiple chat sessions with history tracking
- **FastAPI Integration**: Ready to connect with your Python backend
- **Demo Mode**: Test with any REST API (GET/POST methods supported)
- **Local Storage**: Persistent chat history and settings across sessions
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices

### UI/UX Features
- **Welcome Screen**: Professional landing page with suggestion cards
- **Smart Message Formatting**: Supports code blocks, bold, italic, and links
- **Typing Indicators**: Animated orb and dots while bot is thinking
- **Auto-resize Input**: Message textarea grows with content
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new line
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Material Icons**: Consistent iconography throughout

### Settings & Configuration
- **Configurable API Endpoint**: Change backend URL via UI
- **Request Method Toggle**: Switch between POST and GET requests
- **Max Token Control**: Adjust response length limits
- **Chat History Modal**: Browse and load previous conversations
- **Clear Chat**: Reset current conversation
- **New Chat**: Start fresh conversations

## 📁 Project Structure

```
project_sem_3/
├── index.html              # Main HTML structure with sidebar, modals, and chat interface
├── css/
│   └── style.css          # Complete styling (1622 lines) - dark green theme
├── js/
│   ├── app.js             # Main application logic (917 lines)
│   └── config.js          # API configuration settings
├── assests/
│   ├── PolicyBot_logo.png # Main logo
│   ├── PolicyBot_logo.ico # Favicon
│   ├── PolicyBot_logo.webp
│   └── PolicyBot_logo_1.png
├── trial/                  # Development/testing folder
│   ├── index.html
│   ├── design.json
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── assests/
└── README.md              # This file
```

## 🔧 Quick Start

### 1. Basic Setup

1. Clone or download this project
2. Make sure all files are in their correct directories
3. Open `index.html` in a web browser

### 2. Configure API Endpoint


1. Click the menu icon (☰) to open sidebar
2. Click "Settings" (⚙️)
3. Enter your API endpoint (e.g., `http://localhost:8000/api/query`)
4. Choose request method (POST for production, GET for demos)
5. Set max response length (default: 500 tokens)
6. Enable "Demo Mode" to test with any REST API
7. Click "Save Settings"

## 🎨 Customization

### Theme Colors

The project uses a dark green AI theme. Edit CSS variables in `css/style.css`:

```css
:root {
    /* Background Colors */
    --primary-bg: #0a1f1a;          /* Dark green background */
    --surface-light: #1a2f2a;       /* Lighter surface */
    --surface-card: #1e3a33;        /* Card backgrounds */
    
    /* Accent Colors */
    --primary-accent: #00ff88;      /* Bright green */
    --primary-hover: #00cc6f;       /* Hover state */
    --accent-glow: rgba(0, 255, 136, 0.3); /* Glow effect */
    
    /* Semantic Colors */
    --success: #10b981;
    --warning: #f59e0b;
    --error: #ef4444;
}
```

### Welcome Screen Suggestions

Edit suggestion cards in `index.html` (around line 95):

```html
<button class="suggestion-card" data-query="Your custom query here">
    <span class="material-icons">description</span>
    <span>Your suggestion text</span>
</button>
```

### Logo & Branding

Replace images in `assests/` folder:
- `PolicyBot_logo.png` - Main logo (used in header and sidebar)
- `PolicyBot_logo.ico` - Browser favicon
- Recommended sizes: 512x512px for PNG, 48x48px for ICO

## 💡 Usage Guide

### For End Users

1. **Starting a Chat**:
   - Click suggestion cards on welcome screen, OR
   - Type your question in the input box at the bottom
   - Press Enter to send (Shift+Enter for new line)

2. **Managing Chats**:
   - Click menu (☰) to open sidebar
   - "New Chat" - Start a fresh conversation
   - "Chat History" - View and load previous sessions
   - "Clear Chat" - Delete current conversation

3. **Settings**:
   - Configure API endpoint and parameters
   - Enable demo mode for testing
   - All settings saved in browser's localStorage

### For Developers

**Key Files:**

- **`js/app.js`** (917 lines): Main application logic
  - `init()` - Initializes app and loads saved state
  - `queryAPI(message)` - Sends API requests
  - `handleSendMessage()` - Processes user input
  - `addMessage(role, content)` - Adds messages to chat
  - `formatMessage(content)` - Markdown-like formatting
  - `openSidebar()` / `closeSidebar()` - Sidebar controls
  - `loadChatSession(sessionId)` - Loads saved chats

- **`js/config.js`**: API configuration constants
  - `API_CONFIG.BASE_URL` - Backend server URL
  - `API_CONFIG.ENDPOINTS` - API routes
  - `getApiUrl(endpoint)` - Helper function

- **`css/style.css`** (1622 lines): Complete styling
  - CSS variables for theming
  - Responsive breakpoints
  - Animations and transitions
  - Component-specific styles

**State Management:**

```javascript
const state = {
    messages: [],               // Current chat messages
    isTyping: false,           // Typing indicator state
    currentSessionId: "...",   // Active session ID
    chatSessions: {},          // All saved sessions
};
```

**Message Formatting:**

The app supports markdown-like syntax:
- ` ```code``` ` - Code blocks
- `` `code` `` - Inline code  
- `**bold**` - Bold text
- `*italic*` - Italic text
- `[text](url)` - Hyperlinks

## 🐛 Troubleshooting

### API Connection Errors

**Problem**: "Failed to connect to API" or "Network error"

**Solutions**:
1. Check if backend server is running (`http://localhost:8000`)
2. Verify API endpoint in settings matches your backend
3. Check browser console (F12) for detailed errors
4. Enable Demo Mode to test with public APIs first



### Chat History Not Saving

**Problem**: Messages disappear after refresh

**Solutions**:
1. Check if browser's localStorage is enabled
2. Check browser console for localStorage errors
3. Clear browser cache and try again
4. Verify you're not in private/incognito mode

### Sidebar Not Opening

**Problem**: Menu button doesn't open sidebar

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify all scripts are loaded (check Network tab)
3. Try hard refresh (Ctrl+Shift+R)

## 📱 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Recommended |
| Edge | ✅ Full | Recommended |
| Firefox | ✅ Full | All features work |
| Safari | ✅ Full | iOS/macOS supported |
| Opera | ✅ Full | Chromium-based |
| Mobile | ✅ Full | Responsive design |

**Minimum Requirements:**
- ES6+ JavaScript support
- CSS Grid and Flexbox
- localStorage API
- Fetch API



## 📊 Technical Details

- **Total Lines**: ~2,700+ lines (HTML, CSS, JS combined)
- **No Dependencies**: Pure vanilla JavaScript, no frameworks
- **localStorage**: Persistent data storage
- **Material Icons**: Google Material Design icons via CDN
- **Font**: Segoe UI system font (cross-platform)
- **CSS Grid & Flexbox**: Modern layout techniques
- **Responsive**: Mobile-first design approach

## 🎯 Future Enhancements

- [ ] File upload functionality for document analysis
- [ ] Export chat history as PDF/JSON
- [ ] Voice input and text-to-speech
- [ ] Multi-language support
- [ ] Streaming responses (SSE/WebSocket)
- [ ] User authentication and profiles
- [ ] Dark/light theme toggle
- [ ] Keyboard shortcuts panel
- [ ] Search within chat history
- [ ] Markdown rendering improvements

## 📚 Documentation

For more details, check:
- [JavaScript Documentation](js/app.js) - Inline comments and JSDoc
- [CSS Architecture](css/style.css) - Component organization
- [API Config](js/config.js) - Backend configuration

## 🤝 Contributing

This is a Semester 3 college project. Contributions, suggestions, and feedback are welcome!

## 📄 License

This project is for educational purposes as part of academic coursework.

## 👥 Team

**Project**: Semester 3 - LJ University  
**Project Name**: PolicyBot - AI Legal Assistant  
**Academic Year**: 2025-2026

---

**Need Help?** 
- Check browser console (F12) for detailed error messages
- Enable Demo Mode to test without a backend
- Try the JSONPlaceholder demo APIs provided in settings
