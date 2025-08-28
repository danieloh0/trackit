import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp,
  onSnapshot 
} from 'firebase/firestore';

// Firebase configuration (replace with your config)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Authentication
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signOutUser = () => signOut(auth);

// Firestore helpers
export const createUser = async (uid, userData) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const getUserData = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

export const createTask = async (uid, taskData) => {
  const tasksRef = collection(db, 'tasks');
  return await addDoc(tasksRef, {
    ...taskData,
    userId: uid,
    completed: false,
    createdAt: serverTimestamp()
  });
};

export const getTasks = async (uid, date = null) => {
  const tasksRef = collection(db, 'tasks');
  let q = query(tasksRef, where('userId', '==', uid), orderBy('createdAt', 'desc'));
  
  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    q = query(q, where('createdAt', '>=', startOfDay), where('createdAt', '<=', endOfDay));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateTask = async (taskId, updates) => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const deleteTask = async (taskId) => {
  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);
};

export const completeTask = async (taskId, points = 10) => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    completed: true,
    completedAt: serverTimestamp(),
    points: points
  });
};

export const getUserStats = async (uid) => {
  const tasksRef = collection(db, 'tasks');
  const q = query(tasksRef, where('userId', '==', uid));
  const snapshot = await getDocs(q);
  
  let totalTasks = 0;
  let completedTasks = 0;
  let totalPoints = 0;
  let streak = 0;
  
  snapshot.docs.forEach(doc => {
    const task = doc.data();
    totalTasks++;
    if (task.completed) {
      completedTasks++;
      totalPoints += task.points || 10;
    }
  });
  
  return {
    totalTasks,
    completedTasks,
    totalPoints,
    streak,
    level: Math.floor(totalPoints / 100) + 1
  };
};

export const getLeaderboard = async (friendIds) => {
  if (!friendIds.length) return [];
  
  const usersRef = collection(db, 'users');
  const leaderboard = [];
  
  for (const friendId of friendIds) {
    const userData = await getUserData(friendId);
    const stats = await getUserStats(friendId);
    
    if (userData) {
      leaderboard.push({
        id: friendId,
        name: userData.displayName,
        avatar: userData.photoURL,
        ...stats
      });
    }
  }
  
  return leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
};

export const addFriend = async (currentUserId, friendEmail) => {
  // Find user by email
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', friendEmail));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    throw new Error('User not found');
  }
  
  const friendData = snapshot.docs[0];
  const friendId = friendData.id;
  
  // Add to friends collection
  const friendsRef = collection(db, 'friends');
  await addDoc(friendsRef, {
    userId: currentUserId,
    friendId: friendId,
    createdAt: serverTimestamp()
  });
  
  // Also add reverse friendship
  await addDoc(friendsRef, {
    userId: friendId,
    friendId: currentUserId,
    createdAt: serverTimestamp()
  });
  
  return friendData.data();
};

export const getFriends = async (uid) => {
  const friendsRef = collection(db, 'friends');
  const q = query(friendsRef, where('userId', '==', uid));
  const snapshot = await getDocs(q);
  
  const friendIds = snapshot.docs.map(doc => doc.data().friendId);
  const friends = [];
  
  for (const friendId of friendIds) {
    const userData = await getUserData(friendId);
    if (userData) {
      friends.push({ id: friendId, ...userData });
    }
  }
  
  return friends;
};