// WareezHub - Premium Event Registration System
// Frontend JavaScript with localStorage functionality

// Sample Nigerian event data
const sampleEvents = [
    {
        id: 1,
        title: "Nigeria Tech Innovation Summit 2024",
        category: "Technology",
        date: "2024-12-15",
        time: "09:00",
        location: "Eko Hotels & Suites, Victoria Island, Lagos",
        price: 299,
        totalSeats: 500,
        availableSeats: 127,
        image: "assets/images/nigerian-tech-summit.jpg",
        description: "Join Nigeria's brightest tech minds for cutting-edge discussions on fintech, AI, blockchain, and digital transformation in Africa's tech hub.",
        organizer: "TechHub Nigeria",
        features: ["WiFi", "Parking", "Catering", "Accessibility", "Live Streaming"]
    },
    {
        id: 2,
        title: "Nigeria Digital Marketing Masterclass",
        category: "Marketing",
        date: "2024-12-20",
        time: "14:00",
        location: "Transcorp Hilton, Abuja",
        price: 149,
        totalSeats: 200,
        availableSeats: 89,
        image: "assets/images/nigerian-marketing-workshop.jpg",
        description: "Master digital marketing strategies tailored for the African market. Learn social media marketing, content creation, and brand building from Nigerian experts.",
        organizer: "Digital Marketing Academy Nigeria",
        features: ["WiFi", "Parking", "Catering", "Workshop Materials", "Certificate"]
    },
    {
        id: 3,
        title: "Nigeria Startup Founders Conference",
        category: "Business",
        date: "2024-12-28",
        time: "10:00",
        location: "Landmark Centre, Victoria Island, Lagos",
        price: 199,
        totalSeats: 300,
        availableSeats: 156,
        image: "assets/images/nigerian-startup-conference.jpg",
        description: "Connect with Nigerian entrepreneurs, investors, and ecosystem builders. Perfect for founders looking to scale their businesses in Nigeria and across Africa.",
        organizer: "Startup Nigeria",
        features: ["WiFi", "Parking", "Networking", "Pitch Sessions", "Investor Meetings"]
    },
    {
        id: 4,
        title: "Nigeria Creative Design Workshop",
        category: "Design",
        date: "2025-01-10",
        time: "13:00",
        location: "Creative Hub, Ikoyi, Lagos",
        price: 189,
        totalSeats: 50,
        availableSeats: 23,
        image: "assets/images/nigerian-design-workshop.jpg",
        description: "Explore African design aesthetics and techniques in this hands-on workshop. Learn from Nigerian creative professionals and enhance your design skills.",
        organizer: "Design Institute Nigeria",
        features: ["WiFi", "Materials Provided", "Certificate", "Portfolio Review", "Job Placement"]
    },
    {
        id: 5,
        title: "Nigeria Health & Wellness Expo",
        category: "Health",
        date: "2025-01-18",
        time: "10:00",
        location: "Tafawa Balewa Square, Abuja",
        price: 75,
        totalSeats: 1000,
        availableSeats: 445,
        image: "assets/images/nigerian-health-expo.jpg",
        description: "Discover holistic health and wellness solutions tailored for Nigerians. Features health screenings, fitness demos, and expert talks on well-being.",
        organizer: "Wellness Nigeria",
        features: ["WiFi", "Parking", "Health Screenings", "Fitness Demos", "Wellness Products"]
    },
    {
        id: 6,
        title: "Nigeria Afrobeats Music & Culture Festival",
        category: "Entertainment",
        date: "2025-01-25",
        time: "16:00",
        location: "Eko Atlantic City, Lagos",
        price: 50,
        totalSeats: 5000,
        availableSeats: 2100,
        image: "assets/images/nigerian-music-festival.jpg",
        description: "Experience the best of Nigerian music, arts, and culture at this vibrant festival. Featuring top Afrobeats artists, cultural performances, and local cuisine.",
        organizer: "Nigerian Entertainment Council",
        features: ["WiFi", "Parking", "Food Courts", "Cultural Performances", "Artist Meet & Greet"]
    }
];

// Initialize localStorage with sample data if empty
function initializeLocalStorage() {
    if (!localStorage.getItem('events')) {
        localStorage.setItem('events', JSON.stringify(sampleEvents));
    }
    
    if (!localStorage.getItem('registrations')) {
        localStorage.setItem('registrations', JSON.stringify([]));
    }
}

