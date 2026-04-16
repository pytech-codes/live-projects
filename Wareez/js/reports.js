// Reports and Analytics JavaScript
let currentPeriod = 'all';

// Initialize reports page
document.addEventListener('DOMContentLoaded', function() {
    loadReportsData();
    setupCharts();
});

// Load reports data
function loadReportsData() {
    updateOverviewStats();
    renderCategories();
    renderTopEvents();
    renderActivityTimeline();
}

// Update overview statistics
function updateOverviewStats() {
    const events = getAllEvents();
    const participants = getAllParticipants();
    
    // Filter events based on selected period
    const filteredEvents = filterEventsByPeriod(events);
    const filteredParticipants = filterParticipantsByPeriod(participants);
    
    // Calculate statistics
    const totalEvents = filteredEvents.length;
    const totalParticipants = filteredParticipants.length;
    const avgAttendance = calculateAverageAttendance(filteredEvents);
    const successRate = calculateSuccessRate(filteredEvents);
    
    // Update DOM
    document.getElementById('totalEvents').textContent = totalEvents;
    document.getElementById('totalParticipants').textContent = totalParticipants;
    document.getElementById('avgAttendance').textContent = avgAttendance + '%';
    document.getElementById('successRate').textContent = successRate + '%';
    
    // Calculate and display changes (mock data for demonstration)
    updateChangeIndicators();
}

// Filter events by period
function filterEventsByPeriod(events) {
    if (currentPeriod === 'all') return events;
    
    const days = parseInt(currentPeriod);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return events.filter(event => new Date(event.eventDate) >= cutoffDate);
}

// Filter participants by period
function filterParticipantsByPeriod(participants) {
    if (currentPeriod === 'all') return participants;
    
    const days = parseInt(currentPeriod);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return participants.filter(participant => new Date(participant.registeredAt) >= cutoffDate);
}

// Calculate average attendance
function calculateAverageAttendance(events) {
    if (events.length === 0) return 0;
    
    let totalAttendanceRate = 0;
    let eventsWithParticipants = 0;
    
    events.forEach(event => {
        const participants = getParticipantsByEvent(event.id);
        if (participants.length > 0) {
            const attendanceRate = event.maxParticipants 
                ? (participants.length / event.maxParticipants) * 100 
                : 100; // Assume 100% for events without max capacity
            totalAttendanceRate += attendanceRate;
            eventsWithParticipants++;
        }
    });
    
    return eventsWithParticipants > 0 ? Math.round(totalAttendanceRate / eventsWithParticipants) : 0;
}

// Calculate success rate
function calculateSuccessRate(events) {
    if (events.length === 0) return 0;
    
    let successfulEvents = 0;
    
    events.forEach(event => {
        const participants = getParticipantsByEvent(event.id);
        const attendanceRate = event.maxParticipants 
            ? (participants.length / event.maxParticipants) * 100 
            : 100;
        
        // Consider event successful if attendance rate is 50% or higher
        if (attendanceRate >= 50) {
            successfulEvents++;
        }
    });
    
    return Math.round((successfulEvents / events.length) * 100);
}

// Update change indicators (mock data)
function updateChangeIndicators() {
    // In a real application, this would compare with previous period
    document.getElementById('eventsChange').textContent = '+12%';
    document.getElementById('participantsChange').textContent = '+8%';
    document.getElementById('attendanceChange').textContent = '+5%';
    document.getElementById('successChange').textContent = '+3%';
}

// Setup charts
function setupCharts() {
    drawEventsChart();
    drawParticipationChart();
}

