// Render gallery from APIs
document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('galleryGrid');
    
    try {
        const res = await fetch('/api/links');
        const collections = await res.json();
    
        if (collections.length === 0) {
            grid.innerHTML = '';
            return;
        }

        // Sort collections: newest first
        collections.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

        collections.forEach((item, index) => {
            const dateOpt = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            const formattedDate = new Date(item.dateAdded).toLocaleDateString('en-US', dateOpt);
            
            const isLatest = index === 0;
            const badgeHTML = isLatest ? '<span class="badge">LATEST</span>' : '';

            const card = document.createElement('div');
            card.className = `card ${isLatest ? 'card-featured' : ''}`;
            
            // Remove padding-less card-image and use standard padded box again
            card.style.padding = '1.5rem';
            
            card.innerHTML = `
                ${badgeHTML}
                <div class="card-content" style="padding: 0;">
                <h2 class="card-title">${escapeHTML(item.name)}</h2>
                <div class="card-date">
                    <i class="far fa-clock"></i> ${formattedDate}
                </div>
                <a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer" class="card-btn">
                    <i class="fab fa-google-drive"></i> View Photos
                </a>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (e) {
        grid.innerHTML = '<p>Error loading collections.</p>';
    }
});

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
    tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag)
    );
}