// Utility functions
function generateTicketId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9).toUpperCase();
    return `TKT-${timestamp}-${random}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function isEventPast(eventDate) {
    return new Date(eventDate) < new Date();
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toast.className = `toast ${type}`;
    toastMessage.textContent = message;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Event listing functions
function loadEvents() {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const eventsGrid = document.getElementById('eventsGrid');
    
    if (eventsGrid) {
        eventsGrid.innerHTML = '';
        
        events.forEach(event => {
            const eventCard = createEventCard(event);
            eventsGrid.appendChild(eventCard);
        });
    }
}

// Featured events loading
function loadFeaturedEvents() {
    const featuredEvents = [
        {
            id: 'featured-1',
            title: 'Nigeria Tech Innovation Summit 2024',
            category: 'Technology',
            date: '2024-12-15',
            time: '09:00',
            location: 'Eko Hotels & Suites, Victoria Island, Lagos',
            price: 299,
            image: 'assets/images/nigerian-tech-summit.jpg',
            badge: 'Live Now',
            buttonText: 'Register Now',
            extraIcon: 'broadcast-tower',
            extraText: 'Live Stream',
            description: 'Join Nigeria\'s brightest tech minds for cutting-edge discussions on fintech, AI, blockchain, and digital transformation in Africa\'s tech hub.'
        },
        {
            id: 'featured-2',
            title: 'Nigeria Business Leadership Summit',
            category: 'Business',
            date: '2024-12-22',
            time: '14:00',
            location: 'Transcorp Hilton, Abuja',
            price: 499,
            image: 'assets/images/nigerian-business-summit.jpg',
            badge: 'Premium',
            buttonText: 'Reserve Spot',
            extraIcon: 'crown',
            extraText: 'VIP Access',
            description: 'Connect with Nigeria\'s top business leaders and entrepreneurs for exclusive insights into business growth strategies and leadership development.'
        },
        {
            id: 'featured-3',
            title: 'Nigeria Creative Design Workshop',
            category: 'Design',
            date: '2025-01-10',
            time: '10:00',
            location: 'Creative Hub, Ikoyi, Lagos',
            price: 199,
            image: 'assets/images/nigerian-design-workshop.jpg',
            badge: 'Exclusive',
            buttonText: 'Book Workshop',
            extraIcon: 'palette',
            extraText: 'Materials Included',
            description: 'Explore African design aesthetics and techniques in this hands-on workshop. Learn from Nigeria\'s creative professionals and enhance your design skills.'
        }
    ];
    
    const featuredGrid = document.getElementById('featuredGrid');
    if (featuredGrid) {
        featuredGrid.innerHTML = '';
        
        featuredEvents.forEach(event => {
            const eventCard = createFeaturedEventCard(event);
            featuredGrid.appendChild(eventCard);
        });
    }
}

function createFeaturedEventCard(event) {
    const card = document.createElement('div');
    card.className = 'featured-card';
    
    const badge = document.createElement('div');
    badge.className = 'featured-badge';
    badge.textContent = event.badge;
    
    const image = document.createElement('img');
    image.className = 'featured-image';
    image.src = event.image;
    image.alt = event.title;
    image.onerror = function() {
        console.error('Failed to load featured event image:', event.image);
        this.style.display = 'none';
        // Fallback to placeholder
        this.src = 'https://via.placeholder.com/800x400/cccccc/000000?text=' + encodeURIComponent(event.title);
    };
    
    const content = document.createElement('div');
    content.className = 'featured-content';
    
    const title = document.createElement('h3');
    title.textContent = event.title;
    
    const description = document.createElement('p');
    description.textContent = event.description;
    
    const meta = document.createElement('div');
    meta.className = 'featured-meta';
    
    const dateSpan = document.createElement('span');
    dateSpan.innerHTML = `<i class="fas fa-calendar"></i> ${formatDate(event.date)}`;
    
    const locationSpan = document.createElement('span');
    locationSpan.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${event.location}`;
    
    if (event.extraIcon) {
        const extraIcon = document.createElement('span');
        extraIcon.innerHTML = `<i class="fas fa-${event.extraIcon}"></i> ${event.extraText}`;
        meta.appendChild(extraIcon);
    }
    
    meta.appendChild(dateSpan);
    meta.appendChild(locationSpan);
    
    const button = document.createElement('button');
    button.className = 'btn btn-primary';
    button.textContent = event.buttonText;
    button.onclick = () => {
        window.location.href = `event.html?id=${event.id}`;
    };
    
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(meta);
    content.appendChild(button);
    
    card.appendChild(badge);
    card.appendChild(image);
    card.appendChild(content);
    
    return card;
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.onclick = () => viewEvent(event.id);
    
    const seatsClass = event.availableSeats <= 10 ? 'low' : event.availableSeats === 0 ? 'sold-out' : '';
    const seatsText = event.availableSeats === 0 ? 'Sold Out' : `${event.availableSeats} seats left`;
    
    // Fallback image URLs based on event category
    const fallbackImages = {
        'Technology': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'Business': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'Design': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'Health': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'default': 'https://images.unsplash.com/photo-1541339907190-e3e62d5db2a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    };
    
    const fallbackImage = fallbackImages[event.category] || fallbackImages.default;
    
    card.innerHTML = `
        <div class="event-card-image-container">
            <img src="${event.image}" alt="${event.title}" class="event-card-image" 
                 onerror="this.src='${fallbackImage}'" 
                 onload="this.style.opacity='1'" 
                 style="opacity: 0; transition: opacity 0.3s ease;">
            <div class="event-card-image-overlay"></div>
        </div>
        <div class="event-card-content">
            <h3 class="event-card-title">${event.title}</h3>
            <div class="event-card-date">
                <i class="fas fa-calendar"></i> ${formatDate(event.date)} at ${formatTime(event.time)}
            </div>
            <div class="event-card-date">
                <i class="fas fa-map-marker-alt"></i> ${event.location}
            </div>
            <div class="event-card-seats ${seatsClass}">
                <i class="fas fa-users"></i> ${seatsText}
            </div>
            <div class="event-card-price">${formatCurrency(event.price)}</div>
            <div class="event-card-actions">
                <a href="register.html?id=${event.id}" class="btn btn-primary" onclick="event.stopPropagation()">
                    ${event.availableSeats === 0 ? 'Sold Out' : 'Register Now'}
                </a>
            </div>
        </div>
    `;
    
    return card;
}

