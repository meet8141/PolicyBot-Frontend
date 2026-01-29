# 🚀 PolicyBot - Quick Start Guide

## ⚡ Get Started in 3 Steps

### Step 1: Test Your Setup (2 minutes)

Open `test.html` in your browser:
```bash
# Just double-click test.html or open it in a browser
```

This will help you:
- ✅ Verify your API endpoint
- ✅ Test backend connectivity
- ✅ Send test queries
- ✅ Debug any issues

### Step 2: Start Your Backend

**If you have your FastAPI backend ready:**
```bash
cd your-backend-directory
python -m uvicorn main:app --reload --port 8000
```

**If you want to test with the example backend:**
```bash
# Install dependencies first
pip install fastapi uvicorn

# Run the example backend
python example_backend.py
```

Your backend should be running at: `http://localhost:8000`

### Step 3: Launch the Frontend

**Option A: Double-click `index.html`**
- Simplest method, just open the file

**Option B: Use a local server (recommended)**
```bash
# Using Python
python -m http.server 8080

# Then visit: http://localhost:8080
```

**Option C: VS Code Live Server**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

---

## 🎯 Using PolicyBot

### First Time Setup

1. **Open the app** → You'll see the welcome screen
2. **Click Settings (⚙️)** in the top-right
3. **Enter your API endpoint** (e.g., `http://localhost:8000/api/query`)
4. **Save settings**

### Chatting

- **Type your question** in the input box at the bottom
- **Or click a suggestion card** for quick queries
- **Press Enter** to send (Shift+Enter for new line)
- **Wait for response** (you'll see a typing indicator)

### Features

- 💬 **Chat History** - Automatically saved in browser
- 🗑️ **Clear Chat** - Click trash icon to start fresh
- ⚙️ **Settings** - Configure API endpoint and parameters
- 📱 **Responsive** - Works on mobile, tablet, and desktop

---

## 🔧 Configuration

### API Endpoint

The frontend expects your backend at:
```
http://localhost:8000/api/query
```

Change this in:
1. **UI Settings** (recommended) - Click ⚙️ icon
2. **Or edit** `js/app.js` - Change `config.apiEndpoint`

### Request Format

Your backend should accept:
```json
POST /api/query
{
  "query": "User's question",
  "max_tokens": 500,
  "timestamp": 1234567890
}
```

### Response Format

Your backend should return ONE of these:
```json
{"response": "Answer here"}
// OR
{"answer": "Answer here"}
// OR
{"result": "Answer here"}
```

---

## 🐛 Troubleshooting

### "Cannot connect to API"

1. ✅ Check if backend is running: Visit `http://localhost:8000` in browser
2. ✅ Verify API endpoint in Settings
3. ✅ Check CORS is enabled on backend (see example_backend.py)
4. ✅ Open browser console (F12) for detailed errors

### CORS Error

Add to your FastAPI backend:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Chat Not Saving

- Clear browser cache
- Check if localStorage is enabled
- Try incognito/private mode

### Styling Issues

- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Clear browser cache
- Check if `css/style.css` loaded correctly (F12 → Network tab)

---

## 📁 File Structure

```
project_sem_3/
├── index.html              # Main app (open this!)
├── test.html               # API testing tool
├── README.md               # Full documentation
├── QUICKSTART.md          # This file
├── example_backend.py     # Example FastAPI backend
│
├── css/
│   └── style.css          # All styles
│
├── js/
│   ├── app.js             # Main application logic
│   └── config.js          # Configuration file
│
└── assests/
    ├── PolicyBot_logo.png
    └── PolicyBot_logo.ico
```

---

## 🎨 Customization

### Change Colors

Edit `css/style.css` variables:
```css
:root {
    --primary-accent: #1e3a5f;     /* Your brand color */
    --secondary-accent: #3b82f6;   /* Accent color */
}
```

### Change Logo

Replace files in `assests/`:
- `PolicyBot_logo.png` - Main logo
- `PolicyBot_logo.ico` - Browser tab icon

### Add Suggestions

Edit `index.html` - Find `<button class="suggestion-card">` and customize

---

## 🚀 Deployment

### For Production:

1. **Backend**: Deploy your FastAPI to a server (Heroku, AWS, etc.)
2. **Get the URL**: e.g., `https://your-api.com/api/query`
3. **Update Frontend**: Change API endpoint in settings
4. **Host Frontend**: Deploy to Netlify, Vercel, or GitHub Pages
5. **CORS**: Update `allow_origins` to your frontend URL

---

## 💡 Pro Tips

1. **Use test.html first** - Always test backend connectivity before main app
2. **Check browser console** - Press F12 to see detailed errors
3. **Save endpoint** - Settings are saved in browser, no need to re-enter
4. **Mobile friendly** - The interface works great on phones!
5. **Keyboard shortcuts** - Enter to send, Shift+Enter for new line

---

## ❓ Need Help?

1. **Check test.html** - Run connectivity tests
2. **Browser Console** - Press F12 for detailed errors
3. **Backend Logs** - Check your FastAPI terminal output
4. **README.md** - Full documentation with examples

---

## ✅ Checklist

Before starting, make sure:

- [ ] Backend is running (test at `http://localhost:8000`)
- [ ] CORS is configured on backend
- [ ] API endpoint is set in frontend settings
- [ ] test.html shows successful connection
- [ ] Browser allows localStorage

---

**🎉 You're all set! Open `index.html` and start chatting!**

For detailed documentation, see `README.md`
