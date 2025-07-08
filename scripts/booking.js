// Booking Management
class BookingManager {
    constructor() {
        this.currentBooking = {
            businessId: null,
            business: null,
            date: null,
            selectedCategory: null,
            selectedService: null,
            selectedStaff: null,
            selectedTable: null,
            selectedPax: null,
            time: null,
            services: [],
            staff: null,
            location: null,
            customer: {},
            totalCost: 0
        };
        this.calendar = null;
        this.currentStep = 'date'; // date, category, service, staff, time
        this.selectedItems = new Set(); // Track selected items in modal
    }

    // Initialize booking process
    init() {
        this.loadBusinesses();
        this.setupEventListeners();
        this.initializeCalendar();
    }

    // Load and display businesses
    loadBusinesses() {
        const businesses = storage.getBusinesses();
        const businessGrid = document.getElementById('business-grid');
        
        if (!businessGrid) return;

        if (businesses.length === 0) {
            businessGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <h3>No businesses available</h3>
                    <p>Be the first to register your business!</p>
                    <a href="register.html" class="btn primary">Register Your Business</a>
                </div>
            `;
            return;
        }

        businessGrid.innerHTML = businesses.map(business => `
            <div class="business-card" onclick="bookingManager.selectBusiness('${business.id}')">
                <h3>${Utils.sanitizeInput(business.name)}</h3>
                <p>${Utils.sanitizeInput(business.description)}</p>
                <div class="business-type">
                    ${Utils.getBusinessTypeEmoji(business.type)} ${business.type.toUpperCase()}
                </div>
            </div>
        `).join('');
    }

    // Select business and proceed to booking interface
    selectBusiness(businessId) {
        const business = storage.getBusinessById(businessId);
        if (!business) {
            Utils.showNotification('Business not found', 'error');
            return;
        }

        this.currentBooking.businessId = businessId;
        this.currentBooking.business = business;
        this.currentStep = 'date';
        
        // Update UI
        document.getElementById('current-business-name').textContent = business.name;
        document.getElementById('current-business-description').textContent = business.description;
        
        // Load filters
        this.loadFilters(business);
        
        // Initialize calendar
        this.calendar.init(business, {});
        
        // Show booking interface
        this.showStep('booking-interface');
    }

    // Load filter options
    loadFilters(business) {
        // Location filter
        const locationFilter = document.getElementById('location-filter');
        locationFilter.innerHTML = '<option value="">All Locations</option>' +
            business.locations.map(location => 
                `<option value="${location.id}">${Utils.sanitizeInput(location.name)}</option>`
            ).join('');

        // Service type filter
        const serviceTypeFilter = document.getElementById('service-type-filter');
        serviceTypeFilter.innerHTML = '<option value="">All Categories</option>' +
            business.serviceTypes.map(type => 
                `<option value="${type.id}">${Utils.sanitizeInput(type.name)}</option>`
            ).join('');

        // Service filter
        const serviceFilter = document.getElementById('service-filter');
        serviceFilter.innerHTML = '<option value="">All Services</option>' +
            business.services.map(service => 
                `<option value="${service.id}">${Utils.sanitizeInput(service.name)}</option>`
            ).join('');

        // Staff filter
        const staffFilter = document.getElementById('staff-filter');
        staffFilter.innerHTML = '<option value="">Any Available Staff</option>' +
            business.staff.map(staff => 
                `<option value="${staff.id}">${Utils.sanitizeInput(staff.name)}</option>`
            ).join('');
    }

    // Initialize calendar
    initializeCalendar() {
        this.calendar = new Calendar('calendar');
        
        // Set calendar title update
        const updateCalendarTitle = () => {
            const titleElement = document.getElementById('calendar-title');
            if (titleElement && this.calendar) {
                titleElement.textContent = this.calendar.getDisplayTitle();
            }
        };

        // Calendar navigation
        const prevButton = document.getElementById('prev-month');
        const nextButton = document.getElementById('next-month');
        
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                this.calendar.previousMonth();
                updateCalendarTitle();
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.calendar.nextMonth();
                updateCalendarTitle();
            });
        }

        // Date selection callback
        this.calendar.setDateSelectCallback((dateString, date) => {
            this.selectDate(dateString, date);
        });

        // Initial title update
        updateCalendarTitle();
    }

    // Setup event listeners
    setupEventListeners() {
        // Filter changes
        ['location-filter', 'service-type-filter', 'service-filter', 'staff-filter'].forEach(filterId => {
            const element = document.getElementById(filterId);
            if (element) {
                element.addEventListener('change', () => this.applyFilters());
            }
        });

        // Business search
        const searchInput = document.getElementById('business-search');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.searchBusinesses(e.target.value);
            }, 300));
        }
    }

    // Apply filters to calendar
    applyFilters() {
        if (!this.calendar) return;

        const filters = {
            location: document.getElementById('location-filter')?.value || null,
            serviceType: document.getElementById('service-type-filter')?.value || null,
            service: document.getElementById('service-filter')?.value || null,
            staff: document.getElementById('staff-filter')?.value || null
        };

        // Update service filter based on service type
        if (filters.serviceType) {
            this.updateServiceFilter(filters.serviceType);
        }

        this.calendar.updateFilters(filters);
    }

    // Update service filter based on service type
    updateServiceFilter(serviceTypeId) {
        const serviceFilter = document.getElementById('service-filter');
        const business = this.currentBooking.business;
        
        if (!serviceFilter || !business) return;

        const filteredServices = business.services.filter(service => 
            service.serviceTypeId === serviceTypeId
        );

        serviceFilter.innerHTML = '<option value="">All Services</option>' +
            filteredServices.map(service => 
                `<option value="${service.id}">${Utils.sanitizeInput(service.name)}</option>`
            ).join('');
    }

    // Search businesses
    searchBusinesses(query) {
        const businesses = storage.getBusinesses();
        const businessGrid = document.getElementById('business-grid');
        
        if (!businessGrid) return;

        const filteredBusinesses = businesses.filter(business =>
            business.name.toLowerCase().includes(query.toLowerCase()) ||
            business.description.toLowerCase().includes(query.toLowerCase()) ||
            business.type.toLowerCase().includes(query.toLowerCase())
        );

        businessGrid.innerHTML = filteredBusinesses.map(business => `
            <div class="business-card" onclick="bookingManager.selectBusiness('${business.id}')">
                <h3>${Utils.sanitizeInput(business.name)}</h3>
                <p>${Utils.sanitizeInput(business.description)}</p>
                <div class="business-type">
                    ${Utils.getBusinessTypeEmoji(business.type)} ${business.type.toUpperCase()}
                </div>
            </div>
        `).join('');
    }

    // Select date and start selection flow
    selectDate(dateString, date) {
        this.currentBooking.date = dateString;
        this.currentStep = 'category';
        
        // Reset selections
        this.currentBooking.selectedCategory = null;
        this.currentBooking.selectedService = null;
        this.currentBooking.selectedStaff = null;
        this.currentBooking.selectedTable = null;
        this.currentBooking.selectedPax = null;
        this.selectedItems.clear();
        
        // Show selection modal
        this.showSelectionModal();
    }

    // Show selection modal
    showSelectionModal() {
        const modal = document.getElementById('selection-modal');
        const business = this.currentBooking.business;
        
        if (!modal || !business) return;

        // Show modal
        modal.classList.add('active');
        
        // Show appropriate flow based on current step
        this.updateModalContent();
    }

    // Update modal content based on current step
    updateModalContent() {
        const titleElement = document.getElementById('modal-title');
        const contentElement = document.getElementById('modal-selection-content');
        const continueBtn = document.getElementById('modal-continue-btn');
        
        switch (this.currentStep) {
            case 'category':
                titleElement.textContent = 'Select Category';
                this.showCategorySelection(contentElement);
                continueBtn.style.display = 'none';
                break;
            case 'service':
                titleElement.textContent = 'Select Service';
                this.showServiceSelection(contentElement);
                continueBtn.style.display = 'none';
                break;
            case 'staff':
                titleElement.textContent = 'Select Staff Member';
                this.showStaffSelection(contentElement);
                continueBtn.style.display = 'none';
                break;
            case 'table':
                titleElement.textContent = 'Select Table';
                this.showTableSelection(contentElement);
                continueBtn.style.display = 'none';
                break;
            case 'pax':
                titleElement.textContent = 'Number of Guests';
                this.showPaxSelection(contentElement);
                continueBtn.style.display = 'none';
                break;
            case 'time':
                titleElement.textContent = 'Select Time';
                this.showTimeSlots(contentElement);
                continueBtn.style.display = 'none';
                break;
        }
    }

    // Show category selection
    showCategorySelection(container) {
        const business = this.currentBooking.business;
        
        container.innerHTML = `
            <div class="selection-grid">
                ${business.serviceTypes.map(category => `
                    <div class="selection-card" onclick="bookingManager.selectCategory('${category.id}')">
                        <h4>${Utils.sanitizeInput(category.name)}</h4>
                        <p>${Utils.sanitizeInput(category.description)}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Select category
    selectCategory(categoryId) {
        this.currentBooking.selectedCategory = categoryId;
        const business = this.currentBooking.business;
        
        // Determine next step based on business type
        if (business.type === 'restaurant') {
            this.currentStep = 'table';
        } else {
            this.currentStep = 'service';
        }
        
        this.updateModalContent();
    }

    // Show service selection
    showServiceSelection(container) {
        const business = this.currentBooking.business;
        const categoryId = this.currentBooking.selectedCategory;
        
        const services = business.services.filter(service => 
            service.serviceTypeId === categoryId
        );
        
        container.innerHTML = `
            <div class="selection-grid">
                ${services.map(service => `
                    <div class="selection-card" onclick="bookingManager.selectService('${service.id}')">
                        <h4>${Utils.sanitizeInput(service.name)}</h4>
                        <p>${Utils.sanitizeInput(service.description)}</p>
                        <div class="service-details">
                            <span class="service-duration">${service.duration} min</span>
                            <span class="service-price">${Utils.formatCurrency(service.price)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Select service
    selectService(serviceId) {
        this.currentBooking.selectedService = serviceId;
        this.currentStep = 'staff';
        this.updateModalContent();
    }

    // Show staff selection
    showStaffSelection(container) {
        const business = this.currentBooking.business;
        const serviceId = this.currentBooking.selectedService;
        
        // Get staff who can perform this service
        const availableStaff = business.staff.filter(staff => 
            staff.services.includes(serviceId)
        );
        
        if (availableStaff.length === 0) {
            container.innerHTML = `
                <div class="text-center">
                    <h3>No Staff Available</h3>
                    <p>No staff members are available for this service on the selected date.</p>
                    <button class="btn secondary" onclick="bookingManager.goBackToCategory()">Choose Different Service</button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="selection-grid">
                ${availableStaff.map(staff => `
                    <div class="selection-card staff-card" onclick="bookingManager.selectStaff('${staff.id}')">
                        <div class="staff-avatar">${staff.name.charAt(0).toUpperCase()}</div>
                        <h4>${Utils.sanitizeInput(staff.name)}</h4>
                        <p>Available for this service</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Select staff
    selectStaff(staffId) {
        this.currentBooking.selectedStaff = staffId;
        this.currentStep = 'time';
        this.updateModalContent();
    }

    // Show table selection (for restaurants)
    showTableSelection(container) {
        const business = this.currentBooking.business;
        const categoryId = this.currentBooking.selectedCategory;
        
        // Get tables/services for this category
        const tables = business.services.filter(service => 
            service.serviceTypeId === categoryId
        );
        
        container.innerHTML = `
            <div class="selection-grid">
                ${tables.map(table => `
                    <div class="selection-card" onclick="bookingManager.selectTable('${table.id}')">
                        <h4>${Utils.sanitizeInput(table.name)}</h4>
                        <p>${Utils.sanitizeInput(table.description)}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Select table
    selectTable(tableId) {
        this.currentBooking.selectedTable = tableId;
        this.currentStep = 'pax';
        this.updateModalContent();
    }

    // Show pax selection (for restaurants)
    showPaxSelection(container) {
        container.innerHTML = `
            <div class="pax-selection">
                ${[1,2,3,4,5,6,7,8].map(pax => `
                    <div class="pax-option" onclick="bookingManager.selectPax(${pax})">
                        ${pax} ${pax === 1 ? 'Guest' : 'Guests'}
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Select pax
    selectPax(pax) {
        this.currentBooking.selectedPax = pax;
        this.currentStep = 'time';
        this.updateModalContent();
    }

    // Show time slots
    showTimeSlots(container) {
        const timeSlots = this.getAvailableTimeSlots();
        
        if (timeSlots.length === 0) {
            container.innerHTML = `
                <div class="text-center">
                    <h3>No Available Time Slots</h3>
                    <p>No time slots are available for your selection on this date.</p>
                    <button class="btn secondary" onclick="bookingManager.goBackToStaff()">Choose Different Staff</button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="time-slots-grid">
                ${timeSlots.map(slot => `
                    <div class="time-slot" onclick="bookingManager.selectTimeSlot('${slot.time}')">
                        ${slot.display}
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Get available time slots based on current selections
    getAvailableTimeSlots() {
        const business = this.currentBooking.business;
        const date = this.currentBooking.date;
        const staffId = this.currentBooking.selectedStaff;
        
        if (!business || !date) return [];

        const dateObj = new Date(date);
        const dayName = Utils.getDayName(dateObj);
        
        // For restaurant, use business hours
        if (business.type === 'restaurant') {
            const businessHours = business.businessHours[dayName];
            if (!businessHours || !businessHours.isOpen) return [];
            
            return Utils.generateTimeSlots(
                businessHours.startTime,
                businessHours.endTime,
                business.timeSlotDuration || 30
            ).map(time => ({
                time: time,
                display: Utils.formatTime(time)
            }));
        }
        
        // For other businesses, use staff schedule
        if (!staffId) return [];
        
        const staff = business.staff.find(s => s.id === staffId);
        if (!staff) return [];
        
        const staffSchedule = staff.schedule[dayName];
        if (!staffSchedule || !staffSchedule.isWorking) return [];
        
        const bookings = storage.getBusinessBookings(business.id);
        
        return Utils.generateTimeSlots(
            staffSchedule.startTime,
            staffSchedule.endTime,
            business.timeSlotDuration || 30
        ).filter(time => {
            return Utils.isTimeSlotAvailable(date, time, staffId, bookings);
        }).map(time => ({
            time: time,
            display: Utils.formatTime(time)
        }));
    }

    // Select time slot and proceed to booking form
    selectTimeSlot(time) {
        this.currentBooking.time = time;
        
        // Close modal
        this.closeSelectionModal();
        
        // Prepare booking data
        this.prepareBookingData();
        
        // Show service selection step
        this.showStep('service-selection');
    }

    // Close selection modal
    closeSelectionModal() {
        const modal = document.getElementById('selection-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Prepare booking data based on selections
    prepareBookingData() {
        const business = this.currentBooking.business;
        
        if (business.type === 'restaurant') {
            // For restaurant, add selected table as service
            const table = business.services.find(s => s.id === this.currentBooking.selectedTable);
            if (table) {
                this.currentBooking.services = [table];
                this.currentBooking.totalCost = table.price || 0;
            }
            
            // Assign any available staff
            this.currentBooking.staff = business.staff[0] || null;
        } else {
            // For other businesses, add selected service
            const service = business.services.find(s => s.id === this.currentBooking.selectedService);
            if (service) {
                this.currentBooking.services = [service];
                this.currentBooking.totalCost = service.price || 0;
            }
            
            // Assign selected staff
            this.currentBooking.staff = business.staff.find(s => s.id === this.currentBooking.selectedStaff);
        }
        
        // Set location
        this.currentBooking.location = business.locations[0] || null;
        
        // Update UI
        this.updateServiceSummary();
    }

    // Update service selection summary
    updateServiceSummary() {
        const summaryContainer = document.getElementById('service-summary');
        const totalCostElement = document.getElementById('total-cost');
        const proceedButton = document.getElementById('proceed-btn');
        const selectedDatetime = document.getElementById('selected-datetime');
        
        if (!summaryContainer) return;

        const services = this.currentBooking.services;
        const date = new Date(this.currentBooking.date);
        
        // Update selected datetime
        if (selectedDatetime) {
            selectedDatetime.textContent = `${Utils.formatDate(date)} at ${Utils.formatTime(this.currentBooking.time)}`;
        }
        
        if (services.length === 0) {
            summaryContainer.innerHTML = '<p>No services selected</p>';
            totalCostElement.textContent = '0.00';
            proceedButton.disabled = true;
            return;
        }

        // Display selected services
        summaryContainer.innerHTML = services.map(service => `
            <div class="selected-service">
                <span>${service.name}</span>
                <span>${Utils.formatCurrency(service.price)}</span>
            </div>
        `).join('');

        totalCostElement.textContent = this.currentBooking.totalCost.toFixed(2);
        proceedButton.disabled = false;
    }

    // Navigation functions
    goBackToCategory() {
        this.currentStep = 'category';
        this.currentBooking.selectedService = null;
        this.currentBooking.selectedStaff = null;
        this.updateModalContent();
    }

    goBackToStaff() {
        this.currentStep = 'staff';
        this.updateModalContent();
    }

    // Proceed to booking form
    proceedToBookingForm() {
        if (this.currentBooking.services.length === 0) {
            Utils.showNotification('Please complete your selection', 'warning');
            return;
        }

        // Generate booking form
        this.generateBookingForm();
        
        // Show booking form
        this.showStep('booking-form');
    }

    // Generate booking form based on business form fields
    generateBookingForm() {
        const formContainer = document.getElementById('customer-form');
        if (!formContainer) return;

        const business = this.currentBooking.business;
        const formFields = business.formFields || [];

        formContainer.innerHTML = formFields.map((field, index) => `
            <div class="form-group ${field.required ? 'required' : ''}">
                <label for="field-${index}">${Utils.sanitizeInput(field.label)}</label>
                ${this.generateFormField(field, index)}
            </div>
        `).join('');
    }

    // Generate individual form field
    generateFormField(field, index) {
        const fieldId = `field-${index}`;
        const required = field.required ? 'required' : '';
        
        switch (field.type) {
            case 'textarea':
                return `<textarea id="${fieldId}" name="${field.label}" ${required} rows="3"></textarea>`;
            case 'select':
                const options = field.options || ['Option 1', 'Option 2', 'Option 3'];
                return `<select id="${fieldId}" name="${field.label}" ${required}>
                    <option value="">Select ${field.label}</option>
                    ${options.map(option => `<option value="${Utils.sanitizeInput(option)}">${Utils.sanitizeInput(option)}</option>`).join('')}
                </select>`;
            default:
                return `<input type="${field.type}" id="${fieldId}" name="${field.label}" ${required}>`;
        }
    }

    // Submit booking
    submitBooking() {
        // Collect form data
        const formData = this.collectFormData();
        if (!formData) return;

        this.currentBooking.customer = formData;

        // Create booking object
        const booking = {
            id: storage.generateId(),
            businessId: this.currentBooking.businessId,
            businessName: this.currentBooking.business.name,
            date: this.currentBooking.date,
            time: this.currentBooking.time,
            services: this.currentBooking.services,
            staff: this.currentBooking.staff,
            location: this.currentBooking.location,
            customer: this.currentBooking.customer,
            totalCost: this.currentBooking.totalCost,
            status: 'confirmed',
            confirmationNumber: Utils.generateConfirmationNumber(),
            createdAt: new Date().toISOString(),
            // Additional booking details
            selectedCategory: this.currentBooking.selectedCategory,
            selectedService: this.currentBooking.selectedService,
            selectedStaff: this.currentBooking.selectedStaff,
            selectedTable: this.currentBooking.selectedTable,
            selectedPax: this.currentBooking.selectedPax
        };

        // Save booking
        if (storage.saveBooking(booking)) {
            // Export booking data as JSON (for backend integration)
            const bookingData = Utils.exportBookingData(booking);
            console.log('Booking Data for Backend:', bookingData);
            
            // Show confirmation
            this.showConfirmation(booking);
            
            Utils.showNotification('Booking confirmed successfully!', 'success');
        } else {
            Utils.showNotification('Failed to save booking. Please try again.', 'error');
        }
    }

    // Collect form data
    collectFormData() {
        const form = document.getElementById('customer-form');
        if (!form) return null;

        const formData = {};
        const formElements = form.querySelectorAll('input, textarea, select');
        
        for (let element of formElements) {
            if (element.hasAttribute('required') && !element.value.trim()) {
                Utils.showNotification(`Please fill in ${element.name}`, 'warning');
                element.focus();
                return null;
            }
            
            // Validate email fields
            if (element.type === 'email' && element.value && !Utils.isValidEmail(element.value)) {
                Utils.showNotification('Please enter a valid email address', 'warning');
                element.focus();
                return null;
            }
            
            // Validate phone fields
            if (element.type === 'tel' && element.value && !Utils.isValidPhone(element.value)) {
                Utils.showNotification('Please enter a valid phone number', 'warning');
                element.focus();
                return null;
            }
            
            formData[element.name] = Utils.sanitizeInput(element.value);
        }

        return formData;
    }

    // Show booking confirmation
    showConfirmation(booking) {
        const detailsContainer = document.getElementById('confirmation-details');
        if (!detailsContainer) return;

        const date = new Date(booking.date);
        
        detailsContainer.innerHTML = `
            <div class="booking-summary">
                <h3>Booking Details</h3>
                <p><strong>Confirmation Number:</strong> ${booking.confirmationNumber}</p>
                <p><strong>Business:</strong> ${booking.businessName}</p>
                <p><strong>Date:</strong> ${Utils.formatDate(date)}</p>
                <p><strong>Time:</strong> ${Utils.formatTime(booking.time)}</p>
                <p><strong>Location:</strong> ${booking.location.name}</p>
                ${booking.staff ? `<p><strong>Staff:</strong> ${booking.staff.name}</p>` : ''}
                ${booking.selectedPax ? `<p><strong>Guests:</strong> ${booking.selectedPax}</p>` : ''}
                <p><strong>Services:</strong></p>
                <ul>
                    ${booking.services.map(service => 
                        `<li>${service.name} - ${Utils.formatCurrency(service.price)}</li>`
                    ).join('')}
                </ul>
                <p><strong>Total Cost:</strong> ${Utils.formatCurrency(booking.totalCost)}</p>
            </div>
        `;

        this.showStep('confirmation');
    }

    // Download booking details
    downloadBookingDetails() {
        if (!this.currentBooking.businessId) return;
        
        const bookings = storage.getBusinessBookings(this.currentBooking.businessId);
        const latestBooking = bookings[bookings.length - 1];
        
        if (latestBooking) {
            const bookingData = Utils.exportBookingData(latestBooking);
            Utils.downloadJSON(bookingData, `booking-${latestBooking.confirmationNumber}.json`);
        }
    }

    // Show specific step
    showStep(stepId) {
        // Hide all steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });

        // Show selected step
        const targetStep = document.getElementById(stepId);
        if (targetStep) {
            targetStep.classList.add('active');
        }
    }

    // Navigation functions
    goToBusinessSelection() {
        this.showStep('business-selection');
    }

    goToBookingInterface() {
        this.showStep('booking-interface');
    }

    goToServiceSelection() {
        this.showStep('service-selection');
    }

    // Start new booking
    startNewBooking() {
        // Reset current booking
        this.currentBooking = {
            businessId: null,
            business: null,
            date: null,
            selectedCategory: null,
            selectedService: null,
            selectedStaff: null,
            selectedTable: null,
            selectedPax: null,
            time: null,
            services: [],
            staff: null,
            location: null,
            customer: {},
            totalCost: 0
        };
        this.currentStep = 'date';
        this.selectedItems.clear();

        // Go back to business selection
        this.goToBusinessSelection();
    }
}

// Global functions for HTML onclick events
function goBack() {
    if (window.bookingManager) {
        window.bookingManager.goToBusinessSelection();
    }
}

function goToBusinessSelection() {
    if (window.bookingManager) {
        window.bookingManager.goToBusinessSelection();
    }
}

function goToBookingInterface() {
    if (window.bookingManager) {
        window.bookingManager.goToBookingInterface();
    }
}

function goToServiceSelection() {
    if (window.bookingManager) {
        window.bookingManager.goToServiceSelection();
    }
}

function proceedToBookingForm() {
    if (window.bookingManager) {
        window.bookingManager.proceedToBookingForm();
    }
}

function submitBooking() {
    if (window.bookingManager) {
        window.bookingManager.submitBooking();
    }
}

function downloadBookingDetails() {
    if (window.bookingManager) {
        window.bookingManager.downloadBookingDetails();
    }
}

function startNewBooking() {
    if (window.bookingManager) {
        window.bookingManager.startNewBooking();
    }
}

function closeSelectionModal() {
    if (window.bookingManager) {
        window.bookingManager.closeSelectionModal();
    }
}

function continueSelection() {
    // This function can be used for multi-step selections within the modal
    if (window.bookingManager) {
        // Implementation depends on specific requirements
    }
}

// Make BookingManager available globally
window.BookingManager = BookingManager;