function searchEvents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const eventsGrid = document.getElementById('eventsGrid');
    
    const filteredEvents = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm) ||
        event.category.toLowerCase().includes(searchTerm)
    );
    
    eventsGrid.innerHTML = '';
    
    if (filteredEvents.length === 0) {
        eventsGrid.innerHTML = '<div class="no-results"><p>No events found matching your search.</p></div>';
    } else {
        filteredEvents.forEach(event => {
            const eventCard = createEventCard(event);
            eventsGrid.appendChild(eventCard);
        });
    }
}

function viewEvent(eventId) {
    window.location.href = `event.html?id=${eventId}`;
}

function quickRegister(eventId) {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const event = events.find(e => e.id === eventId);
    
    if (event && event.availableSeats > 0) {
        openRegistrationModal(eventId);
    }
}

// Event details functions
function loadEventDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = parseInt(urlParams.get('id'));
    
    if (!eventId) {
        window.location.href = 'index.html';
        return;
    }
    
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
        showToast('Event not found', 'error');
        window.location.href = 'index.html';
        return;
    }
    
    // Update event details
    document.getElementById('eventTitle').textContent = event.title;
    document.getElementById('eventCategory').textContent = event.category;
    document.getElementById('eventPrice').textContent = formatCurrency(event.price);
    document.getElementById('eventBannerImage').src = event.image;
    document.getElementById('eventDate').textContent = formatDate(event.date);
    document.getElementById('eventTime').textContent = formatTime(event.time);
    document.getElementById('eventLocation').textContent = event.location;
    document.getElementById('eventOrganizer').textContent = event.organizer;
    document.getElementById('eventDescription').textContent = event.description;
    document.getElementById('priceAmount').textContent = formatCurrency(event.price);
    
    // Update seats information
    const seatsPercentage = ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100;
    document.getElementById('seatsProgressBar').style.width = `${seatsPercentage}%`;
    document.getElementById('availableSeats').textContent = `${event.availableSeats} seats left`;
    document.getElementById('totalSeats').textContent = `of ${event.totalSeats} total`;
    document.getElementById('seatsCount').textContent = `${event.availableSeats} seats available`;
    
    // Update register button
    const registerBtn = document.getElementById('registerBtn');
    if (event.availableSeats === 0) {
        registerBtn.textContent = 'Sold Out';
        registerBtn.disabled = true;
        registerBtn.classList.add('btn-disabled');
    }
    
    // Load event features
    const featuresContainer = document.getElementById('eventFeatures');
    featuresContainer.innerHTML = event.features.map(feature => `
        <div class="feature-item">
            <i class="fas fa-check"></i>
            <span>${feature}</span>
        </div>
    `).join('');
    
    // Store event ID for registration
    document.getElementById('eventId').value = eventId;
}

