// Event Management System JavaScript
let events = [];
let participants = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadEventsFromStorage();
    loadParticipantsFromStorage();
    
    // Add event listeners for navigation
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Add event listeners for buttons
    const getStartedBtn = document.querySelector('.btn1');
    const howToBtn = document.querySelector('.btn2');
    const signupBtn = document.querySelector('.signup');
    
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => navigateToPage('dashboard.html'));
    }
    
    if (howToBtn) {
        howToBtn.addEventListener('click', () => alert('How to use: 1. Create events 2. Register participants 3. Track attendance 4. Generate reports'));
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', handleSignup);
    }
});

// Handle navigation between pages
function handleNavigation(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    
    if (href === '#') {
        return;
    }
    
    navigateToPage(href);
}

function navigateToPage(page) {
    window.location.href = page;
}

// Handle signup
function handleSignup() {
    const emailInput = document.querySelector('.body3 input');
    const email = emailInput.value.trim();
    
    if (!email) {
        showMessage('Please enter your email address', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Store email (in real app, this would be sent to backend)
    localStorage.setItem('userEmail', email);
    showMessage('Sign up successful! Redirecting to dashboard...', 'success');
    
    setTimeout(() => {
        navigateToPage('dashboard.html');
    }, 2000);
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show message to user
function showMessage(message, type) {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        ${type === 'error' ? 'background-color: #e74c3c;' : 'background-color: #27ae60;'}
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Storage functions
function loadEventsFromStorage() {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
        events = JSON.parse(storedEvents);
    }
}

function loadParticipantsFromStorage() {
    const storedParticipants = localStorage.getItem('participants');
    if (storedParticipants) {
        participants = JSON.parse(storedParticipants);
    }
}

function saveEventsToStorage() {
    localStorage.setItem('events', JSON.stringify(events));
}

function saveParticipantsToStorage() {
    localStorage.setItem('participants', JSON.stringify(participants));
}

// Event management functions
function createEvent(eventData) {
    const event = {
        id: Date.now().toString(),
        ...eventData,
        createdAt: new Date().toISOString()
    };
    
    events.push(event);
    saveEventsToStorage();
    return event;
}

function updateEvent(eventId, updates) {
    const index = events.findIndex(event => event.id === eventId);
    if (index !== -1) {
        events[index] = { ...events[index], ...updates };
        saveEventsToStorage();
        return events[index];
    }
    return null;
}

function deleteEvent(eventId) {
    const index = events.findIndex(event => event.id === eventId);
    if (index !== -1) {
        events.splice(index, 1);
        saveEventsToStorage();
        return true;
    }
    return false;
}

function getEvent(eventId) {
    return events.find(event => event.id === eventId);
}

function getAllEvents() {
    return events;
}

// Participant management functions
function registerParticipant(participantData) {
    const participant = {
        id: Date.now().toString(),
        ...participantData,
        registeredAt: new Date().toISOString()
    };
    
    participants.push(participant);
    saveParticipantsToStorage();
    return participant;
}

function updateParticipant(participantId, updates) {
    const index = participants.findIndex(participant => participant.id === participantId);
    if (index !== -1) {
        participants[index] = { ...participants[index], ...updates };
        saveParticipantsToStorage();
        return participants[index];
    }
    return null;
}

function getParticipantsByEvent(eventId) {
    return participants.filter(participant => participant.eventId === eventId);
}

function getAllParticipants() {
    return participants;
}
