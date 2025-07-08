// Business Registration
class RegistrationManager {
    constructor() {
        this.formData = {};
    }

    // Initialize registration
    init() {
        this.setupFormValidation();
        this.setupEventListeners();
    }

    // Setup form validation
    setupFormValidation() {
        const form = document.getElementById('register-form');
        if (!form) return;

        // Real-time validation
        form.addEventListener('input', (e) => {
            this.validateField(e.target);
        });

        // Password confirmation validation
        const password = document.getElementById('owner-password');
        const confirmPassword = document.getElementById('confirm-password');
        
        [password, confirmPassword].forEach(field => {
            if (field) {
                field.addEventListener('input', () => {
                    this.validatePasswordMatch();
                });
            }
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Business type change
        const businessType = document.getElementById('register-business-type');
        if (businessType) {
            businessType.addEventListener('change', (e) => {
                this.updateFormBasedOnBusinessType(e.target.value);
            });
        }

        // Multiple locations toggle
        const multipleLocations = document.getElementById('multiple-locations');
        if (multipleLocations) {
            multipleLocations.addEventListener('change', (e) => {
                this.toggleLocationOptions(e.target.checked);
            });
        }
    }

    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Remove previous error styling
        field.classList.remove('error');
        this.removeFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value && !Utils.isValidEmail(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }

        // Phone validation
        if (field.type === 'tel' && value && !Utils.isValidPhone(value)) {
            isValid = false;
            message = 'Please enter a valid phone number';
        }

        // Password strength validation
        if (field.id === 'owner-password' && value) {
            if (value.length < 6) {
                isValid = false;
                message = 'Password must be at least 6 characters long';
            }
        }

        // Show error if invalid
        if (!isValid) {
            field.classList.add('error');
            this.showFieldError(field, message);
        }

        return isValid;
    }

    // Validate password match
    validatePasswordMatch() {
        const password = document.getElementById('owner-password');
        const confirmPassword = document.getElementById('confirm-password');
        
        if (!password || !confirmPassword) return;

        const passwordValue = password.value;
        const confirmValue = confirmPassword.value;

        // Remove previous error styling
        confirmPassword.classList.remove('error');
        this.removeFieldError(confirmPassword);

        if (confirmValue && passwordValue !== confirmValue) {
            confirmPassword.classList.add('error');
            this.showFieldError(confirmPassword, 'Passwords do not match');
            return false;
        }

        return true;
    }

    // Show field error
    showFieldError(field, message) {
        // Remove existing error message
        this.removeFieldError(field);

        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: block;
        `;

        // Insert after the field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    // Remove field error
    removeFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Update form based on business type
    updateFormBasedOnBusinessType(businessType) {
        // This could be used to show/hide specific fields based on business type
        // For now, we'll just update placeholder text
        const descriptionField = document.getElementById('register-business-description');
        if (descriptionField) {
            const placeholders = {
                salon: 'Describe your salon services, specialties, and atmosphere...',
                restaurant: 'Tell customers about your cuisine, ambiance, and dining experience...',
                clinic: 'Describe your medical services, specialties, and patient care approach...',
                gym: 'Share details about your fitness programs, equipment, and training options...',
                spa: 'Describe your wellness services, treatments, and relaxation experience...',
                automotive: 'Tell customers about your automotive services and expertise...',
                education: 'Describe your educational programs, subjects, and teaching approach...',
                professional: 'Share details about your professional services and expertise...',
                other: 'Describe your business and what makes it special...'
            };
            
            descriptionField.placeholder = placeholders[businessType] || placeholders.other;
        }
    }

    // Toggle location options
    toggleLocationOptions(hasMultipleLocations) {
        // This could show additional location fields if needed
        // For now, we'll just show a message
        if (hasMultipleLocations) {
            Utils.showNotification('You can add additional locations after registration in the admin panel.', 'info');
        }
    }

    // Register new business
    register(formData) {
        // Create business object
        const business = {
            id: storage.generateId(),
            name: formData.businessName,
            type: formData.businessType,
            description: formData.businessDescription,
            phone: formData.businessPhone,
            email: formData.businessEmail || formData.ownerEmail,
            website: '',
            owner: {
                firstName: formData.ownerFirstName,
                lastName: formData.ownerLastName,
                email: formData.ownerEmail,
                password: formData.ownerPassword
            },
            locations: [
                {
                    id: storage.generateId(),
                    name: 'Main Location',
                    address: formData.businessAddress || 'Address to be updated',
                    phone: formData.businessPhone
                }
            ],
            serviceTypes: [],
            services: [],
            staff: [],
            formFields: [
                { type: 'text', label: 'First Name', required: true },
                { type: 'text', label: 'Last Name', required: true },
                { type: 'email', label: 'Email', required: true },
                { type: 'tel', label: 'Phone', required: true }
            ],
            businessHours: {
                monday: { isOpen: true, startTime: "09:00", endTime: "17:00" },
                tuesday: { isOpen: true, startTime: "09:00", endTime: "17:00" },
                wednesday: { isOpen: true, startTime: "09:00", endTime: "17:00" },
                thursday: { isOpen: true, startTime: "09:00", endTime: "17:00" },
                friday: { isOpen: true, startTime: "09:00", endTime: "17:00" },
                saturday: { isOpen: false, startTime: "", endTime: "" },
                sunday: { isOpen: false, startTime: "", endTime: "" }
            },
            timeSlotDuration: 30,
            preferences: {
                multipleLocations: formData.multipleLocations,
                onlinePayments: formData.onlinePayments,
                emailNotifications: formData.emailNotifications
            },
            createdAt: new Date().toISOString()
        };

        // Add default service types and services based on business type
        this.addDefaultBusinessData(business);

        // Save business
        if (storage.saveBusiness(business)) {
            // Set current user
            storage.setCurrentUser(business.owner);
            
            // Export business setup data for backend
            const businessSetup = Utils.exportBusinessSetup(business);
            console.log('New Business Registration Data for Backend:', businessSetup);
            
            Utils.showNotification('Business registered successfully! Redirecting to admin panel...', 'success');
            
            // Redirect to admin panel after short delay
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 2000);
            
            return true;
        } else {
            Utils.showNotification('Failed to register business. Please try again.', 'error');
            return false;
        }
    }

    // Add default business data based on type
    addDefaultBusinessData(business) {
        const defaultData = {
            salon: {
                serviceTypes: [
                    { name: 'Hair Services', description: 'Hair cutting, styling, and treatments' },
                    { name: 'Color Services', description: 'Hair coloring, highlights, and color treatments' },
                    { name: 'Styling Services', description: 'Special occasion styling and blowouts' }
                ],
                services: [
                    { name: 'Haircut & Style', description: 'Professional haircut with wash and style', duration: 60, price: 75 },
                    { name: 'Hair Color', description: 'Full hair coloring service', duration: 120, price: 150 },
                    { name: 'Highlights', description: 'Hair highlighting service', duration: 90, price: 120 },
                    { name: 'Blowout', description: 'Professional blowout styling', duration: 45, price: 55 }
                ]
            },
            restaurant: {
                serviceTypes: [
                    { name: 'Table Reservations', description: 'Restaurant table bookings' }
                ],
                services: [
                    { name: 'Table for 2', description: 'Intimate table for two guests', duration: 90, price: 0 },
                    { name: 'Table for 4', description: 'Standard table for four guests', duration: 90, price: 0 },
                    { name: 'Table for 6', description: 'Large table for six guests', duration: 90, price: 0 },
                    { name: 'Private Dining', description: 'Private dining room reservation', duration: 120, price: 50 }
                ]
            },
            clinic: {
                serviceTypes: [
                    { name: 'Consultations', description: 'Medical consultations and check-ups' },
                    { name: 'Treatments', description: 'Medical treatments and procedures' }
                ],
                services: [
                    { name: 'General Consultation', description: 'General medical consultation', duration: 30, price: 100 },
                    { name: 'Specialist Consultation', description: 'Specialist medical consultation', duration: 45, price: 150 },
                    { name: 'Health Check-up', description: 'Comprehensive health check-up', duration: 60, price: 200 }
                ]
            },
            gym: {
                serviceTypes: [
                    { name: 'Personal Training', description: 'One-on-one fitness training' },
                    { name: 'Group Classes', description: 'Group fitness classes' }
                ],
                services: [
                    { name: 'Personal Training Session', description: '1-on-1 personal training', duration: 60, price: 80 },
                    { name: 'Group Fitness Class', description: 'Group workout session', duration: 45, price: 25 },
                    { name: 'Nutrition Consultation', description: 'Personalized nutrition planning', duration: 30, price: 60 }
                ]
            },
            spa: {
                serviceTypes: [
                    { name: 'Massage Therapy', description: 'Relaxing massage treatments' },
                    { name: 'Facial Treatments', description: 'Skin care and facial services' },
                    { name: 'Body Treatments', description: 'Full body wellness treatments' }
                ],
                services: [
                    { name: 'Swedish Massage', description: 'Relaxing full body massage', duration: 60, price: 90 },
                    { name: 'Deep Tissue Massage', description: 'Therapeutic deep tissue massage', duration: 90, price: 120 },
                    { name: 'Facial Treatment', description: 'Rejuvenating facial treatment', duration: 75, price: 85 }
                ]
            }
        };

        const businessTypeData = defaultData[business.type];
        if (businessTypeData) {
            // Add service types
            business.serviceTypes = businessTypeData.serviceTypes.map(st => ({
                id: storage.generateId(),
                name: st.name,
                description: st.description
            }));

            // Add services
            business.services = businessTypeData.services.map((service, index) => ({
                id: storage.generateId(),
                name: service.name,
                description: service.description,
                duration: service.duration,
                price: service.price,
                serviceTypeId: business.serviceTypes[index % business.serviceTypes.length].id
            }));

            // Add default staff member
            business.staff = [
                {
                    id: storage.generateId(),
                    name: `${business.owner.firstName} ${business.owner.lastName}`,
                    email: business.owner.email,
                    phone: business.phone,
                    services: business.services.map(s => s.id),
                    locations: business.locations.map(l => l.id),
                    schedule: {
                        monday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
                        tuesday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
                        wednesday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
                        thursday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
                        friday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
                        saturday: { isWorking: false, startTime: "", endTime: "" },
                        sunday: { isWorking: false, startTime: "", endTime: "" }
                    }
                }
            ];
        }
    }

    // Validate entire form
    validateForm() {
        const form = document.getElementById('register-form');
        if (!form) return false;

        let isValid = true;
        const formElements = form.querySelectorAll('input[required], select[required], textarea[required]');

        // Validate all required fields
        formElements.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Validate password match
        if (!this.validatePasswordMatch()) {
            isValid = false;
        }

        // Check for existing email
        const email = document.getElementById('owner-email').value;
        const businesses = storage.getBusinesses();
        if (businesses.some(b => b.owner.email === email)) {
            const emailField = document.getElementById('owner-email');
            emailField.classList.add('error');
            this.showFieldError(emailField, 'An account with this email already exists');
            isValid = false;
        }

        return isValid;
    }

    // Collect form data
    collectFormData() {
        const form = document.getElementById('register-form');
        if (!form) return null;

        const formData = new FormData(form);
        const data = {};

        // Get all form values
        data.ownerFirstName = document.getElementById('owner-first-name')?.value.trim();
        data.ownerLastName = document.getElementById('owner-last-name')?.value.trim();
        data.ownerEmail = document.getElementById('owner-email')?.value.trim();
        data.ownerPassword = document.getElementById('owner-password')?.value;
        data.businessName = document.getElementById('register-business-name')?.value.trim();
        data.businessType = document.getElementById('register-business-type')?.value;
        data.businessPhone = document.getElementById('register-business-phone')?.value.trim();
        data.businessDescription = document.getElementById('register-business-description')?.value.trim();
        data.businessAddress = document.getElementById('register-business-address')?.value.trim();
        data.businessEmail = data.ownerEmail; // Use owner email as business email by default
        
        // Get preferences
        data.multipleLocations = document.getElementById('multiple-locations')?.checked || false;
        data.onlinePayments = document.getElementById('online-payments')?.checked || false;
        data.emailNotifications = document.getElementById('email-notifications')?.checked || false;

        return data;
    }
}

// Global function for form submission
function registerBusiness(event) {
    event.preventDefault();
    
    const registrationManager = new RegistrationManager();
    
    // Validate form
    if (!registrationManager.validateForm()) {
        Utils.showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    // Collect form data
    const formData = registrationManager.collectFormData();
    if (!formData) {
        Utils.showNotification('Failed to collect form data', 'error');
        return;
    }
    
    // Register business
    registrationManager.register(formData);
}

function toggleLocationOptions() {
    const checkbox = document.getElementById('multiple-locations');
    if (checkbox && checkbox.checked) {
        Utils.showNotification('You can add additional locations after registration in the admin panel.', 'info');
    }
}

// Initialize registration manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('register-form')) {
        const registrationManager = new RegistrationManager();
        registrationManager.init();
    }
});