function openRegistrationModal(eventId = null) {
    const modal = document.getElementById('registrationModal');
    const eventIdInput = document.getElementById('eventId');
    
    if (eventId) {
        eventIdInput.value = eventId;
    }
    
    // Update event summary in modal
    if (eventId) {
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        const event = events.find(e => e.id === eventId);
        
        if (event) {
            document.getElementById('summaryEventTitle').textContent = event.title;
            document.getElementById('summaryEventDate').textContent = `${formatDate(event.date)} at ${formatTime(event.time)}`;
            document.getElementById('summaryEventPrice').textContent = formatCurrency(event.price);
        }
    }
    
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('registrationModal');
    modal.classList.remove('show');
    
    // Reset form
    document.getElementById('registrationForm').reset();
}

function submitRegistration() {
    const eventId = parseInt(document.getElementById('eventId').value);
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const notes = document.getElementById('notes').value.trim();
    
    // Validation
    if (!name || !email || !phone) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    if (!validatePhone(phone)) {
        showToast('Please enter a valid phone number', 'error');
        return;
    }
    
    // Check for duplicate registration
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const existingRegistration = registrations.find(r => 
        r.eventId === eventId && r.email === email
    );
    
    if (existingRegistration) {
        showToast('You have already registered for this event', 'error');
        return;
    }
    
    // Get event details
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const event = events.find(e => e.id === eventId);
    
    if (!event || event.availableSeats === 0) {
        showToast('This event is sold out', 'error');
        return;
    }
    
    // Create registration
    const registration = {
        id: Date.now(),
        eventId: eventId,
        ticketId: generateTicketId(),
        name: name,
        email: email,
        phone: phone,
        notes: notes,
        registrationDate: new Date().toISOString(),
        status: 'confirmed'
    };
    
    // Save registration
    registrations.push(registration);
    localStorage.setItem('registrations', JSON.stringify(registrations));
    
    // Update event seats
    event.availableSeats--;
    localStorage.setItem('events', JSON.stringify(events));
    
    // Close modal and show success
    closeModal();
    showToast('Registration successful! Redirecting to your ticket...', 'success');
    
    // Redirect to ticket page
    setTimeout(() => {
        window.location.href = `ticket.html?id=${registration.ticketId}`;
    }, 2000);
}

// Ticket functions
function loadTicket() {
    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('id');
    
    if (!ticketId) {
        showToast('Invalid ticket ID', 'error');
        window.location.href = 'tracking.html';
        return;
    }
    
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const registration = registrations.find(r => r.ticketId === ticketId);
    
    if (!registration) {
        showToast('Ticket not found', 'error');
        window.location.href = 'tracking.html';
        return;
    }
    
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const event = events.find(e => e.id === registration.eventId);
    
    if (!event) {
        showToast('Event not found', 'error');
        window.location.href = 'tracking.html';
        return;
    }
    
    // Update ticket details
    document.getElementById('ticketEventTitle').textContent = event.title;
    document.getElementById('ticketEventDate').textContent = formatDate(event.date);
    document.getElementById('ticketEventTime').textContent = formatTime(event.time);
    document.getElementById('ticketEventLocation').textContent = event.location;
    document.getElementById('ticketPrice').textContent = formatCurrency(event.price);
    document.getElementById('ticketAttendeeName').textContent = registration.name;
    document.getElementById('ticketAttendeeEmail').textContent = registration.email;
    document.getElementById('ticketAttendeePhone').textContent = registration.phone;
    document.getElementById('ticketId').textContent = registration.ticketId;
}

function printTicket() {
    window.print();
}

