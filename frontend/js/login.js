const API_BASE_URL = 'https://airline-backend-sn64.onrender.com';

// ========================================
// SKYLINK AIRLINES - LOGIN SCRIPT (FIXED)
// ========================================

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('❌ Please fill in all fields!');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Invalid email or password');
        }

        // ✅ Backend only returns token
        localStorage.setItem('access_token', data.access_token);

        alert('✅ Login successful!');
        window.location.href = 'dashboard.html';

    } catch (error) {
        alert('❌ ' + error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});
