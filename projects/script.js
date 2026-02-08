// ===== Data Store =====
const eventsData = [
    {
        id: 1,
        title: "Annual Spring Unplugged Music Fest",
        category: "cultural",
        type: "Cultural",
        date: "Oct 12, 2024",
        time: "07:00 PM",
        venue: "Open Air Theatre",
        description: "Join us for the largest student-led tech gathering of the year. Featuring keynote speakers from industry giants, interactive workshops on AI, and a networking mixer. This symposium aims to bridge the gap between academia and industry.",
        trending: true,
        gradient: "var(--gradient-primary)",
        registrationDeadline: "Oct 22",
        status: "upcoming"
    },
    {
        id: 2,
        title: "Global Innovation Tech Summit",
        category: "tech",
        type: "Tech & Innovation",
        date: "Oct 15, 2024",
        time: "09:00 AM",
        venue: "Innovation Hub",
        description: "A premier technology conference bringing together innovators, entrepreneurs, and tech enthusiasts.",
        trending: true,
        gradient: "var(--gradient-ocean)",
        registrationDeadline: "Oct 12",
        status: "upcoming"
    },
    {
        id: 3,
        title: "Mindful Yoga & Wellness",
        category: "workshops",
        type: "Workshop",
        date: "Oct 08",
        time: "07:00 AM",
        venue: "Gym Hall",
        description: "Start your day with mindfulness and wellness practices.",
        gradient: "var(--gradient-success)",
        status: "upcoming"
    },
    {
        id: 4,
        title: "Code Sprint: 24h Hackathon",
        category: "workshops",
        type: "Hackathon",
        date: "Oct 10",
        time: "09:00 PM",
        venue: "Tech Lab 4",
        description: "24-hour coding marathon to build innovative solutions.",
        gradient: "var(--gradient-secondary)",
        status: "upcoming"
    },
    {
        id: 5,
        title: "Inter-College Swim Meet",
        category: "sports",
        type: "Sports",
        date: "Oct 11",
        time: "03:00 PM",
        venue: "Aquatic Center",
        description: "Annual swimming competition between colleges.",
        gradient: "var(--gradient-warm)",
        status: "upcoming"
    },
    {
        id: 6,
        title: "Annual Hackathon 2024",
        category: "tech",
        type: "Hackathon",
        date: "Oct 15, 2024",
        time: "09:00 AM",
        venue: "Grand Hall",
        description: "Join the biggest hackathon of the year with amazing prizes and networking opportunities.",
        image: "coding",
        status: "ongoing",
        participants: 234
    },
    {
        id: 7,
        title: "Tech Leadership Workshop",
        category: "workshops",
        type: "Workshop",
        date: "Oct 20, 2024",
        time: "02:00 PM",
        venue: "Seminar Room 4",
        description: "Learn leadership skills from industry experts.",
        image: "meeting",
        status: "upcoming",
        participants: 89
    },
    {
        id: 8,
        title: "Freshmen Orientation",
        category: "social",
        type: "Social",
        date: "Sep 10, 2024",
        time: "10:00 AM",
        venue: "Campus Plaza",
        description: "Welcome event for new students.",
        image: "concert",
        status: "completed",
        participants: 456
    }
];

const participantsData = [
    {
        id: 1,
        name: "Alex Johnson",
        department: "Computer Science",
        year: "Year 3",
        studentId: "CS2021-045",
        registrationTime: "Oct 12, 10:30 AM",
        checkedIn: true,
        avatar: "AJ"
    },
    {
        id: 2,
        name: "Sarah Williams",
        department: "Mech. Engineering",
        year: "Year 4",
        studentId: "ME2020-123",
        registrationTime: "Oct 12, 10:45 AM",
        checkedIn: false,
        avatar: "SW"
    },
    {
        id: 3,
        name: "Michael Chen",
        department: "Design Arts",
        year: "Year 2",
        studentId: "DA2022-089",
        registrationTime: "Oct 12, 11:05 AM",
        checkedIn: false,
        avatar: "MC"
    },
    {
        id: 4,
        name: "Emily Davis",
        department: "Biotechnology",
        year: "Year 1",
        studentId: "BT2023-156",
        registrationTime: "Oct 12, 11:12 AM",
        checkedIn: true,
        avatar: "ED"
    },
    {
        id: 5,
        name: "Robert Wilson",
        department: "Business Admin",
        year: "Year 3",
        studentId: "BA2021-078",
        registrationTime: "Oct 12, 11:20 AM",
        checkedIn: false,
        avatar: "RW"
    }
];

