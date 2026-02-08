// ===== Firebase Configuration =====
// TODO: Replace with your Firebase config from Firebase Console
// Get this from: Firebase Console → Project Settings → Your apps → Web app

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase (will be loaded from CDN in HTML)
let app, auth, db, storage;

// Initialize Firebase services
function initFirebase() {
    try {
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        storage = firebase.storage();
        console.log('Firebase initialized successfully');

        // Check authentication state
        auth.onAuthStateChanged(handleAuthStateChange);
    } catch (error) {
        console.error('Firebase initialization error:', error);
        showNotification('Firebase configuration needed. Please update firebaseConfig.', 'error');
    }
}

// ===== Authentication Functions =====
let currentUser = null;
let isAdmin = false;

function handleAuthStateChange(user) {
    currentUser = user;

    if (user) {
        // User is signed in
        console.log('User signed in:', user.email);
        loadUserProfile(user.uid);
        showPage('home');
    } else {
        // User is signed out
        console.log('User signed out');
        showPage('login');
    }
}

async function loadUserProfile(uid) {
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            isAdmin = userData.role === 'admin';
            updateUIForUser(userData);
        } else {
            // Create user profile if doesn't exist
            await createUserProfile(uid);
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

async function createUserProfile(uid) {
    const user = auth.currentUser;
    const userData = {
        uid: uid,
        email: user.email,
        displayName: user.displayName || 'User',
        role: 'student',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        registeredEvents: []
    };

    await db.collection('users').doc(uid).set(userData);
    updateUIForUser(userData);
}

function updateUIForUser(userData) {
    // Update user name in UI
    document.querySelectorAll('.user-name').forEach(el => {
        el.textContent = userData.displayName || userData.email.split('@')[0];
    });

    // Show/hide admin features
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = isAdmin ? 'block' : 'none';
    });
}

// Sign up function
async function signUp(email, password, displayName) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: displayName });

        // Create user profile in Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            uid: userCredential.user.uid,
            email: email,
            displayName: displayName,
            role: 'student',
            department: '',
            year: '',
            studentId: '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            registeredEvents: []
        });

        showNotification('Account created successfully!', 'success');
        return userCredential.user;
    } catch (error) {
        console.error('Sign up error:', error);
        showNotification(error.message, 'error');
        throw error;
    }
}

// Sign in function
async function signIn(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        showNotification('Welcome back!', 'success');
        return userCredential.user;
    } catch (error) {
        console.error('Sign in error:', error);
        showNotification(error.message, 'error');
        throw error;
    }
}

// Sign out function
async function signOut() {
    try {
        await auth.signOut();
        showNotification('Signed out successfully', 'success');
        showPage('login');
    } catch (error) {
        console.error('Sign out error:', error);
        showNotification(error.message, 'error');
    }
}

// Password reset
async function resetPassword(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        showNotification('Password reset email sent!', 'success');
    } catch (error) {
        console.error('Password reset error:', error);
        showNotification(error.message, 'error');
    }
}

// ===== Database Functions =====

