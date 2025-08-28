MicroTrack - Microtask Tracking App 🎯
A modern web-based microtask tracking app with social gamification features. Track small daily tasks, compete with friends, and build productive habits!

Show Image

✨ Features
🎯 Task Management
Microtask Tracking: Add, edit, and complete small daily tasks
Categories: Organize tasks by Work, Health, Learning, Personal, Social
Priority Levels: Set task priorities (Low, Medium, High)
Time Estimation: Track estimated time for each task
Progress Tracking: Visual progress bars and completion statistics
🎮 Gamification
Points System: Earn points for completing tasks
Level Progression: Advance through levels based on total points
Streak Tracking: Maintain daily completion streaks
Achievement Badges: Unlock badges for various milestones
Leaderboards: Compete with friends and see rankings
👥 Social Features
Friend System: Add friends by email address
Leaderboards: Compare progress with your network
Social Sharing: Share achievements and progress
Competitive Element: Friendly competition to stay motivated
📊 Analytics
Progress Dashboard: Overview of daily/weekly progress
Statistics: Detailed stats on completion rates and trends
Task History: View all completed and pending tasks
Performance Insights: Track your productivity patterns
🛠 Tech Stack
Frontend: React 18, Tailwind CSS, Lucide React Icons
Backend: Firebase (Authentication + Firestore)
Routing: React Router DOM
State Management: React Context API
Build Tool: Create React App
Deployment: GitHub Pages with GitHub Actions
🚀 Quick Start
Prerequisites
Node.js 16+ and npm
Firebase project (for backend services)
Installation
Clone the repository
bash
git clone https://github.com/yourusername/microtask-tracker.git
cd microtask-tracker
Install dependencies
bash
npm install
Firebase Setup
Create a new Firebase project at Firebase Console
Enable Authentication (Google provider)
Enable Firestore Database
Copy your Firebase config
Configure Firebase
Update src/services/firebase.js with your Firebase config:
javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
Set up Firestore Security Rules
javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /friends/{friendId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || request.auth.uid == resource.data.friendId);
    }
  }
}
Start development server
bash
npm start
📦 Deployment
GitHub Pages Deployment
Update package.json homepage
json
"homepage": "https://yourusername.github.io/microtask-tracker"
Push to GitHub
bash
git add .
git commit -m "Initial commit"
git push origin main
Enable GitHub Pages
Go to repository Settings → Pages
Select "GitHub Actions" as source
The workflow will automatically deploy on push to main
Alternative: Vercel Deployment
Install Vercel CLI
bash
npm i -g vercel
Deploy
bash
vercel --prod
🏗 Project Structure
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Navigation bar
│   ├── TaskCard.js     # Individual task display
│   └── AddTaskModal.js # Task creation modal
├── pages/              # Main application pages
│   ├── Login.js        # Authentication page
│   ├── Dashboard.js    # Main dashboard
│   ├── Tasks.js        # All tasks view
│   ├── Leaderboard.js  # Friends leaderboard
│   └── Profile.js      # User profile & stats
├── context/            # React Context providers
│   └── AuthContext.js  # Authentication state
├── services/           # External service integrations
│   └── firebase.js     # Firebase configuration & helpers
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles & Tailwind
🔧 Configuration
Environment Variables
Create a .env.local file for local development:

REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
Customization
Colors: Modify tailwind.config.js for custom color schemes
Categories: Update categories in AddTaskModal.js
Point System: Adjust point values in Firebase service functions
Achievements: Customize achievements in Profile.js
📱 Features in Detail
Dashboard
Daily task overview with progress bar
Quick task completion
Stats cards showing points, streak, level
Recent activity feed
Task Management
Create tasks with categories, priorities, and time estimates
Filter tasks by status, category, priority
Mark tasks complete with point rewards
Task history and analytics
Social & Gamification
Add friends via email
Real-time leaderboard updates
Achievement system with progress tracking
Streak maintenance for habit building
Profile & Stats
Personal statistics dashboard
Achievement badges with progress
Level progression system
Recent activity timeline
🤝 Contributing
Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Icons by Lucide
UI components inspired by modern design systems
Built with Create React App
Deployed with GitHub Actions
🐛 Known Issues & Roadmap
Known Issues
Leaderboard updates may take a few seconds to reflect changes
Mobile responsiveness could be improved for very small screens
Future Features
 Push notifications for task reminders
 Team/group challenges
 Data export functionality
 Dark mode theme
 Mobile app (React Native)
 Advanced analytics and insights
 Custom achievement creation
Made with ❤️ for productivity enthusiasts

For questions or support, please open an issue on GitHub.

