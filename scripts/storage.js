// Local Storage Managemen

class StorageManager {
    constructor() {
        this.keys = {
            businesses: 'bookeasy_businesses',
            currentUser: 'bookeasy_current_user',
            bookings: 'bookeasy_bookings'
        };
    }

    // Get data from localStorage
    get(key) {
        try {
            const data = localStorage.getItem(this.keys[key] || key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting data from storage:', error);
            return null;
        }
    }

    // Set data to localStorage
    set(key, value) {
        try {
            localStorage.setItem(this.keys[key] || key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error setting data to storage:', error);
            return false;
        }
    }

    // Remove data from localStorage
    remove(key) {
        try {
            localStorage.removeItem(this.keys[key] || key);
            return true;
        } catch (error) {
            console.error('Error removing data from storage:', error);
            return false;
        }
    }

    // Clear all app data
    clearAll() {
        Object.values(this.keys).forEach(key => {
            localStorage.removeItem(key);
        });
    }

    // Get all businesses
    getBusinesses() {
        return this.get('businesses') || [];
    }

    // Save business
    saveBusiness(business) {
        const businesses = this.getBusinesses();
        const existingIndex = businesses.findIndex(b => b.id === business.id);
        
        if (existingIndex >= 0) {
            businesses[existingIndex] = business;
        } else {
            businesses.push(business);
        }
        
        return this.set('businesses', businesses);
    }

    // Get business by ID
    getBusinessById(id) {
        const businesses = this.getBusinesses();
        return businesses.find(b => b.id === id);
    }

    // Get current user
    getCurrentUser() {
        return this.get('currentUser');
    }

    // Set current user
    setCurrentUser(user) {
        return this.set('currentUser', user);
    }

    // Get all bookings
    getBookings() {
        return this.get('bookings') || [];
    }

    // Save booking
    saveBooking(booking) {
        const bookings = this.getBookings();
        booking.id = this.generateId();
        booking.createdAt = new Date().toISOString();
        bookings.push(booking);
        return this.set('bookings', bookings);
    }

    // Get bookings for business
    getBusinessBookings(businessId) {
        const bookings = this.getBookings();
        return bookings.filter(b => b.businessId === businessId);
    }

    // Generate unique ID
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    // Initialize default data - GYM ONLY
    initializeDefaultData() {
        const businesses = this.getBusinesses();
        if (businesses.length === 0) {
            const gymBusiness = {
                id: this.generateId(),
                name: "FitLife Gym",
                type: "gym",
                description: "Modern fitness center with personal training and group classes",
                phone: "(555) 456-7890",
                email: "info@fitlifegym.com",
                website: "https://fitlifegym.com",
                owner: {
                    email: "owner@fitlifegym.com",
                    password: "password123",
                    firstName: "Mike",
                    lastName: "Thompson"
                },
                locations: [
                    {
                        id: this.generateId(),
                        name: "Main Gym",
                        address: "321 Fitness Ave, City 12348",
                        phone: "(555) 456-7890"
                    },
                    {
                        id: this.generateId(),
                        name: "West Branch",
                        address: "654 West St, City 12349",
                        phone: "(555) 456-7891"
                    }
                ],
                serviceTypes: [
                    {
                        id: this.generateId(),
                        name: "Personal Training",
                        description: "One-on-one fitness training sessions"
                    },
                    {
                        id: this.generateId(),
                        name: "Group Classes",
                        description: "Group fitness classes and programs"
                    }
                ],
                services: [
                    {
                        id: this.generateId(),
                        name: "Personal Training Session",
                        description: "1-on-1 personal training with certified trainer",
                        duration: 60,
                        price: 80,
                        serviceTypeId: null
                    },
                    {
                        id: this.generateId(),
                        name: "Nutrition Consultation",
                        description: "Personalized nutrition planning session",
                        duration: 30,
                        price: 60,
                        serviceTypeId: null
                    },
                    {
                        id: this.generateId(),
                        name: "Yoga Class",
                        description: "Group yoga session",
                        duration: 60,
                        price: 25,
                        serviceTypeId: null
                    },
                    {
                        id: this.generateId(),
                        name: "HIIT Class",
                        description: "High-intensity interval training",
                        duration: 45,
                        price: 30,
                        serviceTypeId: null
                    }
                ],
                staff: [
                    {
                        id: this.generateId(),
                        name: "Alex Rodriguez",
                        email: "alex@fitlifegym.com",
                        phone: "(555) 456-7892",
                        services: [],
                        locations: [],
                        schedule: {
                            monday: { isWorking: true, startTime: "06:00", endTime: "14:00" },
                            tuesday: { isWorking: true, startTime: "06:00", endTime: "14:00" },
                            wednesday: { isWorking: true, startTime: "06:00", endTime: "14:00" },
                            thursday: { isWorking: true, startTime: "06:00", endTime: "14:00" },
                            friday: { isWorking: true, startTime: "06:00", endTime: "14:00" },
                            saturday: { isWorking: true, startTime: "08:00", endTime: "16:00" },
                            sunday: { isWorking: false, startTime: "", endTime: "" }
                        }
                    }
                ],
                personalTrainers: [
                    {
                        id: this.generateId(),
                        name: "Sarah Wilson",
                        email: "sarah@fitlifegym.com",
                        phone: "(555) 456-7893",
                        specialization: "Weight Training & Cardio",
                        services: [],
                        locations: [],
                        schedule: {
                            monday: { isWorking: true, startTime: "14:00", endTime: "22:00" },
                            tuesday: { isWorking: true, startTime: "14:00", endTime: "22:00" },
                            wednesday: { isWorking: true, startTime: "14:00", endTime: "22:00" },
                            thursday: { isWorking: true, startTime: "14:00", endTime: "22:00" },
                            friday: { isWorking: true, startTime: "14:00", endTime: "22:00" },
                            saturday: { isWorking: true, startTime: "10:00", endTime: "18:00" },
                            sunday: { isWorking: true, startTime: "10:00", endTime: "18:00" }
                        }
                    },
                    {
                        id: this.generateId(),
                        name: "David Chen",
                        email: "david@fitlifegym.com",
                        phone: "(555) 456-7894",
                        specialization: "Yoga & Flexibility",
                        services: [],
                        locations: [],
                        schedule: {
                            monday: { isWorking: true, startTime: "06:00", endTime: "14:00" },
                            tuesday: { isWorking: true, startTime: "06:00", endTime: "14:00" },
                            wednesday: { isWorking: true, startTime: "06:00", endTime: "14:00" },
                            thursday: { isWorking: true, startTime: "06:00", endTime: "14:00" },
                            friday: { isWorking: true, startTime: "06:00", endTime: "14:00" },
                            saturday: { isWorking: false, startTime: "", endTime: "" },
                            sunday: { isWorking: true, startTime: "08:00", endTime: "16:00" }
                        }
                    }
                ],
                classes: [
                    {
                        id: this.generateId(),
                        name: "Morning Yoga",
                        description: "Relaxing yoga session to start your day",
                        locationId: null, // Will be set properly
                        instructorId: null, // Will be set properly
                        serviceId: null, // Will be set properly
                        duration: 60,
                        price: 25,
                        maxParticipants: 15,
                        schedule: "Mon/Wed/Fri 7:00 AM"
                    },
                    {
                        id: this.generateId(),
                        name: "HIIT Training",
                        description: "High-intensity interval training class",
                        locationId: null,
                        instructorId: null,
                        serviceId: null,
                        duration: 45,
                        price: 30,
                        maxParticipants: 12,
                        schedule: "Tue/Thu 6:00 PM"
                    }
                ],
                formFields: [
                    { type: 'text', label: 'First Name', required: true },
                    { type: 'text', label: 'Last Name', required: true },
                    { type: 'email', label: 'Email', required: true },
                    { type: 'tel', label: 'Phone', required: true },
                    { type: 'text', label: 'Emergency Contact', required: false },
                    { type: 'textarea', label: 'Health Conditions', required: false }
                ],
                businessHours: {
                    monday: { isOpen: true, startTime: "05:00", endTime: "23:00" },
                    tuesday: { isOpen: true, startTime: "05:00", endTime: "23:00" },
                    wednesday: { isOpen: true, startTime: "05:00", endTime: "23:00" },
                    thursday: { isOpen: true, startTime: "05:00", endTime: "23:00" },
                    friday: { isOpen: true, startTime: "05:00", endTime: "23:00" },
                    saturday: { isOpen: true, startTime: "06:00", endTime: "22:00" },
                    sunday: { isOpen: true, startTime: "07:00", endTime: "21:00" }
                },
                timeSlotDuration: 30,
                createdAt: new Date().toISOString()
            };

            // Set proper relationships
            // Link services to service types
            gymBusiness.services.forEach((service, index) => {
                service.serviceTypeId = gymBusiness.serviceTypes[index % gymBusiness.serviceTypes.length].id;
            });

            // Link staff to all services and locations
            gymBusiness.staff.forEach(staff => {
                staff.services = gymBusiness.services.map(s => s.id);
                staff.locations = gymBusiness.locations.map(l => l.id);
            });

            // Link personal trainers to services and locations
            gymBusiness.personalTrainers.forEach(trainer => {
                trainer.services = gymBusiness.services.filter(s => s.serviceTypeId === gymBusiness.serviceTypes[0].id).map(s => s.id);
                trainer.locations = gymBusiness.locations.map(l => l.id);
            });

            // Link classes to locations, instructors, and services
            gymBusiness.classes.forEach((classItem, index) => {
                classItem.locationId = gymBusiness.locations[index % gymBusiness.locations.length].id;
                classItem.instructorId = gymBusiness.personalTrainers[index % gymBusiness.personalTrainers.length].id;
                classItem.serviceId = gymBusiness.services.filter(s => s.serviceTypeId === gymBusiness.serviceTypes[1].id)[index % 2].id;
            });

            this.set('businesses', [gymBusiness]);
        }
    }
}

// Create global instance
window.storage = new StorageManager();
window.storage.initializeDefaultData();