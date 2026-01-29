# PolicyBot - AI Legal Assistant Frontend

A modern, professional chatbot interface for legal document research and policy queries. Built with pure HTML, CSS, and JavaScript.

## 🚀 Features

- **Clean, Professional UI**: Designed specifically for legal/business context
- **Real-time Chat Interface**: Smooth, responsive chat experience
- **FastAPI Integration**: Ready to connect with your Python backend
- **Local Storage**: Saves chat history and settings
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smart Message Formatting**: Supports code blocks, bold, italic, and links
- **Typing Indicators**: Visual feedback during API calls
- **Settings Panel**: Configurable API endpoint and parameters
- **Suggestion Cards**: Quick-start queries for common tasks

## 📁 Project Structure

```
project_sem_3/
├── index.html          # Main HTML structure
├── css/
│   └── style.css       # All styling
├── js/
│   └── app.js          # Application logic and API integration
├── assests/
│   ├── PolicyBot_logo.png
│   ├── PolicyBot_logo.ico
│   └── ...             # Other assets
└── README.md           # This file
```

## 🔧 Setup Instructions

### 1. Basic Setup

1. Clone or download this project
2. Make sure all files are in their correct directories
3. Open `index.html` in a web browser

### 2. Configure API Endpoint

**Option A: Through UI (Recommended)**
1. Click the settings icon (⚙️) in the top right
2. Enter your FastAPI endpoint (e.g., `http://localhost:8000/api/query`)
3. Set max response length if needed
4. Click "Save Settings"

**Option B: Edit JavaScript**
Open `js/app.js` and modify the default configuration:
```javascript
const config = {
    apiEndpoint: 'http://your-api-url:8000/api/query',
    maxTokens: 500,
};
```

### 3. Run with Live Server

For development, use a local server:

**Using Python:**
```bash
# Python 3
python -m http.server 8080

# Then visit: http://localhost:8080
```

**Using Node.js:**
```bash
npx serve
```

**Using VS Code:**
Install "Live Server" extension and click "Go Live"

## 🔌 Backend Integration

### Expected API Format

The frontend expects your FastAPI backend to accept POST requests with this format:

**Request:**
```json
{
  "query": "What are the key points in our privacy policy?",
  "max_tokens": 500,
  "timestamp": 1234567890
}
```

**Response (choose one format):**
```json
{
  "response": "Here is the answer..."
}
```
or
```json
{
  "answer": "Here is the answer..."
}
```
or
```json
{
  "result": "Here is the answer..."
}
```

### FastAPI Example Endpoint

Here's a sample FastAPI endpoint structure:

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    max_tokens: int = 500
    timestamp: int

class QueryResponse(BaseModel):
    response: str

@app.post("/api/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    try:
        # Your RAG logic here
        answer = your_rag_function(request.query, request.max_tokens)
        
        return QueryResponse(response=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## 🎨 Customization

### Colors
Edit CSS variables in `css/style.css`:
```css
:root {
    --primary-accent: #1e3a5f;      /* Main brand color */
    --secondary-accent: #3b82f6;    /* Accent color */
    --primary-bg: #f5f7fa;          /* Background */
    /* ... more variables */
}
```

### Suggestion Cards
Edit the HTML in `index.html` to change the quick-start suggestions:
```html
<button class="suggestion-card" data-query="Your custom query here">
    <!-- SVG icon -->
    <span>Your suggestion text</span>
</button>
```

### Logo
Replace images in `assests/` folder:
- `PolicyBot_logo.png` - Main logo
- `PolicyBot_logo.ico` - Favicon

## 💡 Usage Guide

### For Users

1. **Start a Conversation**: Type your question or click a suggestion card
2. **View Responses**: Bot responses appear with formatting and timestamps
3. **Clear Chat**: Click the trash icon to clear history
4. **Settings**: Click gear icon to configure API settings

### For Developers

**Key Functions in app.js:**

- `queryAPI(message)` - Sends request to backend
- `addMessage(role, content)` - Adds message to UI
- `formatMessage(content)` - Formats message with markdown-like syntax
- `handleSendMessage()` - Main message sending logic

**Message Formatting:**
- \`\`\`code\`\`\` - Code blocks
- \`code\` - Inline code
- \*\*bold\*\* - Bold text
- \*italic\* - Italic text
- [text](url) - Links

## 🐛 Troubleshooting

### API Connection Issues

**Problem**: "Cannot connect to API"
**Solution**: 
1. Check if your FastAPI server is running
2. Verify the API endpoint in settings
3. Check CORS configuration on backend
4. Open browser console (F12) for detailed errors

### CORS Errors

Add this to your FastAPI backend:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Chat History Not Saving

- Check browser's localStorage is enabled
- Clear cache and reload
- Check browser console for errors

## 📱 Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## 🔐 Security Notes

For production deployment:

1. **HTTPS**: Always use HTTPS in production
2. **CORS**: Restrict `allow_origins` to your specific domain
3. **API Keys**: If using API keys, implement proper authentication
4. **Input Validation**: Backend should validate all inputs
5. **Rate Limiting**: Implement rate limiting on backend

## 📝 Todo / Future Enhancements

- [ ] File upload functionality
- [ ] Dark mode
- [ ] Export chat history
- [ ] Voice input
- [ ] Multi-language support
- [ ] Streaming responses
- [ ] User authentication

## 🤝 Contributing

This is a college project, but suggestions are welcome!

## 📄 License

This project is for educational purposes.

## 👥 Team

Your team information here

---

**Need Help?** Check the browser console (F12) for detailed error messages.

**Backend Not Ready?** You can test the UI with mock data by uncommenting the mock function in `app.js`.
