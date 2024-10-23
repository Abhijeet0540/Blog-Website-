// Pre-set credentials for validation
const validEmail = 'blog@gmail.com';
const validPassword = '123456';

// Handle form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting

    document.getElementById('email-error').textContent = '';
    document.getElementById('password-error').textContent = '';
    const emailInput = document.getElementById('email').value.trim();
    const passwordInput = document.getElementById('password').value.trim();
    let valid = true;

    // Validate email address and password
    if (emailInput !== validEmail) {
        document.getElementById('email').style.borderColor = 'red';
        document.getElementById('email').style.boxShadow = '0 0 5px 2px rgba(255, 0, 0, 0.25)';
        document.getElementById('email-error').textContent = 'Invalid email address!';
        valid = false;
    }

    if (passwordInput !== validPassword) {
        document.getElementById('password').style.borderColor = 'red';
        document.getElementById('password').style.boxShadow = '0 0 5px 2px rgba(255, 0, 0, 0.25)';
        document.getElementById('password-error').textContent = 'Incorrect password!';
        valid = false;
    }
    if (valid) {
        window.location.href = 'admin_table.html';
    }
});

// Clear error message when user starts typing in the email input field
document.getElementById('email').addEventListener('input', function() {
    document.getElementById('email').style.borderColor = '';
    document.getElementById('email').style.boxShadow = '';
    document.getElementById('email-error').textContent = '';
});

// Clear error message when user starts typing in the password input field
document.getElementById('password').addEventListener('input', function() {
    document.getElementById('password').style.borderColor = '';
    document.getElementById('password').style.boxShadow = '';
    document.getElementById('password-error').textContent = '';
});
