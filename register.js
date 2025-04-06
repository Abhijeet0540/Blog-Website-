// Initialize users array from localStorage or create empty array if none exists
let users = JSON.parse(localStorage.getItem('users')) || [];

// Handle form submission
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting

    // Clear previous error messages
    clearAllErrors();

    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    // Validate form
    let isValid = true;
    
    // Validate full name
    if (fullName === '') {
        showError('fullName', 'Full name is required');
        isValid = false;
    } else if (fullName.length < 3) {
        showError('fullName', 'Full name must be at least 3 characters');
        isValid = false;
    }
    
    // Validate email
    if (email === '') {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    } else if (isEmailRegistered(email)) {
        showError('email', 'This email is already registered');
        isValid = false;
    }
    
    // Validate password
    if (password === '') {
        showError('password', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    // Validate confirm password
    if (confirmPassword === '') {
        showError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (confirmPassword !== password) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    // If form is valid, register the user
    if (isValid) {
        registerUser(fullName, email, password);
        
        // Show success message and redirect to login page
        alert('Registration successful! You can now login.');
        window.location.href = 'Login.html';
    }
});

// Function to register a new user
function registerUser(fullName, email, password) {
    // Create user object
    const newUser = {
        id: generateUserId(),
        fullName: fullName,
        email: email,
        password: password,
        dateRegistered: new Date().toISOString(),
        role: 'user' // Default role for new users
    };
    
    // Add user to users array
    users.push(newUser);
    
    // Save updated users array to localStorage
    localStorage.setItem('users', JSON.stringify(users));
}

// Function to generate a unique user ID
function generateUserId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Function to check if email is already registered
function isEmailRegistered(email) {
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to show error message
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    field.style.borderColor = 'red';
    field.style.boxShadow = '0 0 5px 2px rgba(255, 0, 0, 0.25)';
    errorElement.textContent = message;
}

// Function to clear all error messages
function clearAllErrors() {
    const fields = ['fullName', 'email', 'password', 'confirmPassword'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        field.style.borderColor = '';
        field.style.boxShadow = '';
        errorElement.textContent = '';
    });
}

// Clear error message when user starts typing in any input field
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        this.style.borderColor = '';
        this.style.boxShadow = '';
        document.getElementById(`${this.id}-error`).textContent = '';
    });
});
