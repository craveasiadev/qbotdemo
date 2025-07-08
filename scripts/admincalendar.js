// Calendar functionality
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.currentView = 'month';
        this.bookings = this.generateDummyBookings();
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        // View toggle buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.render();
            });
        });

        // Navigation buttons
        document.getElementById('prev-btn').addEventListener('click', () => {
            this.navigateDate(-1);
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.navigateDate(1);
        });

        document.getElementById('today-btn').addEventListener('click', () => {
            this.currentDate = new Date();
            this.render();
        });
    }

    generateDummyBookings() {
        const bookings = [];
        const customers = ['John Smith', 'Maria Garcia', 'Robert Johnson', 'Lisa Brown', 'Michael Davis', 'Jennifer Wilson', 'David Miller', 'Sarah Jones'];
        const trainers = ['Sarah Johnson', 'Mike Chen', 'Emily Rodriguez', 'David Thompson'];
        const services = ['Personal Training', 'HIIT Class', 'Yoga Class', 'Strength Training', 'Cardio Session', 'Pilates'];
        const statuses = ['confirmed', 'pending', 'completed', 'cancelled'];

        // Generate bookings for the current month
        const startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            // Skip some days randomly
            if (Math.random() > 0.7) continue;

            // Add 1-3 bookings per day
            const bookingsPerDay = Math.floor(Math.random() * 3) + 1;
            
            for (let i = 0; i < bookingsPerDay; i++) {
                const hour = 8 + Math.floor(Math.random() * 10); // 8 AM to 6 PM
                const minute = Math.random() > 0.5 ? 0 : 30;
                
                bookings.push({
                    id: `booking-${d.getTime()}-${i}`,
                    date: new Date(d),
                    time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
                    customer: customers[Math.floor(Math.random() * customers.length)],
                    trainer: trainers[Math.floor(Math.random() * trainers.length)],
                    service: services[Math.floor(Math.random() * services.length)],
                    status: statuses[Math.floor(Math.random() * statuses.length)],
                    duration: [30, 45, 60, 90][Math.floor(Math.random() * 4)]
                });
            }
        }

        return bookings;
    }

    navigateDate(direction) {
        switch (this.currentView) {
            case 'month':
                this.currentDate.setMonth(this.currentDate.getMonth() + direction);
                break;
            case 'week':
                this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
                break;
            case 'day':
                this.currentDate.setDate(this.currentDate.getDate() + direction);
                break;
        }
        this.render();
    }

    render() {
        this.updateTitle();
        this.showCurrentView();
        
        switch (this.currentView) {
            case 'month':
                this.renderMonthView();
                break;
            case 'week':
                this.renderWeekView();
                break;
            case 'day':
                this.renderDayView();
                break;
        }
    }

    updateTitle() {
        const title = document.getElementById('calendar-title');
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        switch (this.currentView) {
            case 'month':
                title.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
                break;
            case 'week':
                const weekStart = this.getWeekStart(this.currentDate);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                title.textContent = `${monthNames[weekStart.getMonth()]} ${weekStart.getDate()} - ${monthNames[weekEnd.getMonth()]} ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
                break;
            case 'day':
                title.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getDate()}, ${this.currentDate.getFullYear()}`;
                break;
        }
    }

    showCurrentView() {
        document.querySelectorAll('.calendar-view').forEach(view => view.classList.remove('active'));
        document.getElementById(`${this.currentView}-view`).classList.add('active');
    }

    renderMonthView() {
        const grid = document.querySelector('.month-grid');
        // Clear previous days, but keep day headers
        const existingDays = grid.querySelectorAll('.calendar-day');
        existingDays.forEach(day => day.remove());

        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay()); // Adjust to the first day of the week

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date for comparison

        for (let i = 0; i < 42; i++) { // Render 6 weeks (6 * 7 = 42 cells)
            const cellDate = new Date(startDate);
            cellDate.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            if (cellDate.getMonth() !== this.currentDate.getMonth()) {
                dayElement.classList.add('other-month');
            }
            
            if (cellDate.getTime() === today.getTime()) {
                dayElement.classList.add('today');
            }

            const dayBookings = this.getBookingsForDate(cellDate);
            
            dayElement.innerHTML = `
                <div class="day-number">${cellDate.getDate()}</div>
                <div class="day-events">
                    ${dayBookings.map(booking => `
                        <div class="event-item ${booking.status}" title="${booking.time} - ${booking.service} with ${booking.trainer}">
                            ${booking.time} ${booking.customer}
                        </div>
                    `).join('')}
                </div>
            `;

            grid.appendChild(dayElement);
        }
    }

    renderWeekView() {
        const container = document.querySelector('#week-view .days-container');
        container.innerHTML = '';

        const timeColumn = document.querySelector('#week-view .time-column');
        // Clear existing time slots, but keep time header
        const existingSlots = timeColumn.querySelectorAll('.time-slot');
        existingSlots.forEach(slot => slot.remove());

        // Generate time slots (8 AM to 6 PM)
        for (let hour = 8; hour < 18; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = `${hour}:00`;
            timeColumn.appendChild(timeSlot);
        }

        const weekStart = this.getWeekStart(this.currentDate);
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(weekStart);
            dayDate.setDate(weekStart.getDate() + i);

            const dayElement = document.createElement('div');
            dayElement.className = 'week-day';

            const dayBookings = this.getBookingsForDate(dayDate);

            dayElement.innerHTML = `
                <div class="week-day-header">
                    <div class="week-day-name">${dayNames[i]}</div>
                    <div class="week-day-number">${dayDate.getDate()}</div>
                </div>
                <div class="week-day-content">
                    ${Array.from({length: 10}, (_, hourIndex) => { // 10 hours from 8 AM to 5 PM
                        const currentHour = 8 + hourIndex;
                        return `
                        <div class="week-time-slot">
                            ${dayBookings.filter(booking => {
                                const bookingHour = parseInt(booking.time.split(':')[0]);
                                return bookingHour === currentHour;
                            }).map(booking => {
                                const bookingMinute = parseInt(booking.time.split(':')[1]);
                                return `
                                <div class="week-event ${booking.status}" style="top: ${bookingMinute}px; height: ${booking.duration}px;">
                                    ${booking.service}<br>
                                    <small>${booking.customer}</small>
                                </div>
                                `;
                            }).join('')}
                        </div>
                        `;
                    }).join('')}
                </div>
            `;

            container.appendChild(dayElement);
        }
    }

    renderDayView() {
        const timeColumn = document.querySelector('#day-view .time-column');
        // Clear existing time slots
        const existingSlots = timeColumn.querySelectorAll('.time-slot');
        existingSlots.forEach(slot => slot.remove());

        const dayContent = document.querySelector('#day-view .day-content');
        dayContent.innerHTML = ''; // Clear previous day events

        // Generate time slots (8 AM to 6 PM)
        for (let hour = 8; hour < 18; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = `${hour}:00`;
            timeColumn.appendChild(timeSlot);
        }

        const dayBookings = this.getBookingsForDate(this.currentDate);

        dayBookings.forEach(booking => {
            const bookingHour = parseInt(booking.time.split(':')[0]);
            const bookingMinute = parseInt(booking.time.split(':')[1]);
            const top = (bookingHour - 8) * 60 + bookingMinute; // Calculate top position in minutes

            const eventElement = document.createElement('div');
            eventElement.className = `day-event ${booking.status}`;
            eventElement.style.top = `${top}px`;
            eventElement.style.height = `${booking.duration}px`;
            eventElement.innerHTML = `
                <strong>${booking.service}</strong><br>
                ${booking.customer}<br>
                <small>with ${booking.trainer}</small>
            `;

            dayContent.appendChild(eventElement);
        });
    }

    getWeekStart(date) {
        const start = new Date(date);
        start.setDate(date.getDate() - date.getDay()); // Go back to the Sunday of the current week
        start.setHours(0, 0, 0, 0); // Normalize to start of the day
        return start;
    }

    getBookingsForDate(date) {
        return this.bookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate.getDate() === date.getDate() &&
                   bookingDate.getMonth() === date.getMonth() &&
                   bookingDate.getFullYear() === date.getFullYear();
        }).sort((a, b) => { // Sort bookings by time
            const [ha, ma] = a.time.split(':').map(Number);
            const [hb, mb] = b.time.split(':').map(Number);
            if (ha !== hb) return ha - hb;
            return ma - mb;
        });
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Corrected: Target the 'schedule' ID where your calendar lives
    if (document.getElementById('schedule')) { 
        window.calendar = new Calendar();
    }
});