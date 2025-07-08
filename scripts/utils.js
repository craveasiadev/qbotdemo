// Utility Functions
class Utils {
    // Format date for display
    static formatDate(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Format time for display
    static formatTime(time) {
        if (typeof time === 'string' && time.includes(':')) {
            const [hours, minutes] = time.split(':');
            const hour12 = parseInt(hours) % 12 || 12;
            const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
            return `${hour12}:${minutes} ${ampm}`;
        }
        return time;
    }

    // Format currency
    static formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    // Validate email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate phone
    static isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    // Generate time slots
    static generateTimeSlots(startTime, endTime, duration = 30) {
        const slots = [];
        const start = new Date(`2000-01-01T${startTime}:00`);
        const end = new Date(`2000-01-01T${endTime}:00`);
        
        let current = new Date(start);
        
        while (current < end) {
            const timeString = current.toTimeString().substr(0, 5);
            slots.push(timeString);
            current.setMinutes(current.getMinutes() + duration);
        }
        
        return slots;
    }

    // Check if time slot is available
    static isTimeSlotAvailable(date, time, staffId, bookings) {
        const dateString = date instanceof Date ? date.toISOString().split('T')[0] : date;
        return !bookings.some(booking => 
            booking.date === dateString &&
            booking.time === time &&
            booking.staffId === staffId &&
            booking.status !== 'cancelled'
        );
    }

    // Get day name from date
    static getDayName(date) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[date.getDay()];
    }

    // Check if business is open on date
    static isBusinessOpen(date, businessHours) {
        const dayName = this.getDayName(date);
        const dayHours = businessHours[dayName];
        return dayHours && dayHours.isOpen;
    }

    // Debounce function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Show notification
    static showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            color: 'white',
            fontWeight: '600',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '400px'
        });

        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Export booking data as JSON
    static exportBookingData(bookingData) {
        return {
            booking: {
                id: bookingData.id,
                businessId: bookingData.businessId,
                businessName: bookingData.businessName,
                date: bookingData.date,
                time: bookingData.time,
                services: bookingData.services,
                staff: bookingData.staff,
                location: bookingData.location,
                customer: bookingData.customer,
                totalCost: bookingData.totalCost,
                status: bookingData.status || 'confirmed',
                createdAt: bookingData.createdAt || new Date().toISOString(),
                notes: bookingData.notes || ''
            },
            metadata: {
                exportedAt: new Date().toISOString(),
                version: '1.0'
            }
        };
    }

    // Export business setup data as JSON
    static exportBusinessSetup(business) {
        return {
            business: {
                id: business.id,
                name: business.name,
                type: business.type,
                description: business.description,
                contact: {
                    phone: business.phone,
                    email: business.email,
                    website: business.website
                },
                locations: business.locations,
                serviceTypes: business.serviceTypes,
                services: business.services,
                staff: business.staff,
                businessHours: business.businessHours,
                formFields: business.formFields,
                settings: {
                    timeSlotDuration: business.timeSlotDuration,
                    createdAt: business.createdAt
                }
            },
            metadata: {
                exportedAt: new Date().toISOString(),
                version: '1.0'
            }
        };
    }

    // Download JSON data as file
    static downloadJSON(data, filename) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Get available staff for service and location
    static getAvailableStaff(business, serviceId, locationId, date, time) {
        const dateString = date instanceof Date ? date.toISOString().split('T')[0] : date;
        const dayName = this.getDayName(new Date(dateString));
        const bookings = storage.getBusinessBookings(business.id);

        return business.staff.filter(staff => {
            // Check if staff can perform the service
            if (!staff.services.includes(serviceId)) return false;
            
            // Check if staff works at the location
            if (!staff.locations.includes(locationId)) return false;
            
            // Check if staff is working on this day
            const schedule = staff.schedule[dayName];
            if (!schedule || !schedule.isWorking) return false;
            
            // Check if time is within staff working hours
            if (time < schedule.startTime || time >= schedule.endTime) return false;
            
            // Check if staff is available at this time
            return this.isTimeSlotAvailable(dateString, time, staff.id, bookings);
        });
    }

    // Calculate service end time
    static calculateEndTime(startTime, duration) {
        const [hours, minutes] = startTime.split(':').map(Number);
        const start = new Date();
        start.setHours(hours, minutes, 0, 0);
        
        const end = new Date(start.getTime() + duration * 60000);
        return end.toTimeString().substr(0, 5);
    }

    // Get business type emoji
    static getBusinessTypeEmoji(type) {
        const emojis = {
            salon: '💇',
            restaurant: '🍽️',
            clinic: '🏥',
            gym: '💪',
            spa: '🧘',
            automotive: '🚗',
            education: '📚',
            professional: '💼',
            other: '🏢'
        };
        return emojis[type] || emojis.other;
    }

    // Sanitize input for security
    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    // Generate booking confirmation number
    static generateConfirmationNumber() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}

// Make Utils available globally
window.Utils = Utils;