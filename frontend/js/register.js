const API_BASE_URL = 'https://airline-backend-sn64.onrender.com';

// ========================================
// SKYLINK AIRLINES - REGISTRATION SCRIPT
// ========================================

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        email: document.getElementById('email').value.trim(),
        full_name: document.getElementById('fullName').value.trim(),
        password: document.getElementById('password').value,
        phone: document.getElementById('phone').value.trim() || null,
        role: document.getElementById('role').value
    };

    if (formData.password.length < 6) {
        alert('❌ Password must be at least 6 characters long!');
        return;
    }

    if (formData.full_name.length < 2) {
        alert('❌ Please enter a valid full name!');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';

    try {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            alert('✅ Registration successful! You can now login.');
            window.location.href = '/login';
        } else {
            alert('❌ Error: ' + (data.detail || 'Registration failed.'));
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    } catch (error) {
        alert('❌ Network error: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});
