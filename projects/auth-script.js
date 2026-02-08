// Form switching
document.getElementById('showSignupForm')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById('signupForm').classList.add('active');
});

document.getElementById('showLoginForm')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById('loginForm').classList.add('active');
});

document.getElementById('forgotPasswordLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById('forgotPasswordForm').classList.add('active');
});

document.getElementById('backToLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById('loginForm').classList.add('active');
});

// Login form submission
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const submitBtn = e.target.querySelector('.btn-primary');

    try {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        await signIn(email, password);

        // Redirect to main app
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Login error:', error);
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

// Signup form submission
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const studentId = document.getElementById('signupStudentId').value;
    const department = document.getElementById('signupDepartment').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const submitBtn = e.target.querySelector('.btn-primary');

    // Validation
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    if (!document.getElementById('agreeTerms').checked) {
        showNotification('Please agree to the terms and conditions', 'error');
        return;
    }

    try {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Create user account
        const userCredential = await signUp(email, password, name);

        // Update user profile with additional info
        if (userCredential) {
            await firebase.firestore().collection('users').doc(userCredential.uid).update({
                studentId: studentId,
                department: department
            });
        }

        // Redirect to main app
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } catch (error) {
        console.error('Signup error:', error);
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

// Forgot password form submission
document.getElementById('forgotPasswordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('resetEmail').value;
    const submitBtn = e.target.querySelector('.btn-primary');

    try {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        await resetPassword(email);

        // Show success and switch to login
        setTimeout(() => {
            document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
            document.getElementById('loginForm').classList.add('active');
        }, 2000);
    } catch (error) {
        console.error('Password reset error:', error);
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

// Google Sign In
document.getElementById('googleSignInBtn')?.addEventListener('click', async () => {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await firebase.auth().signInWithPopup(provider);

        // Redirect to main app
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Google sign in error:', error);
        showNotification(error.message, 'error');
    }
});

// Check if user is already logged in
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, redirect to main app
        window.location.href = 'index.html';
    }
});
