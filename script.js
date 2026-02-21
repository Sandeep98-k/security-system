const form = document.getElementById('incidentForm');
const list = document.getElementById('incidentList');

// 1. Load Incidents on Page Load
document.addEventListener('DOMContentLoaded', loadIncidents);

function loadIncidents() {
    fetch('/api/incidents')
        .then(response => response.json())
        .then(data => {
            list.innerHTML = '';
            if (data.data.length === 0) {
                list.innerHTML = '<p>No incidents reported.</p>';
                return;
            }
            
            data.data.forEach(incident => {
                const div = document.createElement('div');
                // Color code based on type
                let severityClass = 'low';
                if(incident.type === 'Theft' || incident.type === 'Fire Hazard') severityClass = 'high';
                else if(incident.type === 'Suspicious Activity') severityClass = 'medium';

                div.className = `incident-item ${severityClass}`;
                div.innerHTML = `
                    <div class="incident-header">
                        <strong>${incident.type}</strong> 
                        <span>${incident.timestamp}</span>
                    </div>
                    <p><strong>Guard:</strong> ${incident.guard_name} | <strong>Loc:</strong> ${incident.location}</p>
                    <p>${incident.description}</p>
                    <p>Status: <span class="${incident.status === 'Resolved' ? 'status-resolved' : 'status-pending'}">${incident.status}</span></p>
                `;
                list.appendChild(div);
            });
        });
}

// 2. Handle Form Submit
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newIncident = {
        guard_name: document.getElementById('guard_name').value,
        location: document.getElementById('location').value,
        type: document.getElementById('type').value,
        description: document.getElementById('description').value
    };

    fetch('/api/incidents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newIncident)
    })
    .then(response => response.json())
    .then(data => {
        alert('Incident Reported!');
        form.reset();
        loadIncidents(); // Refresh list
    })
    .catch(err => console.error(err));
});