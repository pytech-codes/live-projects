// Dashboard JavaScript functionality
let currentFilter = 'all';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Create event form submission
    const createEventForm = document.getElementById('createEventForm');
    if (createEventForm) {
        createEventForm.addEventListener('submit', handleCreateEvent);
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Load dashboard data
function loadDashboardData() {
    updateStats();
    renderEvents();
}

// Update statistics
function updateStats() {
    const events = getAllEvents();
    const participants = getAllParticipants();
    
    const now = new Date();
    const upcomingEvents = events.filter(event => new Date(event.eventDate) > now);
    const pastEvents = events.filter(event => new Date(event.eventDate) <= now);
    
    document.getElementById('totalEvents').textContent = events.length;
    document.getElementById('totalParticipants').textContent = participants.length;
    document.getElementById('upcomingEvents').textContent = upcomingEvents.length;
    document.getElementById('pastEvents').textContent = pastEvents.length;
}

// Render events
function renderEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    const events = getAllEvents();
    
    let filteredEvents = events;
    
    if (currentFilter === 'upcoming') {
        filteredEvents = events.filter(event => new Date(event.eventDate) > new Date());
    } else if (currentFilter === 'past') {
        filteredEvents = events.filter(event => new Date(event.eventDate) <= new Date());
    }
    
    if (filteredEvents.length === 0) {
        eventsGrid.innerHTML = `
            <div class="empty-state">
                <h3>No events found</h3>
                <p>${currentFilter === 'all' ? 'Create your first event to get started!' : `No ${currentFilter} events found.`}</p>
                <button class="create-event-btn" onclick="showCreateEventModal()">+ Create New Event</button>
            </div>
        `;
        return;
    }
    
    eventsGrid.innerHTML = filteredEvents.map(event => {
        const participants = getParticipantsByEvent(event.id);
        const eventDate = new Date(event.eventDate);
        const isPast = eventDate <= new Date();
        
        return `
            <div class="event-card" onclick="showEventDetails('${event.id}')">
                <h4>${event.eventName}</h4>
                <div class="event-date">📅 ${formatDate(eventDate)}</div>
                <div class="event-location">📍 ${event.eventLocation}</div>
                <div class="event-participants">👥 ${participants.length} ${event.maxParticipants ? `/ ${event.maxParticipants}` : ''} participants</div>
                <div class="event-category">${event.eventCategory || 'General'}</div>
                <div class="event-actions">
                    <button class="view-btn" onclick="event.stopPropagation(); showEventDetails('${event.id}')">View</button>
                    <button class="edit-btn" onclick="event.stopPropagation(); editEvent('${event.id}')">Edit</button>
                    <button class="delete-btn" onclick="event.stopPropagation(); deleteEvent('${event.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Filter events
function filterEvents(filter) {
    currentFilter = filter;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderEvents();
}

// Show create event modal
function showCreateEventModal() {
    document.getElementById('createEventModal').style.display = 'block';
    // Reset form
    document.getElementById('createEventForm').reset();
}

// Close create event modal
function closeCreateEventModal() {
    document.getElementById('createEventModal').style.display = 'none';
}

// Handle create event form submission
function handleCreateEvent(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const eventData = {
        eventName: formData.get('eventName'),
        eventDescription: formData.get('eventDescription'),
        eventDate: formData.get('eventDate'),
        eventLocation: formData.get('eventLocation'),
        maxParticipants: formData.get('maxParticipants') ? parseInt(formData.get('maxParticipants')) : null,
        eventCategory: formData.get('eventCategory')
    };
    
    // Validate required fields
    if (!eventData.eventName || !eventData.eventDate || !eventData.eventLocation) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Create event
    const newEvent = createEvent(eventData);
    
    if (newEvent) {
        showMessage('Event created successfully!', 'success');
        closeCreateEventModal();
        loadDashboardData();
    } else {
        showMessage('Failed to create event', 'error');
    }
}

// Show event details
function showEventDetails(eventId) {
    const event = getEvent(eventId);
    if (!event) {
        showMessage('Event not found', 'error');
        return;
    }
    
    const participants = getParticipantsByEvent(eventId);
    const eventDate = new Date(event.eventDate);
    
    const detailsContent = `
        <h2>${event.eventName}</h2>
        <div class="event-details">
            <p><strong>Description:</strong> ${event.eventDescription || 'No description provided'}</p>
            <p><strong>Date:</strong> ${formatDate(eventDate)}</p>
            <p><strong>Location:</strong> ${event.eventLocation}</p>
            <p><strong>Category:</strong> ${event.eventCategory || 'General'}</p>
            <p><strong>Max Participants:</strong> ${event.maxParticipants || 'Unlimited'}</p>
            <p><strong>Registered Participants:</strong> ${participants.length}</p>
            <p><strong>Created:</strong> ${formatDate(new Date(event.createdAt))}</p>
        </div>
        
        <div class="participant-section">
            <h3>Participants (${participants.length})</h3>
            ${participants.length > 0 ? `
                <div class="participants-list">
                    ${participants.map(participant => `
                        <div class="participant-item">
                            <strong>${participant.name}</strong> - ${participant.email}
                            <span class="participant-status">${participant.status || 'Registered'}</span>
                        </div>
                    `).join('')}
                </div>
            ` : '<p>No participants registered yet</p>'}
        </div>
        
        <div class="event-details-actions">
            <button class="register-btn" onclick="showRegistrationForm('${eventId}')">Register Participant</button>
            <button class="edit-btn" onclick="editEvent('${eventId}')">Edit Event</button>
            <button class="delete-btn" onclick="deleteEvent('${eventId}')">Delete Event</button>
        </div>
    `;
    
    document.getElementById('eventDetailsContent').innerHTML = detailsContent;
    document.getElementById('eventDetailsModal').style.display = 'block';
}

// Close event details modal
function closeEventDetailsModal() {
    document.getElementById('eventDetailsModal').style.display = 'none';
}

// Edit event
function editEvent(eventId) {
    const event = getEvent(eventId);
    if (!event) {
        showMessage('Event not found', 'error');
        return;
    }
    
    // Populate form with existing data
    document.getElementById('eventName').value = event.eventName;
    document.getElementById('eventDescription').value = event.eventDescription || '';
    document.getElementById('eventDate').value = event.eventDate;
    document.getElementById('eventLocation').value = event.eventLocation;
    document.getElementById('maxParticipants').value = event.maxParticipants || '';
    document.getElementById('eventCategory').value = event.eventCategory || 'conference';
    
    // Change form submission handler to update instead of create
    const form = document.getElementById('createEventForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        handleUpdateEvent(eventId);
    };
    
    // Change modal title
    document.querySelector('#createEventModal h2').textContent = 'Edit Event';
    
    showCreateEventModal();
}

// Handle update event
function handleUpdateEvent(eventId) {
    const formData = new FormData(document.getElementById('createEventForm'));
    const updates = {
        eventName: formData.get('eventName'),
        eventDescription: formData.get('eventDescription'),
        eventDate: formData.get('eventDate'),
        eventLocation: formData.get('eventLocation'),
        maxParticipants: formData.get('maxParticipants') ? parseInt(formData.get('maxParticipants')) : null,
        eventCategory: formData.get('eventCategory')
    };
    
    const updatedEvent = updateEvent(eventId, updates);
    
    if (updatedEvent) {
        showMessage('Event updated successfully!', 'success');
        closeCreateEventModal();
        closeEventDetailsModal();
        loadDashboardData();
        
        // Reset form handler back to create
        document.getElementById('createEventForm').onsubmit = handleCreateEvent;
        document.querySelector('#createEventModal h2').textContent = 'Create New Event';
    } else {
        showMessage('Failed to update event', 'error');
    }
}

// Delete event
function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
        return;
    }
    
    const success = deleteEvent(eventId);
    
    if (success) {
        showMessage('Event deleted successfully!', 'success');
        closeEventDetailsModal();
        loadDashboardData();
    } else {
        showMessage('Failed to delete event', 'error');
    }
}

// Show registration form
function showRegistrationForm(eventId) {
    const event = getEvent(eventId);
    if (!event) {
        showMessage('Event not found', 'error');
        return;
    }
    
    const participants = getParticipantsByEvent(eventId);
    const isAtCapacity = event.maxParticipants && participants.length >= event.maxParticipants;
    
    if (isAtCapacity) {
        showMessage('Event is at full capacity', 'error');
        return;
    }
    
    const registrationForm = `
        <h3>Register Participant</h3>
        <form id="registrationForm">
            <div class="form-group">
                <label for="participantName">Name *</label>
                <input type="text" id="participantName" name="name" required>
            </div>
            <div class="form-group">
                <label for="participantEmail">Email *</label>
                <input type="email" id="participantEmail" name="email" required>
            </div>
            <div class="form-group">
                <label for="participantPhone">Phone</label>
                <input type="tel" id="participantPhone" name="phone">
            </div>
            <div class="form-actions">
                <button type="button" onclick="closeEventDetailsModal()">Cancel</button>
                <button type="submit">Register</button>
            </div>
        </form>
    `;
    
    document.getElementById('eventDetailsContent').innerHTML = registrationForm;
    
    // Setup registration form handler
    document.getElementById('registrationForm').onsubmit = function(e) {
        e.preventDefault();
        handleRegistration(eventId);
    };
}

// Handle participant registration
function handleRegistration(eventId) {
    const formData = new FormData(document.getElementById('registrationForm'));
    const participantData = {
        eventId: eventId,
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        status: 'Registered'
    };
    
    // Validate required fields
    if (!participantData.name || !participantData.email) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Check if email already registered for this event
    const existingParticipants = getParticipantsByEvent(eventId);
    const emailExists = existingParticipants.some(p => p.email === participantData.email);
    
    if (emailExists) {
        showMessage('This email is already registered for this event', 'error');
        return;
    }
    
    // Register participant
    const newParticipant = registerParticipant(participantData);
    
    if (newParticipant) {
        showMessage('Participant registered successfully!', 'success');
        showEventDetails(eventId); // Refresh event details
        loadDashboardData(); // Update stats
    } else {
        showMessage('Failed to register participant', 'error');
    }
}

// Utility function to format date
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