function downloadTicket() {
    // Create a simple text download
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('id');
    const registration = registrations.find(r => r.ticketId === ticketId);
    
    if (registration) {
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        const event = events.find(e => e.id === registration.eventId);
        
        const ticketData = {
            ticketId: registration.ticketId,
            event: event.title,
            date: formatDate(event.date),
            time: formatTime(event.time),
            location: event.location,
            name: registration.name,
            email: registration.email,
            phone: registration.phone
        };
        
        const dataStr = JSON.stringify(ticketData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `ticket_${registration.ticketId}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showToast('Ticket downloaded successfully', 'success');
    }
}

function shareTicket() {
    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('id');
    const shareUrl = `${window.location.origin}/ticket.html?id=${ticketId}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Event Ticket',
            text: 'Check out my event ticket!',
            url: shareUrl
        }).then(() => {
            showToast('Ticket shared successfully', 'success');
        }).catch((error) => {
            copyToClipboard(shareUrl);
        });
    } else {
        copyToClipboard(shareUrl);
    }
}

// Dashboard functions
function loadDashboard() {
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    
    // Calculate statistics
    const totalEvents = registrations.length;
    const upcomingEvents = registrations.filter(r => {
        const event = events.find(e => e.id === r.eventId);
        return event && !isEventPast(event.date);
    }).length;
    const pastEvents = registrations.filter(r => {
        const event = events.find(e => e.id === r.eventId);
        return event && isEventPast(event.date);
    }).length;
    
    const totalSpent = registrations.reduce((total, r) => {
        const event = events.find(e => e.id === r.eventId);
        return total + (event ? event.price : 0);
    }, 0);
    
    // Update statistics
    document.getElementById('totalEvents').textContent = totalEvents;
    document.getElementById('upcomingEvents').textContent = upcomingEvents;
    document.getElementById('pastEvents').textContent = pastEvents;
    document.getElementById('totalSpent').textContent = formatCurrency(totalSpent);
    
    // Load events list
    loadRegistrationsList('all');
}

function loadRegistrationsList(filter = 'all') {
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const eventsList = document.getElementById('eventsList');
    const emptyState = document.getElementById('emptyState');
    
    let filteredRegistrations = registrations;
    
    if (filter === 'upcoming') {
        filteredRegistrations = registrations.filter(r => {
            const event = events.find(e => e.id === r.eventId);
            return event && !isEventPast(event.date);
        });
    } else if (filter === 'past') {
        filteredRegistrations = registrations.filter(r => {
            const event = events.find(e => e.id === r.eventId);
            return event && isEventPast(event.date);
        });
    }
    
    eventsList.innerHTML = '';
    
    if (filteredRegistrations.length === 0) {
        emptyState.style.display = 'block';
        eventsList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        eventsList.style.display = 'block';
        
        filteredRegistrations.forEach(registration => {
            const event = events.find(e => e.id === registration.eventId);
            if (event) {
                const eventItem = createRegistrationItem(registration, event);
                eventsList.appendChild(eventItem);
            }
        });
    }
}

function createRegistrationItem(registration, event) {
    const item = document.createElement('div');
    item.className = 'registration-item';
    
    const isPast = isEventPast(event.date);
    const statusClass = isPast ? 'past' : 'confirmed';
    const statusText = isPast ? 'Past' : 'Upcoming';
    
    item.innerHTML = `
        <div class="registration-info">
            <h3>${event.title}</h3>
            <p><i class="fas fa-calendar"></i> ${formatDate(event.date)} at ${formatTime(event.time)}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            <p><i class="fas fa-ticket-alt"></i> Ticket ID: ${registration.ticketId}</p>
        </div>
        <div class="registration-actions">
            <span class="status-badge ${statusClass}">${statusText}</span>
            <button class="btn btn-outline btn-sm" onclick="viewRegistrationDetails(${registration.id})">
                <i class="fas fa-eye"></i> Details
            </button>
            <button class="btn btn-primary btn-sm" onclick="viewTicket('${registration.ticketId}')">
                <i class="fas fa-ticket-alt"></i> Ticket
            </button>
            ${!isPast ? `<button class="btn btn-danger btn-sm" onclick="cancelRegistration(${registration.id})">
                <i class="fas fa-times"></i> Cancel
            </button>` : ''}
        </div>
    `;
    
    return item;
}

function filterEvents(filter) {
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load filtered registrations
    loadRegistrationsList(filter);
}