// ===== State Management =====
let currentPage = 'home';
let currentCategory = 'all';
let currentEvent = null;

// ===== Utility Functions =====
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const page = document.getElementById(`${pageName}Page`);
    if (page) {
        page.classList.add('active');
        currentPage = pageName;
    }
}

function generateAvatar(initials) {
    const colors = ['#667eea', '#f093fb', '#4facfe', '#fa709a', '#30cfd0', '#ff6b6b'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='${encodeURIComponent(color)}'/%3E%3Ctext x='50' y='65' font-size='40' fill='white' text-anchor='middle' font-family='Arial'%3E${initials}%3C/text%3E%3C/svg%3E`;
}

function generateEventImage(type) {
    const images = {
        coding: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23141824' width='400' height='300'/%3E%3Ctext x='200' y='150' font-size='60' fill='%2364748b' text-anchor='middle' font-family='monospace'%3E%3C/%3E%3C/text%3E%3C/svg%3E",
        meeting: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23141824' width='400' height='300'/%3E%3Ccircle cx='150' cy='120' r='30' fill='%23667eea'/%3E%3Ccircle cx='250' cy='120' r='30' fill='%23764ba2'/%3E%3Crect x='100' y='180' width='200' height='80' rx='10' fill='%232563eb'/%3E%3C/svg%3E",
        concert: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23141824' width='400' height='300'/%3E%3Crect x='50' y='200' width='300' height='80' fill='%23667eea'/%3E%3Ccircle cx='200' cy='100' r='40' fill='%23f093fb'/%3E%3C/svg%3E",
        yoga: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%234facfe' width='400' height='300'/%3E%3Ccircle cx='200' cy='120' r='40' fill='white'/%3E%3Crect x='180' y='160' width='40' height='80' rx='20' fill='white'/%3E%3C/svg%3E",
        swim: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%2330cfd0' width='400' height='300'/%3E%3Ccircle cx='200' cy='100' r='30' fill='white'/%3E%3Cpath d='M 150 150 Q 200 120 250 150' stroke='white' stroke-width='8' fill='none'/%3E%3C/svg%3E"
    };
    return images[type] || images.coding;
}

// ===== Render Functions =====
function renderFeaturedEvents() {
    const container = document.getElementById('featuredEvents');
    const featured = eventsData.filter(e => e.trending);
    
    container.innerHTML = featured.map(event => `
        <div class="featured-card" onclick="showEventDetails(${event.id})">
            <div class="featured-card-bg" style="background: ${event.gradient}"></div>
            <div class="featured-card-content">
                ${event.trending ? '<div class="trending-badge">TRENDING</div>' : ''}
                <div>
                    <div class="category-badge">${event.type}</div>
                    <h3 class="featured-title">${event.title}</h3>
                </div>
                <div class="featured-info">
                    <div class="info-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        ${event.date}
                    </div>
                    <div class="info-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        ${event.venue}
                    </div>
                    <button class="register-btn" onclick="event.stopPropagation(); openRegistrationModal(${event.id})">Register</button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderUpcomingEvents() {
    const container = document.getElementById('upcomingEvents');
    const upcoming = eventsData.filter(e => !e.trending && e.status === 'upcoming');
    
    container.innerHTML = upcoming.map(event => `
        <div class="upcoming-card" onclick="showEventDetails(${event.id})">
            <div class="upcoming-image">
                <div style="width: 100%; height: 100%; background: ${event.gradient}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">
                    ${event.type}
                </div>
                <div class="date-badge">${event.date}</div>
            </div>
            <div class="upcoming-content">
                <div class="upcoming-header">
                    <div>
                        <h3 class="upcoming-title">${event.title}</h3>
                        <div class="upcoming-meta">
                            <div class="meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 6v6l4 2"></path>
                                </svg>
                                ${event.time}
                            </div>
                            <div class="meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                ${event.venue}
                            </div>
                        </div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="event-type-badge ${event.category}">${event.type}</div>
                    <button class="join-btn" onclick="event.stopPropagation(); openRegistrationModal(${event.id})">Join</button>
                </div>
            </div>
        </div>
    `).join('');
}

function showEventDetails(eventId) {
    currentEvent = eventsData.find(e => e.id === eventId);
    if (!currentEvent) return;
    
    const container = document.getElementById('eventDetailsContent');
    container.innerHTML = `
        <div class="event-banner">
            <div style="width: 100%; height: 100%; background: ${currentEvent.gradient}; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; font-weight: 700;">
                ${currentEvent.type}
            </div>
            <div class="event-category-badge">${currentEvent.type}</div>
        </div>
        
        <div class="event-title-section">
            <h1>${currentEvent.title}</h1>
        </div>
        
        <div class="event-logistics">
            <div class="logistics-item">
                <div class="logistics-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                </div>
                <div class="logistics-text">
                    <div class="logistics-label">October 24, 2024</div>
                    <div class="logistics-value">10:00 AM - 4:00 PM</div>
                </div>
            </div>
            
            <div class="logistics-item">
                <div class="logistics-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                </div>
                <div class="logistics-text">
                    <div class="logistics-label">${currentEvent.venue}</div>
                    <div class="logistics-value">West Campus, Block C</div>
                    <a href="#" class="map-link">
                        Map
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M7 17L17 7M17 7H7M17 7v10"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
        
        ${currentEvent.registrationDeadline ? `
        <div class="registration-alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span class="alert-text">Registration closes in 2 days (${currentEvent.registrationDeadline})</span>
        </div>
        ` : ''}
        
        <div class="event-description">
            <h3>About the Event</h3>
            <p>${currentEvent.description}</p>
        </div>
        
        <div class="early-bird-section">
            <div class="early-bird-label">EARLY BIRD</div>
            <h2 class="early-bird-title">FREE</h2>
        </div>
        
        <button class="register-now-btn" onclick="openRegistrationModal(${currentEvent.id})">
            Register Now
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
        </button>
    `;
    
    showPage('eventDetails');
}

function renderManagedEvents() {
    const container = document.getElementById('managedEvents');
    const managed = eventsData.filter(e => e.participants);
    
    container.innerHTML = managed.map(event => `
        <div class="managed-event-card" onclick="showEventDetails(${event.id})">
            <img src="${generateEventImage(event.image)}" alt="${event.title}" class="event-image">
            <div class="event-status-badge ${event.status}">${event.status}</div>
            <div class="managed-event-content">
                <h3 class="managed-event-title">${event.title}</h3>
                <div class="managed-event-meta">
                    <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        ${event.date}
                    </span>
                    <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        ${event.venue}
                    </span>
                </div>
                <button class="view-participants-btn" onclick="event.stopPropagation(); showParticipants(${event.id})">
                    View Participants
                </button>
            </div>
            <button class="edit-event-btn" onclick="event.stopPropagation();">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

function showParticipants(eventId) {
    currentEvent = eventsData.find(e => e.id === eventId);
    if (!currentEvent) return;
    
    document.getElementById('participantsEventName').textContent = currentEvent.title;
    document.getElementById('totalParticipants').textContent = currentEvent.participants || participantsData.length;
    
    renderParticipants();
    showPage('participants');
}

function renderParticipants(filter = 'all') {
    const container = document.getElementById('participantsList');
    let filtered = participantsData;
    
    if (filter === 'pending') {
        filtered = participantsData.filter(p => !p.checkedIn);
    }
    
    container.innerHTML = filtered.map(participant => `
        <div class="participant-card">
            <div class="participant-avatar">
                <img src="${generateAvatar(participant.avatar)}" alt="${participant.name}">
                ${participant.checkedIn ? `
                    <div class="verified-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                ` : ''}
            </div>
            <div class="participant-info">
                <div class="participant-name">${participant.name}</div>
                <div class="participant-details">${participant.department} • ${participant.year}</div>
                <div class="participant-time">${participant.registrationTime}</div>
            </div>
            <div style="text-align: right;">
                <div class="check-in-toggle ${participant.checkedIn ? 'checked' : ''}" onclick="toggleCheckIn(${participant.id})">
                    <div class="toggle-slider"></div>
                </div>
                <div class="check-in-status ${participant.checkedIn ? 'checked-in' : 'pending'}">
                    ${participant.checkedIn ? 'Checked In' : 'Pending'}
                </div>
            </div>
        </div>
    `).join('');
}

function toggleCheckIn(participantId) {
    const participant = participantsData.find(p => p.id === participantId);
    if (participant) {
        participant.checkedIn = !participant.checkedIn;
        renderParticipants();
    }
}

// ===== Modal Functions =====
function openRegistrationModal(eventId) {
    currentEvent = eventsData.find(e => e.id === eventId);
    document.getElementById('registrationModal').classList.add('active');
}

function closeRegistrationModal() {
    document.getElementById('registrationModal').classList.remove('active');
}

// ===== Event Listeners =====
document.addEventListener('DOMContentLoaded', () => {
    // Initial render
    renderFeaturedEvents();
    renderUpcomingEvents();
    renderManagedEvents();
    
    // Category tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            // Filter events based on category
        });
    });
    
    // Participant tabs
    document.querySelectorAll('.participant-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.participant-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            renderParticipants(e.target.dataset.status);
        });
    });
    
    // Navigation
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', (e) => {
            const page = e.currentTarget.dataset.page;
            if (page === 'dashboard') {
                showPage('dashboard');
            } else if (page === 'home') {
                showPage('home');
            }
            
            // Update active state
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });
    
    // Back buttons
    document.getElementById('backBtn')?.addEventListener('click', () => {
        showPage('home');
    });
    
    document.getElementById('participantsBackBtn')?.addEventListener('click', () => {
        showPage('dashboard');
    });
    
    // Create event button
    document.getElementById('createEventBtn')?.addEventListener('click', () => {
        showPage('createEvent');
    });
    
    document.getElementById('closeCreateBtn')?.addEventListener('click', () => {
        showPage('home');
    });
    
    // Category buttons in create form
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
    
    // Image upload
    document.getElementById('imageUpload')?.addEventListener('click', () => {
        document.getElementById('bannerInput')?.click();
    });
    
    document.getElementById('bannerInput')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('imageUpload').innerHTML = `
                    <img src="${event.target.result}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px;">
                `;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Modal
    document.getElementById('closeModal')?.addEventListener('click', closeRegistrationModal);
    
    document.getElementById('registrationModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'registrationModal') {
            closeRegistrationModal();
        }
    });
    
    // Registration form
    document.getElementById('registrationForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show success message
        const modal = document.getElementById('registrationModal');
        modal.querySelector('.modal-content').innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="width: 80px; height: 80px; background: var(--success); border-radius: 50%; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h2 style="margin-bottom: 1rem;">Registration Successful!</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">You're all set for ${currentEvent?.title}. Check your email for confirmation.</p>
                <button onclick="closeRegistrationModal()" class="confirm-btn">Done</button>
            </div>
        `;
        
        setTimeout(() => {
            closeRegistrationModal();
            // Reset modal content
            setTimeout(() => {
                location.reload();
            }, 300);
        }, 2000);
    });
    
    // Create event form
    document.getElementById('createEventForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show success and redirect
        alert('Event created successfully!');
        showPage('dashboard');
    });
    
    // Search functionality
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        // Implement search filtering
        console.log('Searching for:', query);
    });
    
    document.getElementById('participantSearch')?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = participantsData.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.department.toLowerCase().includes(query) ||
            p.studentId.toLowerCase().includes(query)
        );
        
        const container = document.getElementById('participantsList');
        container.innerHTML = filtered.map(participant => `
            <div class="participant-card">
                <div class="participant-avatar">
                    <img src="${generateAvatar(participant.avatar)}" alt="${participant.name}">
                    ${participant.checkedIn ? `
                        <div class="verified-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    ` : ''}
                </div>
                <div class="participant-info">
                    <div class="participant-name">${participant.name}</div>
                    <div class="participant-details">${participant.department} • ${participant.year}</div>
                    <div class="participant-time">${participant.registrationTime}</div>
                </div>
                <div style="text-align: right;">
                    <div class="check-in-toggle ${participant.checkedIn ? 'checked' : ''}" onclick="toggleCheckIn(${participant.id})">
                        <div class="toggle-slider"></div>
                    </div>
                    <div class="check-in-status ${participant.checkedIn ? 'checked-in' : 'pending'}">
                        ${participant.checkedIn ? 'Checked In' : 'Pending'}
                    </div>
                </div>
            </div>
        `).join('');
    });
    
    // Export CSV
    document.querySelector('.export-btn')?.addEventListener('click', () => {
        const csv = [
            ['Name', 'Student ID', 'Department', 'Year', 'Registration Time', 'Check-in Status'],
            ...participantsData.map(p => [
                p.name,
                p.studentId,
                p.department,
                p.year,
                p.registrationTime,
                p.checkedIn ? 'Checked In' : 'Pending'
            ])
        ].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'participants.csv';
        a.click();
    });
});

// Make functions globally available
window.showEventDetails = showEventDetails;
window.openRegistrationModal = openRegistrationModal;
window.closeRegistrationModal = closeRegistrationModal;
window.showParticipants = showParticipants;
window.toggleCheckIn = toggleCheckIn;
