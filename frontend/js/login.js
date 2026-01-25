const API_BASE_URL = 'https://airline-backend-sn64.onrender.com';

// ========================================
// SKYLINK AIRLINES - LOGIN SCRIPT
// ========================================

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
    };

    if (!formData.email || !formData.password) {
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            alert('✅ Login successful! Welcome back, ' + data.user.full_name + '!');
            window.location.href = '/dashboard';
        } else {
            alert('❌ Error: ' + (data.detail || 'Invalid email or password'));
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    } catch (error) {
        alert('❌ Network error: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});
