const API_BASE_URL = 'https://airline-backend-sn64.onrender.com';

// ========================================
// SKYLINK AIRLINES - REGISTRATION SCRIPT (FIXED)
// ========================================

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const full_name = document.getElementById('full_name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!full_name || full_name.length < 2) {
        alert('❌ Please enter a valid full name!');
        return;
    }

    if (!email) {
        alert('❌ Please enter an email!');
        return;
    }

    if (!password || password.length < 6) {
        alert('❌ Password must be at least 6 characters long!');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';

    try {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                full_name: full_name,
                email: email,
                password: password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Registration failed');
        }

        alert('✅ Registration successful! Please login.');
        window.location.href = 'login.html';

    } catch (error) {
        alert('❌ ' + error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});
