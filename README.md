# EnglishNote - English Vocabulary Learning Application

EnglishNote is a web-based application for English learners to save, organize, and review vocabulary notes with the ability to scan handwritten notes using AI-powered OCR technology.

## Features

✨ **Core Features:**
- 📝 **Create & Manage Notes**: Organize vocabulary notes by week, month, or custom date ranges
- 🔐 **User Authentication**: Secure registration, login, and session management with JWT tokens
- 📅 **Time-Based Organization**: Auto-organize notes by week, month, and year
- 🏷️ **Tags & Search**: Tag your notes and search across all your vocabulary
- 📸 **OCR Scanner**: Upload images of handwritten notes and extract text using Tesseract.js
- 🎨 **Responsive UI**: Modern, mobile-friendly interface built with React
- 📊 **Dashboard Overview**: Quick stats and recent notes overview

## Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB (Mongoose ODM)
- JWT Authentication
- Tesseract.js (server-side OCR optional)
- Multer (file uploads)

**Frontend:**
- React 18
- React Router (navigation)
- Axios (API client)
- Tesseract.js (client-side OCR)
- Tailwind CSS (styling)

## Project Structure

```
EnglishNote/
├── server/
│   ├── config/
│   │   ├── database.js         # MongoDB connection
│   │   └── auth.js             # JWT configuration
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Note.js             # Note schema
│   ├── controllers/
│   │   ├── authController.js   # Auth logic
│   │   ├── noteController.js   # Note CRUD
│   │   └── ocrController.js    # OCR processing
│   ├── middleware/
│   │   └── auth.js             # JWT verification
│   ├── routes/
│   │   ├── authRoutes.js       # Auth endpoints
│   │   ├── noteRoutes.js       # Note endpoints
│   │   └── ocrRoutes.js        # OCR endpoints
│   ├── utils/
│   │   └── ocrProcessor.js     # OCR utilities
│   ├── uploads/                # Image storage
│   ├── .env                    # Environment variables
│   ├── server.js               # Entry point
│   └── package.json
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/           # Login/Register components
│   │   │   ├── NoteList/       # Note list component
│   │   │   ├── NoteEditor.js   # Create/edit notes
│   │   │   └── OCRUploader.js  # OCR scanner UI
│   │   ├── pages/
│   │   │   ├── Dashboard.js    # Home page
│   │   │   └── NotesPage.js    # Notes management
│   │   ├── hooks/
│   │   │   ├── useAuth.js      # Auth state management
│   │   │   └── useNotes.js     # Notes state management
│   │   ├── services/
│   │   │   ├── api.js          # API client
│   │   │   └── ocrService.js   # Tesseract.js wrapper
│   │   ├── utils/
│   │   │   └── dateUtils.js    # Date helpers
│   │   ├── App.js              # Main app component
│   │   ├── index.js            # React entry point
│   │   └── index.css           # Global styles
│   ├── .env                    # Environment variables
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas cloud)
- npm or yarn

### Option 1: Local Development (Separate Server & Client)

#### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/englishnote
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev    # Development mode with nodemon
# or
npm start      # Production mode
```

The server will run at `http://localhost:5000`

#### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The app will run at `http://localhost:3000`

### Option 2: Vercel Deployment (Serverless - Recommended for Production)

**Deploy the entire app on Vercel with no separate server needed!**

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete step-by-step guide to:
- Set up MongoDB Atlas (free tier)
- Connect GitHub repository to Vercel
- Configure environment variables
- Deploy and test on Vercel

**One-command deployment:**
```bash
vercel
```

Then open your Vercel URL (e.g., `https://englishnote-xxxxx.vercel.app`)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Notes
- `GET /api/notes` - Get notes (with optional filters)
- `GET /api/notes/search?query=...` - Search notes
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### OCR
- `POST /api/ocr/process` - Process image with OCR
- `POST /api/ocr/upload` - Upload image to note
- `GET /api/ocr/:noteId/:imageIndex` - Get OCR result for image

## Usage Guide

### Creating a Note
1. Click "Create New Note" on the dashboard
2. Enter title, select date, add content
3. Optionally add tags (comma-separated)
4. Click "Create Note"

### Using OCR Scanner
1. Open a note editor
2. Click "📸 Scan Handwritten Notes (OCR)"
3. Select or drag an image of handwritten text
4. Click "🔍 Extract Text"
5. Review the extracted text and confidence score
6. Click "✓ Use This Text" to add to note

### Filtering Notes
- **This Week**: View notes from current week (ISO week format)
- **This Month**: View notes from current month
- **All Notes**: View all notes you've created

### Searching
Use the search bar to find notes by title, content, or tags

## Authentication Flow

1. **Registration**: Create account with email, username, password
2. **Login**: Enter credentials to receive JWT tokens
3. **Protected Routes**: Include token in Authorization header
4. **Token Refresh**: Use refresh token to get new access token when expired
5. **Logout**: Clear tokens from storage (handled by frontend)

## Features in Development

- 🎯 Spaced repetition algorithm for vocabulary review
- 📊 Statistics and learning progress tracking
- 🗣️ Voice-to-text note creation
- 📱 Mobile app (React Native)
- 🌐 Multi-language support
- 👥 Study group collaboration
- 📤 Export notes to PDF/Word

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or MongoDB Atlas connection string is correct
- Check `MONGODB_URI` in `.env`
- For Vercel: whitelist all IPs in MongoDB Atlas → Network Access

### OCR Processing Slow
- First run downloads ~100MB language model (cached after)
- Subsequent runs are faster
- Ensure sufficient RAM available

### Token Expired Errors
- Application automatically refreshes tokens
- If issues persist, clear localStorage (`accessToken`, `refreshToken`)

### Port Already in Use
- Change `PORT` in `.env` (e.g., `5001`)
- Or kill existing process: `lsof -ti :5000 | xargs kill -9` (macOS/Linux)

### Vercel Deployment Issues
- See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed troubleshooting
- Check Vercel function logs: Dashboard → Deployments → Function Logs
- Verify environment variables are set correctly

## Performance Optimization

- Client-side OCR processing reduces server load
- MongoDB indexes on common queries (userId, date, week, month)
- JWT tokens keep auth stateless
- Image uploads stored on disk; consider cloud storage (S3) for production

## Security Considerations

- Passwords hashed with bcrypt (cost factor: 10)
- JWT tokens with expiration
- CORS enabled (configure in production)
- Input validation with express-validator
- File upload validation (image types only)

## Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy `build/` folder to Vercel
```

### Backend (Heroku)
1. Create `Procfile`: `web: node server.js`
2. Deploy: `git push heroku main`
3. Set environment variables in Heroku dashboard

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues and feature requests, please open an issue on GitHub.

---

**Happy Learning! 📚** 

Built with ❤️ for English learners worldwide.
#   E n g l i s h N o t e  
 