// Load events from Firestore
async function loadEventsFromDB() {
    try {
        const eventsSnapshot = await db.collection('events')
            .orderBy('date', 'desc')
            .get();

        const events = [];
        eventsSnapshot.forEach(doc => {
            events.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return events;
    } catch (error) {
        console.error('Error loading events:', error);
        return [];
    }
}

// Create new event (Admin only)
async function createEvent(eventData) {
    if (!isAdmin) {
        showNotification('Only admins can create events', 'error');
        return;
    }

    try {
        const eventRef = await db.collection('events').add({
            ...eventData,
            createdBy: currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            participants: [],
            participantCount: 0,
            status: 'upcoming'
        });

        showNotification('Event created successfully!', 'success');
        return eventRef.id;
    } catch (error) {
        console.error('Error creating event:', error);
        showNotification(error.message, 'error');
        throw error;
    }
}

// Update event
async function updateEvent(eventId, updates) {
    if (!isAdmin) {
        showNotification('Only admins can update events', 'error');
        return;
    }

    try {
        await db.collection('events').doc(eventId).update({
            ...updates,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showNotification('Event updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating event:', error);
        showNotification(error.message, 'error');
    }
}

// Delete event
async function deleteEvent(eventId) {
    if (!isAdmin) {
        showNotification('Only admins can delete events', 'error');
        return;
    }

    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }

    try {
        await db.collection('events').doc(eventId).delete();
        showNotification('Event deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting event:', error);
        showNotification(error.message, 'error');
    }
}

// Register for event
async function registerForEvent(eventId, registrationData) {
    if (!currentUser) {
        showNotification('Please sign in to register', 'error');
        return;
    }

    try {
        // Check if already registered
        const existingReg = await db.collection('registrations')
            .where('eventId', '==', eventId)
            .where('userId', '==', currentUser.uid)
            .get();

        if (!existingReg.empty) {
            showNotification('You are already registered for this event', 'warning');
            return;
        }

        // Create registration
        const registrationRef = await db.collection('registrations').add({
            eventId: eventId,
            userId: currentUser.uid,
            userEmail: currentUser.email,
            ...registrationData,
            registeredAt: firebase.firestore.FieldValue.serverTimestamp(),
            checkedIn: false,
            status: 'confirmed'
        });

        // Update event participant count
        await db.collection('events').doc(eventId).update({
            participantCount: firebase.firestore.FieldValue.increment(1),
            participants: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
        });

        // Update user's registered events
        await db.collection('users').doc(currentUser.uid).update({
            registeredEvents: firebase.firestore.FieldValue.arrayUnion(eventId)
        });

        showNotification('Registration successful!', 'success');
        return registrationRef.id;
    } catch (error) {
        console.error('Error registering for event:', error);
        showNotification(error.message, 'error');
        throw error;
    }
}

// Load participants for an event
async function loadParticipants(eventId) {
    try {
        const registrationsSnapshot = await db.collection('registrations')
            .where('eventId', '==', eventId)
            .orderBy('registeredAt', 'desc')
            .get();

        const participants = [];
        registrationsSnapshot.forEach(doc => {
            participants.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return participants;
    } catch (error) {
        console.error('Error loading participants:', error);
        return [];
    }
}

// Check-in participant
async function checkInParticipant(registrationId, checkedIn) {
    if (!isAdmin) {
        showNotification('Only admins can check-in participants', 'error');
        return;
    }

    try {
        await db.collection('registrations').doc(registrationId).update({
            checkedIn: checkedIn,
            checkedInAt: checkedIn ? firebase.firestore.FieldValue.serverTimestamp() : null,
            checkedInBy: checkedIn ? currentUser.uid : null
        });

        showNotification(checkedIn ? 'Participant checked in' : 'Check-in cancelled', 'success');
    } catch (error) {
        console.error('Error checking in participant:', error);
        showNotification(error.message, 'error');
    }
}

// Upload event banner
async function uploadEventBanner(file, eventId) {
    try {
        const storageRef = storage.ref();
        const bannerRef = storageRef.child(`event-banners/${eventId}/${file.name}`);

        const snapshot = await bannerRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();

        return downloadURL;
    } catch (error) {
        console.error('Error uploading banner:', error);
        showNotification('Error uploading image', 'error');
        throw error;
    }
}

// ===== Real-time Listeners =====

// Listen to events in real-time
function listenToEvents(callback) {
    return db.collection('events')
        .orderBy('date', 'desc')
        .onSnapshot(snapshot => {
            const events = [];
            snapshot.forEach(doc => {
                events.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(events);
        }, error => {
            console.error('Error listening to events:', error);
        });
}

// Listen to participants in real-time
function listenToParticipants(eventId, callback) {
    return db.collection('registrations')
        .where('eventId', '==', eventId)
        .orderBy('registeredAt', 'desc')
        .onSnapshot(snapshot => {
            const participants = [];
            snapshot.forEach(doc => {
                participants.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(participants);
        }, error => {
            console.error('Error listening to participants:', error);
        });
}

// ===== Utility Functions =====

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Export CSV
async function exportParticipantsCSV(eventId) {
    try {
        const participants = await loadParticipants(eventId);

        const csv = [
            ['Name', 'Email', 'Student ID', 'Department', 'Registration Time', 'Check-in Status'],
            ...participants.map(p => [
                p.fullName || 'N/A',
                p.userEmail,
                p.studentId || 'N/A',
                p.department || 'N/A',
                p.registeredAt?.toDate().toLocaleString() || 'N/A',
                p.checkedIn ? 'Checked In' : 'Pending'
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `participants-${eventId}-${Date.now()}.csv`;
        a.click();

        showNotification('CSV exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting CSV:', error);
        showNotification('Error exporting CSV', 'error');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if Firebase is loaded
    if (typeof firebase !== 'undefined') {
        initFirebase();
    } else {
        console.error('Firebase SDK not loaded. Please include Firebase scripts in HTML.');
        showNotification('Firebase SDK not loaded. Please check your internet connection.', 'error');
    }
});

// Make functions globally available
window.signUp = signUp;
window.signIn = signIn;
window.signOut = signOut;
window.resetPassword = resetPassword;
window.createEvent = createEvent;
window.updateEvent = updateEvent;
window.deleteEvent = deleteEvent;
window.registerForEvent = registerForEvent;
window.checkInParticipant = checkInParticipant;
window.uploadEventBanner = uploadEventBanner;
window.exportParticipantsCSV = exportParticipantsCSV;
