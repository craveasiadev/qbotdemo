// Calendar Management
class Calendar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentDate = new Date();
        this.selectedDate = null;
        this.business = null;
        this.filters = {};
        this.onDateSelect = null; // Callback for when a date is selected
        this.bookings = []; // This would typically be fetched based on selected date/business
    }

    // Initialize calendar
    init(business, filters = {}) {
        this.business = business;
        this.filters = filters;
        // In a real app, you'd fetch bookings specific to this business/filters
        // this.bookings = storage.getBusinessBookings(business.id);
        this.render();
        this.bindEvents();
    }

    // Set date selection callback
    setDateSelectCallback(callback) {
        this.onDateSelect = callback;
    }

    // Render calendar
    render() {
        if (!this.container) return;

        const calendarHTML = this.generateCalendarHTML();
        this.container.innerHTML = calendarHTML;
    }

    // Generate calendar HTML
    generateCalendarHTML() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        let html = '';

        // Day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });

        // Previous month days
        const prevMonthDate = new Date(year, month, 0);
        const prevMonthDays = prevMonthDate.getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            // The date string for "other-month" days should reflect their actual month for accurate date objects
            const prevMonthYear = (month === 0) ? year - 1 : year;
            const prevMonthNum = (month === 0) ? 12 : month;
            html += `<div class="calendar-day other-month" data-date="${prevMonthYear}-${String(prevMonthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}">${day}</div>`;
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            // Format date string for consistency. Month is 0-indexed in JS Date, so add 1 for display.
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = this.isToday(date);
            // Check if this day was previously selected and is in the current month
            const isSelected = this.selectedDate && this.selectedDate === dateString;
            const hasAvailability = this.hasAvailability(date); // Check for overall day availability
            const isBusinessOpen = this.isBusinessOpen(date);

            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (isSelected) classes += ' selected';
            if (hasAvailability && isBusinessOpen) classes += ' has-availability';
            if (!isBusinessOpen) classes += ' closed'; // If business is closed, explicitly mark it

            html += `<div class="${classes}" data-date="${dateString}">${day}</div>`;
        }

        // Next month days to fill the grid
        // Calculate how many cells are needed to fill the last row of the calendar grid
        const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;
        const remainingCells = totalCells - (daysInMonth + startingDayOfWeek);

        for (let day = 1; day <= remainingCells; day++) {
            const nextMonth = month + 2; // Date month is 0-indexed. current month + 1 is next calendar month.
            const nextYear = nextMonth > 12 ? year + 1 : year;
            const nextMonthIndex = nextMonth > 12 ? 1 : nextMonth;
            html += `<div class="calendar-day other-month" data-date="${nextYear}-${String(nextMonthIndex).padStart(2, '0')}-${String(day).padStart(2, '0')}">${day}</div>`;
        }

        return html;
    }

    // Check if date is today
    isToday(date) {
        const today = new Date();
        // Use the context's current date (July 7, 2025) for "today"
        const contextToday = new Date('2025-07-07T00:00:00'); // Assuming current date is July 7, 2025
        return date.toDateString() === contextToday.toDateString();
    }

    // Check if business is open on date (dummy logic for this demo)
    isBusinessOpen(date) {
        // In a real app, this would check business.businessHours for the specific day.
        // For this demo, let's assume the business is always open unless it's a hardcoded closed day.
        // Use the context's current date to ensure today is open.
        const dayOfWeek = date.getDay(); // 0 for Sunday, 6 for Saturday

        // Current date is July 7, 2025, which is a Monday.
        // Let's make Sundays closed for demo.
        if (dayOfWeek === 0) { // Sunday
            return false;
        }
        return true; // All other days are open for demo
    }

    // Check if date has availability (dummy logic modified to usually be available)
    hasAvailability(date) {
        // Current date is Monday, July 7, 2025.
        // Let's ensure today and most weekdays are available.
        const today = new Date('2025-07-07T00:00:00'); // Consistent 'today'
        const dayOfWeek = date.getDay(); // 0 for Sunday, 6 for Saturday

        if (date.toDateString() === today.toDateString()) {
            return true; // Today (July 7, 2025) is definitely available
        }
        
        if (dayOfWeek === 0) { // Sunday
            return false; // Sundays are always closed
        }
        
        // For other days, make them mostly available, but some random unavailability for visual variety
        return Math.random() > 0.1; // 90% chance of being available
    }

    // Bind calendar events
    bindEvents() {
        // Remove old listener to prevent duplicates after re-rendering
        if (this._boundDayClickHandler) {
            this.container.removeEventListener('click', this._boundDayClickHandler);
        }
        
        // Create and store new bound function for the click event
        this._boundDayClickHandler = (e) => {
            const target = e.target.closest('.calendar-day'); // Use closest to handle clicks on children of .calendar-day
            if (target && !target.classList.contains('other-month')) {
                const dateString = target.dataset.date;
                const date = new Date(dateString);

                // Check availability first. If no availability or closed, show notification.
                if (!this.isBusinessOpen(date) || !this.hasAvailability(date)) {
                    const message = this.isBusinessOpen(date) ? 'No availability on this date. Please try another day.' : 'Sorry, we are closed on this day.';
                    if (typeof Utils !== 'undefined' && typeof Utils.showNotification === 'function') {
                        Utils.showNotification(message, 'warning');
                    } else {
                        alert(message);
                    }
                    return;
                }

                // Update selected date visually
                this.selectedDate = dateString;
                this.updateSelectedDate();

                // Trigger callback with selected date
                if (this.onDateSelect) {
                    this.onDateSelect(dateString, date);
                }
            }
        };
        this.container.addEventListener('click', this._boundDayClickHandler); // Attach the new listener

        // Bind navigation buttons as well
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');
        // Ensure to remove old listeners before adding new ones
        if (prevBtn) {
            prevBtn.onclick = null; // Clear existing onclick
            prevBtn.onclick = () => { this.previousMonth(); document.getElementById('calendar-title').textContent = this.getDisplayTitle(); };
        }
        if (nextBtn) {
            nextBtn.onclick = null; // Clear existing onclick
            nextBtn.onclick = () => { this.nextMonth(); document.getElementById('calendar-title').textContent = this.getDisplayTitle(); };
        }
    }

    // Update selected date visual state
    updateSelectedDate() {
        this.container.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });

        const selectedElement = this.container.querySelector(`[data-date="${this.selectedDate}"]`);
        if (selectedElement) {
            selectedElement.classList.add('selected');
        }
    }

    // Navigate to previous month
    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
        this.bindEvents(); // Rebind events after re-rendering
    }

    // Navigate to next month
    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
        this.bindEvents(); // Rebind events after re-rendering
    }

    // Update filters and re-render
    updateFilters(filters) {
        this.filters = { ...this.filters, ...filters };
        this.render();
        this.bindEvents();
    }

    // Get current month/year display
    getDisplayTitle() {
        return this.currentDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    }
}

// Make Calendar class globally available
window.Calendar = Calendar;

// Ensure these are globally accessible for main.js and other scripts
window.currentSelectedDate = null;
window.currentSelectedTime = null;
window.selectedBookingDetails = {};