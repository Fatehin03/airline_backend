const API_BASE_URL = 'https://airline-backend-sn64.onrender.com';

// ========================================
// SKYLINK AIRLINES - DASHBOARD SCRIPT
// ========================================

const token = localStorage.getItem('access_token');
if (!token) {
    alert('⚠️ Please login first!');
    window.location.href = '/login';
}

async function loadProfile() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const user = await response.json();
            document.getElementById('userName').textContent = user.full_name;

            const createdDate = user.created_at
                ? new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
                : 'N/A';

            const lastLoginDate = user.last_login
                ? new Date(user.last_login).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
                : 'First time login';

            document.getElementById('userInfo').innerHTML = `
                <div style="padding: 1rem 0;">
                    ${user.profile_photo ? `
                        <div style="text-align: center; margin-bottom: 1.5rem;">
                            <img src="${user.profile_photo}" style="width:100px;height:100px;border-radius:50%;">
                        </div>` : ''}
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Role:</strong> ${user.role}</p>
                    <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
                    <p><strong>Verified:</strong> ${user.is_verified ? 'Yes' : 'No'}</p>
                    <p><strong>Member Since:</strong> ${createdDate}</p>
                    <p><strong>Last Login:</strong> ${lastLoginDate}</p>
                </div>
            `;
        } else if (response.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        } else {
            document.getElementById('userInfo').innerHTML = 'Error loading profile';
        }
    } catch (err) {
        console.error(err);
    }
}

async function loadActivityLogs() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/activity-logs`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const logs = await response.json();
            document.getElementById('activityLogs').innerHTML =
                logs.length === 0
                    ? '<p>No recent activity</p>'
                    : logs.map(log => `
                        <div>
                            <strong>${log.action}</strong>
                            <p>${log.details || ''}</p>
                        </div>
                    `).join('');
        }
    } catch (err) {
        console.error(err);
    }
}

document.getElementById('logoutBtn').addEventListener('click', async (e) => {
    e.preventDefault();

    try {
        await fetch(`${API_BASE_URL}/api/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch {}

    localStorage.clear();
    window.location.href = '/';
});

loadProfile();
loadActivityLogs();
