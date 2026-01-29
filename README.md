# PolicyBot - AI Legal Assistant Frontend

A modern, professional chatbot interface for legal document research and policy queries. Built with pure HTML, CSS, and JavaScript with comprehensive features for accessibility, responsiveness, and user experience.

## 🚀 Features

### Core Functionality
- **Modern Chat Interface**: Professional design with smooth animations and transitions
- **FastAPI Integration**: Ready-to-use backend integration with error handling
- **Multi-Session Support**: Manage multiple chat sessions with automatic saving
- **Local Storage**: Persistent chat history and settings across sessions
- **Smart Message Formatting**: Supports code blocks, bold, italic, links, and more
- **Typing Indicators**: Real-time visual feedback during API calls
- **Demo Mode**: Test the interface without a backend connection

### User Experience
- **Sidebar Navigation**: Easy access to new chats, history, and settings
- **Welcome Screen**: Quick-start suggestion cards for common queries
- **Chat History Modal**: View and restore previous conversations
- **Settings Panel**: Configurable API endpoint, max tokens, and request methods
- **Toast Notifications**: Non-intrusive alerts for user actions
- **Copy Message**: One-click copy functionality for bot responses
- **Clear Chat**: Easily clear current conversation or all history

### Responsive & Accessible
- **Fully Responsive**: Optimized for desktop, tablet, and mobile (down to 360px)
- **Touch-Friendly**: 44px minimum touch targets for mobile devices
- **Keyboard Navigation**: Complete keyboard support with focus management
- **Screen Reader Support**: ARIA labels and semantic HTML throughout
- **High Contrast**: Accessible color scheme with WCAG compliance
- **Reduced Motion**: Respects user motion preferences

## 📁 Project Structure

```
project_sem_3/
├── index.html              # Main application HTML
├── css/
│   └── style.css          # Complete styling (17.2 KB)
├── js/
│   ├── app.js             # Main application logic (917 lines)
│   └── config.js          # API configuration
├── assests/
│   ├── PolicyBot_logo.png
│   ├── PolicyBot_logo.ico
│   └── ...
├── trial/                  # Development/testing version
│   ├── index.html
│   ├── design.json
│   └── ...
├── README.md              # This file
├── PROJECT_OVERVIEW.md    # Detailed feature documentation
├── QUICKSTART.md          # Quick setup guide
└── IMPROVEMENTS.md        # Accessibility & responsive design details
```

## 🔧 Setup Instructions

### Quick Start (3 Steps)

**1. Test Your Setup**
   - Open `test.html` in your browser to verify API connectivity
   - Use this to debug connection issues before launching the main app

**2. Start Your Backend**
   ```bash
   # If using your own FastAPI backend
   uvicorn main:app --reload --port 8000
   
   # Or use the example backend for testing
   python example_backend.py
   ```

**3. Launch the Frontend**
   ```bash
   # Option A: Simple (double-click index.html)
   
   # Option B: Local server (recommended)
   python -m http.server 8080
   # Visit: http://localhost:8080
   
   # Option C: VS Code Live Server
   # Install "Live Server" extension and click "Go Live"
   ```

### Configuration

**Option A: Through UI (Recommended)**
1. Click the settings button (⚙️) in the top right or sidebar
2. Enter your API endpoint: `http://localhost:8000/api/query`
3. Set max response tokens (default: 500)
4. Choose request method (POST or GET)
5. Enable demo mode for testing without backend
6. Click "Save Settings"

**Option B: Edit Configuration File**
Modify [`js/config.js`](js/config.js):
```javascript
const config = {
    apiEndpoint: 'http://localhost:8000/api/query',
    maxTokens: 500,
    requestMethod: 'POST',
    demoMode: false,
};
```

## 🔌 Backend Integration

### API Request Format

The frontend sends POST requests with this structure:

```json
{
  "query": "What are the key points in our privacy policy?",
  "max_tokens": 500,
  "timestamp": 1706544000,
  "session_id": "session_abc123"
}
```

### Expected Response Format

Your backend should return JSON with one of these fields:

```json
{
  "response": "Here is the answer..."
}
```
*Alternative field names: `"answer"` or `"result"`*