// Draw events over time chart
function drawEventsChart() {
    const canvas = document.getElementById('eventsCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const events = getAllEvents();
    const filteredEvents = filterEventsByPeriod(events);
    
    // Group events by month
    const monthlyData = groupEventsByMonth(filteredEvents);
    
    // Simple bar chart implementation
    drawBarChart(ctx, monthlyData, 'Events');
}

// Draw participation trends chart
function drawParticipationChart() {
    const canvas = document.getElementById('participationCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const participants = getAllParticipants();
    const filteredParticipants = filterParticipantsByPeriod(participants);
    
    // Group participants by month
    const monthlyData = groupParticipantsByMonth(filteredParticipants);
    
    // Simple line chart implementation
    drawLineChart(ctx, monthlyData, 'Participants');
}

// Group events by month
function groupEventsByMonth(events) {
    const monthlyData = {};
    
    events.forEach(event => {
        const month = new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthlyData[month] = (monthlyData[month] || 0) + 1;
    });
    
    return monthlyData;
}

// Group participants by month
function groupParticipantsByMonth(participants) {
    const monthlyData = {};
    
    participants.forEach(participant => {
        const month = new Date(participant.registeredAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthlyData[month] = (monthlyData[month] || 0) + 1;
    });
    
    return monthlyData;
}

// Simple bar chart implementation
function drawBarChart(ctx, data, label) {
    const canvas = ctx.canvas;
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    ctx.clearRect(0, 0, width, height);
    
    const months = Object.keys(data);
    const values = Object.values(data);
    const maxValue = Math.max(...values, 1);
    
    const barWidth = (width - 60) / months.length - 10;
    const chartHeight = height - 60;
    
    months.forEach((month, index) => {
        const barHeight = (values[index] / maxValue) * chartHeight;
        const x = 30 + index * (barWidth + 10);
        const y = height - 30 - barHeight;
        
        // Draw bar
        ctx.fillStyle = '#3498db';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw value
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(values[index], x + barWidth / 2, y - 5);
        
        // Draw month label
        ctx.save();
        ctx.translate(x + barWidth / 2, height - 10);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(month, 0, 0);
        ctx.restore();
    });
}

// Simple line chart implementation
function drawLineChart(ctx, data, label) {
    const canvas = ctx.canvas;
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    ctx.clearRect(0, 0, width, height);
    
    const months = Object.keys(data);
    const values = Object.values(data);
    const maxValue = Math.max(...values, 1);
    
    const pointSpacing = (width - 60) / (months.length - 1);
    const chartHeight = height - 60;
    
    // Draw line
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    months.forEach((month, index) => {
        const x = 30 + index * pointSpacing;
        const y = height - 30 - (values[index] / maxValue) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw points and labels
    months.forEach((month, index) => {
        const x = 30 + index * pointSpacing;
        const y = height - 30 - (values[index] / maxValue) * chartHeight;
        
        // Draw point
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw value
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(values[index], x, y - 10);
        
        // Draw month label
        ctx.save();
        ctx.translate(x, height - 10);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(month, 0, 0);
        ctx.restore();
    });
}

// Render event categories
function renderCategories() {
    const events = getAllEvents();
    const categories = {};
    
    events.forEach(event => {
        const category = event.eventCategory || 'other';
        categories[category] = (categories[category] || 0) + 1;
    });
    
    const categoriesGrid = document.getElementById('categoriesGrid');
    
    if (Object.keys(categories).length === 0) {
        categoriesGrid.innerHTML = `
            <div class="empty-state">
                <p>No event categories found</p>
            </div>
        `;
        return;
    }
    
    const totalEvents = events.length;
    const categoryIcons = {
        conference: '🎯',
        workshop: '🛠️',
        seminar: '📚',
        networking: '🤝',
        other: '📌'
    };
    
    categoriesGrid.innerHTML = Object.entries(categories).map(([category, count]) => {
        const percentage = Math.round((count / totalEvents) * 100);
        return `
            <div class="category-card">
                <div class="category-icon">${categoryIcons[category] || '📌'}</div>
                <div class="category-name">${category.charAt(0).toUpperCase() + category.slice(1)}</div>
                <div class="category-count">${count}</div>
                <div class="category-percentage">${percentage}% of events</div>
            </div>
        `;
    }).join('');
}

// Render top events table
function renderTopEvents() {
    const events = getAllEvents();
    const eventsWithStats = events.map(event => {
        const participants = getParticipantsByEvent(event.id);
        const attendanceRate = event.maxParticipants 
            ? Math.round((participants.length / event.maxParticipants) * 100)
            : 100;
        
        return {
            ...event,
            participantCount: participants.length,
            attendanceRate
        };
    });
    
    // Sort by attendance rate
    eventsWithStats.sort((a, b) => b.attendanceRate - a.attendanceRate);
    
    const topEventsTable = document.getElementById('topEventsTable');
    
    if (eventsWithStats.length === 0) {
        topEventsTable.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    No events found
                </td>
            </tr>
        `;
        return;
    }
    
    topEventsTable.innerHTML = eventsWithStats.slice(0, 10).map(event => {
        const attendanceClass = event.attendanceRate >= 75 ? 'high' : 
                               event.attendanceRate >= 50 ? 'medium' : 'low';
        
        return `
            <tr>
                <td>${event.eventName}</td>
                <td>${formatDate(new Date(event.eventDate))}</td>
                <td>${event.participantCount}</td>
                <td>${event.maxParticipants || 'Unlimited'}</td>
                <td><span class="attendance-rate ${attendanceClass}">${event.attendanceRate}%</span></td>
                <td>${event.eventCategory || 'General'}</td>
            </tr>
        `;
    }).join('');
}

// Render activity timeline
function renderActivityTimeline() {
    const events = getAllEvents();
    const participants = getAllParticipants();
    
    // Create activity items
    const activities = [];
    
    // Add event creation activities
    events.forEach(event => {
        activities.push({
            type: 'event',
            icon: '📅',
            title: `Event Created: ${event.eventName}`,
            description: `Scheduled for ${formatDate(new Date(event.eventDate))}`,
            timestamp: event.createdAt
        });
    });
    
    // Add participant registration activities
    participants.forEach(participant => {
        const event = getEvent(participant.eventId);
        activities.push({
            type: 'registration',
            icon: '👤',
            title: `${participant.name} Registered`,
            description: `Registered for ${event ? event.eventName : 'Unknown Event'}`,
            timestamp: participant.registeredAt
        });
    });
    
    // Sort by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    const activityTimeline = document.getElementById('activityTimeline');
    
    if (activities.length === 0) {
        activityTimeline.innerHTML = `
            <div class="empty-state">
                <p>No recent activity</p>
            </div>
        `;
        return;
    }
    
    activityTimeline.innerHTML = activities.slice(0, 20).map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">${formatRelativeTime(new Date(activity.timestamp))}</div>
            </div>
        </div>
    `).join('');
}

// Update reports based on selected period
function updateReports() {
    currentPeriod = document.getElementById('reportPeriod').value;
    loadReportsData();
    setupCharts();
}

// Export reports
function exportReports() {
    const events = getAllEvents();
    const participants = getAllParticipants();
    
    // Create CSV content
    const csvContent = generateCSVReport(events, participants);
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showMessage('Report exported successfully!', 'success');
}

// Generate CSV report
function generateCSVReport(events, participants) {
    let csv = 'Event Report\n';
    csv += 'Generated:,' + new Date().toLocaleString() + '\n\n';
    
    // Events summary
    csv += 'Events Summary\n';
    csv += 'Event Name,Date,Location,Category,Participants,Max Capacity,Attendance Rate\n';
    
    events.forEach(event => {
        const eventParticipants = getParticipantsByEvent(event.id);
        const attendanceRate = event.maxParticipants 
            ? Math.round((eventParticipants.length / event.maxParticipants) * 100)
            : 100;
        
        csv += `"${event.eventName}","${formatDate(new Date(event.eventDate))}","${event.eventLocation}","${event.eventCategory || 'General'}",${eventParticipants.length},${event.maxParticipants || 'Unlimited'},${attendanceRate}%\n`;
    });
    
    csv += '\nParticipants Summary\n';
    csv += 'Name,Email,Phone,Event,Registration Date\n';
    
    participants.forEach(participant => {
        const event = getEvent(participant.eventId);
        csv += `"${participant.name}","${participant.email}","${participant.phone || ''}","${event ? event.eventName : 'Unknown'}","${formatDate(new Date(participant.registeredAt))}"\n`;
    });
    
    return csv;
}

// Utility function to format relative time
function formatRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) {
        return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hours ago`;
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}
