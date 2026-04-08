const form = document.getElementById('addLinkForm');
const successMsg = document.getElementById('successMessage');

async function renderAdminList() {
    const adminList = document.getElementById('adminList');
    
    try {
        const res = await fetch('/api/links');
        const collections = await res.json();
        
        if (collections.length === 0) {
            adminList.innerHTML = '<p style="color: var(--text-secondary);">No collections yet.</p>';
            return;
        }
        
        collections.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        
        adminList.innerHTML = '';
        collections.forEach(item => {
        const escapeHTML = str => str.replace(/[&<>'"]/g, tag => ({'&': '&amp;','<': '&lt;','>': '&gt;',"'": '&#39;','"': '&quot;'}[tag] || tag));
        const row = document.createElement('div');
        row.className = 'admin-list-item';
        row.innerHTML = `
            <div class="admin-item-info">
            <img src="https://picsum.photos/seed/${item.id}/200/200" alt="Preview" class="admin-item-img">
            <span><strong>${escapeHTML(item.name)}</strong> <br><small>${new Date(item.dateAdded).toLocaleDateString()}</small></span>
            </div>
            <button onclick="deleteCollection('${item.id}')" class="delete-btn" title="Delete">
            <i class="fas fa-trash"></i>
            </button>
        `;
        adminList.appendChild(row);
        });
    } catch (e) {
        adminList.innerHTML = '<p>Error loading.</p>';
    }
}

window.deleteCollection = async function(id) {
    if(confirm('Are you sure you want to delete this collection?')) {
        await fetch(`/api/links/${id}`, { method: 'DELETE' });
        renderAdminList();
    }
};

// Initial Render
renderAdminList();

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('collectionName').value.trim();
    const url = document.getElementById('driveUrl').value.trim();

    if (name && url) {
        await fetch('/api/links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, url })
        });

        // Show success msg
        successMsg.style.display = 'block';
        form.reset();
        
        // Render updated list
        renderAdminList();

        // Hide success message after 3 seconds
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 3000);
    }
});