function viewRegistrationDetails(registrationId) {
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const registration = registrations.find(r => r.id === registrationId);
    
    if (!registration) {
        showToast('Registration not found', 'error');
        return;
    }
    
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const event = events.find(e => e.id === registration.eventId);
    
    if (!event) {
        showToast('Event not found', 'error');
        return;
    }
    
    // Update modal content
    document.getElementById('modalEventTitle').textContent = event.title;
    document.getElementById('modalEventDate').textContent = `${formatDate(event.date)} at ${formatTime(event.time)}`;
    document.getElementById('modalEventTime').textContent = formatTime(event.time);
    document.getElementById('modalEventLocation').textContent = event.location;
    document.getElementById('modalTicketId').textContent = registration.ticketId;
    document.getElementById('modalAttendeeName').textContent = registration.name;
    document.getElementById('modalAttendeeEmail').textContent = registration.email;
    document.getElementById('modalAttendeePhone').textContent = registration.phone;
    
    // Update cancel button visibility
    const cancelBtn = document.getElementById('cancelBtn');
    if (isEventPast(event.date)) {
        cancelBtn.style.display = 'none';
    } else {
        cancelBtn.style.display = 'block';
    }
    
    // Show modal
    document.getElementById('eventDetailsModal').classList.add('show');
}

function closeEventDetailsModal() {
    document.getElementById('eventDetailsModal').classList.remove('show');
}

function viewTicket(ticketId) {
    window.location.href = `ticket.html?id=${ticketId}`;
}

function cancelRegistration(registrationId) {
    if (!confirm('Are you sure you want to cancel this registration?')) {
        return;
    }
    
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const registrationIndex = registrations.findIndex(r => r.id === registrationId);
    
    if (registrationIndex === -1) {
        showToast('Registration not found', 'error');
        return;
    }
    
    const registration = registrations[registrationIndex];
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const event = events.find(e => e.id === registration.eventId);
    
    if (!event) {
        showToast('Event not found', 'error');
        return;
    }
    
    // Remove registration
    registrations.splice(registrationIndex, 1);
    localStorage.setItem('registrations', JSON.stringify(registrations));
    
    // Update event seats
    event.availableSeats++;
    localStorage.setItem('events', JSON.stringify(events));
    
    // Close modal and refresh
    closeEventDetailsModal();
    loadDashboard();
    
    showToast('Registration cancelled successfully', 'success');
}

function shareRegistration() {
    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('id');
    const shareUrl = `${window.location.origin}/ticket.html?id=${ticketId}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Event Registration',
            text: 'Check out my event registration!',
            url: shareUrl
        }).then(() => {
            showToast('Registration shared successfully', 'success');
        }).catch((error) => {
            copyToClipboard(shareUrl);
        });
    } else {
        copyToClipboard(shareUrl);
    }
}

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    showToast('Link copied to clipboard', 'success');
}

function shareEvent(platform) {
    const url = window.location.href;
    const title = document.title;
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

function copyEventLink() {
    copyToClipboard(window.location.href);
}

function scrollToEvents() {
    const eventsSection = document.getElementById('eventsSection');
    if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function showHowTo() {
    alert('How to use EventHub:\n\n1. Browse events on the home page\n2. Click on any event to view details\n3. Register for events using the registration form\n4. View your tickets in the "My Events" section\n5. Share events with friends\n\nEnjoy your event experience!');
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    mobileMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    mobileMenu.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeLocalStorage();
    
    // Mobile menu functionality
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        if (mobileMenu && !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Page-specific initialization
    if (document.getElementById('eventsGrid')) {
        loadEvents();
    }
    
    if (document.getElementById('eventTitle')) {
        loadEventDetails();
    }
    
    if (document.getElementById('ticketEventTitle')) {
        loadTicket();
    }
    
    if (document.getElementById('totalEvents')) {
        loadDashboard();
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchEvents);
    }
    
    // Modal close on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // Form submission
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitRegistration();
        });
    }
});

// Export for global access
window.EventHub = {
    loadEvents,
    viewEvent,
    quickRegister,
    openRegistrationModal,
    closeModal,
    submitRegistration,
    loadTicket,
    printTicket,
    downloadTicket,
    shareTicket,
    loadDashboard,
    filterEvents,
    viewRegistrationDetails,
    closeEventDetailsModal,
    viewTicket,
    cancelRegistration,
    shareRegistration,
    shareEvent,
    copyEventLink,
    scrollToEvents,
    showHowTo
};
