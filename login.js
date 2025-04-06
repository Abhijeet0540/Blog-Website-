// Get users from localStorage or use default admin if no users exist
let users = JSON.parse(localStorage.getItem('users')) || [];

// Add default admin user if no users exist
if (users.length === 0) {
    const defaultAdmin = {
        id: 'admin1',
        fullName: 'Admin User',
        email: 'blog@gmail.com',
        password: '123456',
        dateRegistered: new Date().toISOString(),
        role: 'admin'
    };
    users.push(defaultAdmin);
    localStorage.setItem('users', JSON.stringify(users));
}

// Handle form submission
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from submitting

    document.getElementById('email-error').textContent = '';
    document.getElementById('password-error').textContent = '';
    const emailInput = document.getElementById('email').value.trim();
    const passwordInput = document.getElementById('password').value.trim();
    let valid = false;

    // Find user with matching email and password
    const user = users.find(user => user.email === emailInput && user.password === passwordInput);

    if (!user) {
        // Show generic error message for security reasons
        document.getElementById('email').style.borderColor = 'red';
        document.getElementById('email').style.boxShadow = '0 0 5px 2px rgba(255, 0, 0, 0.25)';
        document.getElementById('password').style.borderColor = 'red';
        document.getElementById('password').style.boxShadow = '0 0 5px 2px rgba(255, 0, 0, 0.25)';
        document.getElementById('email-error').textContent = 'Invalid email or password';
    } else {
        // Login successful
        valid = true;

        // Store current user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    if (valid) {
        window.location.href = 'admin_table.html';
    }
});

// Clear error message when user starts typing in the email input field
document.getElementById('email').addEventListener('input', function () {
    document.getElementById('email').style.borderColor = '';
    document.getElementById('email').style.boxShadow = '';
    document.getElementById('email-error').textContent = '';
});

// Clear error message when user starts typing in the password input field
document.getElementById('password').addEventListener('input', function () {
    document.getElementById('password').style.borderColor = '';
    document.getElementById('password').style.boxShadow = '';
    document.getElementById('password-error').textContent = '';
});