### FastAPI Backend Example

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS (required for browser access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production: ["https://yourdomain.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    max_tokens: int = 500
    timestamp: int
    session_id: str = None

class QueryResponse(BaseModel):
    response: str

@app.post("/api/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    try:
        # Your RAG/AI logic here
        answer = your_rag_function(
            query=request.query,
            max_tokens=request.max_tokens,
            session_id=request.session_id
        )
        
        return QueryResponse(response=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## 💡 Usage Guide

### For End Users

**Starting a Conversation**
- Type your question in the input box and press Enter or click Send
- Click any suggestion card on the welcome screen for quick queries
- Use the microphone icon (if implemented) for voice input

**Managing Chats**
- **New Chat**: Click the "New Chat" button in header or sidebar
- **View History**: Click "History" to see all previous conversations
- **Switch Session**: Click any session in history to restore it
- **Clear Chat**: Remove current conversation or all history

**Customizing**
- **Settings**: Configure API endpoint and behavior
- **Copy Messages**: Click the copy icon on any bot message
- **Adjust View**: Responsive design adapts to your screen size

### For Developers

**Key JavaScript Functions** ([`js/app.js`](js/app.js))

```javascript
// Core functionality
queryAPI(message)              // Send query to backend
addMessage(role, content)      // Add message to UI
formatMessage(content)         // Format with markdown-like syntax
handleSendMessage()           // Process user input

// Session management
createNewSession()            // Start new chat session
switchSession(sessionId)      // Switch to different session
deleteSession(sessionId)      // Remove a session

// UI updates
showTypingIndicator()         // Show bot is typing
hideTypingIndicator()         // Hide typing indicator
showToast(message, type)      // Display notification
```

**Message Formatting Syntax**
- ` ```code``` ` - Code blocks (multi-line)
- `` `code` `` - Inline code
- `**bold**` - Bold text
- `*italic*` - Italic text
- `[text](url)` - Clickable links
- Automatic URL detection and linkification

## 🎨 Customization

### Theming

Edit CSS custom properties in [`css/style.css`](css/style.css):

```css
:root {
    --primary-accent: #1e3a5f;       /* Main brand color */
    --secondary-accent: #3b82f6;     /* Buttons & accents */
    --primary-bg: #f5f7fa;           /* Background color */
    --surface-color: #ffffff;        /* Card backgrounds */
    --text-primary: #1e293b;         /* Main text */
    --text-secondary: #64748b;       /* Secondary text */
    --border-radius: 12px;           /* Corner radius */
    /* ... more variables available */
}
```

### Suggestion Cards

Modify the welcome suggestions in [`index.html`](index.html):

```html
<button class="suggestion-card" data-query="Your custom query here">
    <svg><!-- Your icon SVG --></svg>
    <span>Your suggestion text</span>
</button>
```

### Branding

Replace logo files in `assests/` folder:
- `PolicyBot_logo.png` - Main logo (displayed in header/sidebar)
- `PolicyBot_logo.ico` - Browser favicon

## 🐛 Troubleshooting

### API Connection Issues

**Problem**: "Cannot connect to API" or "Network error"

**Solutions**:
1. Verify backend is running: `curl http://localhost:8000`
2. Check API endpoint in Settings matches your backend URL
3. Open browser DevTools (F12) → Console for detailed errors
4. Use `test.html` for diagnostic testing
5. Enable Demo Mode in settings to test without backend

### CORS Errors

**Problem**: "Access-Control-Allow-Origin" error in console

**Solution**: Add CORS middleware to your FastAPI backend:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],              # For dev; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Chat History Not Saving

**Problem**: History disappears after refresh

**Solutions**:
- Ensure browser localStorage is enabled (not in private mode)
- Check browser console for storage quota errors
- Clear browser cache and try again
- Verify no browser extensions are blocking storage

### Mobile Responsiveness Issues

**Problem**: Layout broken on mobile devices

**Solutions**:
- Clear browser cache on mobile device
- Ensure viewport meta tag is present
- Test in different mobile browsers
- Check CSS for any hardcoded widths

## 📱 Browser Compatibility

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome/Edge | ✅ | ✅ | Recommended, best performance |
| Firefox | ✅ | ✅ | Fully supported |
| Safari | ✅ | ✅ | iOS 12+ required |
| Opera | ✅ | ✅ | Chromium-based |
| Samsung Internet | - | ✅ | Android devices |

**Minimum Requirements**:
- JavaScript enabled
- localStorage support
- Fetch API support
- CSS Grid/Flexbox support

## 🔐 Security Best Practices

### For Production Deployment

1. **HTTPS Only**: Always use HTTPS in production
   ```javascript
   const config = {
       apiEndpoint: 'https://api.yourdomain.com/query',
   };
   ```

2. **CORS Configuration**: Restrict origins to your domain
   ```python
   allow_origins=["https://yourdomain.com"]
   ```

3. **API Authentication**: Implement token-based auth
   - Add Authorization headers
   - Validate tokens on backend
   - Use secure token storage

4. **Input Validation**: Sanitize all user inputs
   - Backend validation (required)
   - Frontend validation (UX)
   - Rate limiting

5. **Content Security Policy**: Add CSP headers
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; script-src 'self' 'unsafe-inline'">
   ```

## 📚 Additional Documentation

- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Complete feature list and implementation details
- **[QUICKSTART.md](QUICKSTART.md)** - Fast 3-step setup guide with troubleshooting
- **[IMPROVEMENTS.md](IMPROVEMENTS.md)** - Accessibility and responsive design documentation

## 🔄 Future Enhancements

**Planned Features**:
- [ ] File upload for document analysis
- [ ] Dark mode theme toggle
- [ ] Export chat history (JSON/PDF)
- [ ] Voice input/output
- [ ] Multi-language support (i18n)
- [ ] Streaming responses (SSE)
- [ ] User authentication system
- [ ] Mobile app version (PWA)
- [ ] Advanced search in chat history
- [ ] Custom theme builder

## 🤝 Contributing

This is a semester 3 college project. While it's primarily for academic purposes, feedback and suggestions are welcome!

**To contribute**:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on multiple devices
5. Submit a pull request with detailed description

## 📄 License

This project is for educational purposes as part of a college semester project.

## 👥 Team

*Semester 3 Project - LJ Institute*

---

## 🆘 Need Help?

1. **Check Documentation**: Review this README and linked documentation files
2. **Test Tool**: Open `test.html` to diagnose API connectivity
3. **Browser Console**: Press F12 to see detailed error messages
4. **Demo Mode**: Enable in settings to test UI without backend
5. **Example Backend**: Use `example_backend.py` for quick testing

**Common Issues**: See [Troubleshooting](#-troubleshooting) section above

---

**Made with ❤️ for legal document research and policy queries**
