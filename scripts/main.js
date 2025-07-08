// scripts/main.js

// Define global variables for managing steps and booking manager
let currentActiveMainStepId = 'hero-section'; // Initial active main page step
let bookingManagerInstance = null; // Will be initialized when booking interface is active

// Define the sequence of main page steps (excluding hero for back navigation)
const mainPageFlow = [
    'login-page',
    'register-page', // register flow goes: register -> face-id-scan -> face-id-success -> booking-calendar
    'face-id-scan-page',
    'face-id-success-page',
    'booking-calendar-step',
    'time-slot-selection-step',
    'service-selection-step',
    'customer-details-step',
    'confirmation-step'
];

// --- All Page Step IDs (for hiding/showing) ---
const allPageSteps = [
    'hero-section',
    ...mainPageFlow // Include all steps in the complete list
];


// --- Core Step Management Functions ---

/**
 * Hides all page steps and shows only the specified one.
 * Manages global header visibility and main content padding.
 * @param {string} stepId The ID of the page step to show.
 */
function showMainStep(stepId) {
    const globalHeader = document.getElementById('global-app-header');
    const mainContent = document.querySelector('main.main-content');
    const headerHeight = globalHeader ? globalHeader.offsetHeight : 0; // Get actual header height

    // Hide ALL page steps first to ensure clean transition
    allPageSteps.forEach(id => {
        const stepElement = document.getElementById(id);
        if (stepElement) {
            stepElement.classList.remove('active');
            stepElement.style.display = 'none'; // Explicitly hide via inline style for robustness
        }
    });

    // Show the target page step if a valid ID is provided
    const targetStep = document.getElementById(stepId);
    if (targetStep) {
        targetStep.classList.add('active');
        targetStep.style.display = 'flex'; // Use flex for vertical/horizontal centering as defined in main.css
        currentActiveMainStepId = stepId;
        console.log(`Mapsd to: ${stepId}`);

        // Manage global header visibility and main-content padding
        if (stepId === 'hero-section') {
            globalHeader.classList.add('hidden'); // Hide header on hero page
            mainContent.style.paddingTop = '0'; // No padding for hero
        } else {
            globalHeader.classList.remove('hidden'); // Show header on other pages
            mainContent.style.paddingTop = `${headerHeight}px`; // Add padding to avoid content hiding under fixed header
        }

        // Specific initializations/resets for different steps
        if (stepId === 'booking-calendar-step') {
            if (typeof Calendar === 'function') {
                const dummyBusiness = {
                    id: 'fitlifegym', name: 'FitLife Gym', type: 'gym',
                    businessHours: {
                        'Sunday': { isOpen: true, open: '08:00', close: '18:00' }, 'Monday': { isOpen: true, open: '06:00', close: '22:00' },
                        'Tuesday': { isOpen: true, open: '06:00', close: '22:00' }, 'Wednesday': { isOpen: true, open: '06:00', close: '22:00' },
                        'Thursday': { isOpen: true, open: '06:00', close: '22:00' }, 'Friday': { isOpen: true, open: '06:00', close: '22:00' },
                        'Saturday': { isOpen: true, open: '08:00', close: '18:00' }
                    },
                    staff: [
                        { id: 'trainer1', name: 'Sarah Johnson', schedule: { 'Monday': { isWorking: true }, 'Wednesday': { isWorking: true }, 'Friday': { isWorking: true }, 'Tuesday': { isWorking: true }, 'Thursday': { isWorking: true }, 'Saturday': { isWorking: true }, 'Sunday': { isWorking: true } } },
                        { id: 'trainer2', name: 'Mike Chen', schedule: { 'Monday': { isWorking: true }, 'Wednesday': { isWorking: true }, 'Friday': { isWorking: true }, 'Tuesday': { isWorking: true }, 'Thursday': { isWorking: true }, 'Saturday': { isWorking: true }, 'Sunday': { isWorking: true } } }
                    ]
                };
                if (!window.myCalendarInstance || window.myCalendarInstance.container.id !== 'calendar') {
                    window.myCalendarInstance = new Calendar('calendar');
                }
                window.myCalendarInstance.init(dummyBusiness);
                
                window.myCalendarInstance.setDateSelectCallback((dateString, dateObj) => {
                    window.currentSelectedDate = dateString;
                    document.getElementById('proceed-to-time-slot-btn').disabled = false;
                });
                document.getElementById('calendar-title').textContent = window.myCalendarInstance.getDisplayTitle();
                document.getElementById('proceed-to-time-slot-btn').disabled = true;
            }
        } else if (stepId === 'time-slot-selection-step') {
            populateTimeSlots();
            const selectedDateDisplay = document.getElementById('selected-date-display');
            if (window.currentSelectedDate) {
                const dateObj = new Date(window.currentSelectedDate);
                selectedDateDisplay.textContent = `Selected Date: ${dateObj.toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
            }
            document.getElementById('proceed-to-service-selection-btn').disabled = true;
        } else if (stepId === 'service-selection-step') {
            const selectedDateTimeDisplay = document.getElementById('selected-datetime-display');
            if (window.currentSelectedDate && window.currentSelectedTime) {
                const dateObj = new Date(window.currentSelectedDate);
                const formattedDate = dateObj.toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                const formattedTime = new Date(`2000-01-01T${window.currentSelectedTime}`).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: true });
                selectedDateTimeDisplay.textContent = `Selected Date & Time: ${formattedDate} at ${formattedTime}`;
            }
            attachServiceAndTrainerSelectionListeners();
            document.getElementById('proceed-to-customer-details-btn').disabled = true;
        } else if (stepId === 'customer-details-step') {
            populateBookingSummaryPreview();
        } else if (stepId === 'login-page') {
            document.getElementById('login-form').reset();
            document.getElementById('login-email').style.borderColor = '';
            document.getElementById('login-password').style.borderColor = '';
        } else if (stepId === 'register-page') {
            document.getElementById('register-form').reset();
            document.getElementById('register-name').style.borderColor = '';
            document.getElementById('register-email').style.borderColor = '';
            document.getElementById('register-password').style.borderColor = '';
            document.getElementById('register-confirm-password').style.borderColor = '';
        }
    } else {
        console.log(`Attempted to show non-existent step "${stepId}" or intentionally hide all.`);
    }
}

/**
 * Handles global back navigation based on the current step.
 */
function globalGoBack() {
    const currentIndex = allPageSteps.indexOf(currentActiveMainStepId);

    if (currentIndex === -1) {
        console.error("Current step not found in allPageSteps.");
        showMainStep('hero-section'); // Fallback to hero
        return;
    }

    let previousStepId = '';

    // Define specific back paths for different steps
    if (currentActiveMainStepId === 'login-page' || currentActiveMainStepId === 'register-page') {
        previousStepId = 'hero-section';
    } else if (currentActiveMainStepId === 'face-id-scan-page' || currentActiveMainStepId === 'face-id-success-page') {
        previousStepId = 'register-page'; // Go back to register from scan/success
    } else if (currentActiveMainStepId === 'booking-calendar-step') {
        // From calendar, depends on how they got there (login, face ID success)
        // For simplicity, let's go back to login page if coming from booking calendar.
        // In a real app, you might track the entry point.
        previousStepId = 'login-page'; // Or 'face-id-success-page' if they registered
    } else if (currentActiveMainStepId === 'time-slot-selection-step') {
        previousStepId = 'booking-calendar-step';
    } else if (currentActiveMainStepId === 'service-selection-step') {
        previousStepId = 'time-slot-selection-step';
    } else if (currentActiveMainStepId === 'customer-details-step') {
        previousStepId = 'service-selection-step';
    } else if (currentActiveMainStepId === 'confirmation-step') {
        // No back from confirmation, so start a new booking or go to hero
        // For this scenario, let's go back to booking calendar (new booking flow)
        previousStepId = 'booking-calendar-step';
    } else {
        // Default: go back one step in the linear array
        if (currentIndex > 0) {
            previousStepId = allPageSteps[currentIndex - 1];
        } else {
            previousStepId = 'hero-section'; // Fallback for first step in general flow
        }
    }

    showMainStep(previousStepId);
}


// --- Main Page Navigation Functions (called by HTML buttons) ---
function goToHero() {
    showMainStep('hero-section');
}

function goToLogin() {
    showMainStep('login-page');
}

function goToRegister() {
    showMainStep('register-page');
}

// Dummy Login (no validation)
function performLogin() {
    const loginButton = document.querySelector('#login-page .btn.primary');
    const originalText = loginButton.textContent;
    loginButton.textContent = 'Logging in...';
    loginButton.disabled = true;
    loginButton.classList.add('btn-loading');

    setTimeout(() => {
        loginButton.textContent = originalText;
        loginButton.disabled = false;
        loginButton.classList.remove('btn-loading');

        showMainStep('booking-calendar-step');
    }, 1500);
}

// Dummy Register (no validation)
function proceedToFaceIdScan() {
    const registerButton = document.querySelector('#register-page .btn.primary');
    const originalText = registerButton.textContent;
    registerButton.textContent = 'Processing...';
    registerButton.disabled = true;
    registerButton.classList.add('btn-loading');

    setTimeout(() => {
        registerButton.textContent = originalText;
        registerButton.disabled = false;
        registerButton.classList.remove('btn-loading');

        showMainStep('face-id-scan-page');
        startFaceIdScan();
    }, 1000);
}

function startFaceIdScan() {
    const scanContainer = document.querySelector('#face-id-scan-page .face-scan-container');
    const scanStatus = document.getElementById('scan-status');

    scanContainer.classList.remove('complete');
    scanContainer.classList.add('scanning');
    scanStatus.textContent = 'Scanning in progress...';

    setTimeout(() => {
        scanContainer.classList.remove('scanning');
        scanContainer.classList.add('complete');
        scanStatus.textContent = 'Face ID Scan Complete!';

        setTimeout(() => {
            showMainStep('face-id-success-page');
        }, 1000);
    }, 3000);
}

// --- Booking Flow Navigation Functions (full page steps) ---
function goToBookingCalendarStep() {
    showMainStep('booking-calendar-step');
}

function goToTimeSlotSelection() {
    if (!window.currentSelectedDate) {
        Utils.showNotification('Please select a date from the calendar first.', 'warning');
        return;
    }
    showMainStep('time-slot-selection-step');
}

function goToServiceSelection() {
    if (!window.currentSelectedTime) {
        Utils.showNotification('Please select a time slot first.', 'warning');
        return;
    }
    showMainStep('service-selection-step');
}

function goToCustomerDetails() {
    const selectedService = document.querySelector('#service-grid .selection-card.selected');
    if (!selectedService) {
        Utils.showNotification('Please select at least one service.', 'warning');
        return;
    }

    window.selectedBookingDetails.service = {
        id: selectedService.dataset.id,
        name: selectedService.querySelector('h4').textContent,
        price: selectedService.dataset.price,
        duration: selectedService.dataset.duration
    };
    const selectedTrainer = document.querySelector('#trainer-grid .selection-card.selected');
    if (selectedTrainer) {
        window.selectedBookingDetails.trainer = {
            id: selectedTrainer.dataset.id,
            name: selectedTrainer.querySelector('h4').textContent
        };
    } else {
        window.selectedBookingDetails.trainer = { id: 'any', name: 'Any Available Trainer' };
    }

    showMainStep('customer-details-step');
}

function submitBooking() {
    const customerNameInput = document.getElementById('customer-name');
    const customerEmailInput = document.getElementById('customer-email');
    let isValid = true;

    if (!customerNameInput.value.trim()) {
        customerNameInput.style.borderColor = '#ef4444';
        isValid = false;
    } else {
        customerNameInput.style.borderColor = '';
    }

    if (!customerEmailInput.value.trim() || !customerEmailInput.value.includes('@')) {
        customerEmailInput.style.borderColor = '#ef4444';
        isValid = false;
    } else {
        customerEmailInput.style.borderColor = '';
    }

    if (!isValid) {
        Utils.showNotification('Please fill in required customer details (Name, valid Email).', 'error');
        return;
    }

    window.selectedBookingDetails.customer = {
        name: customerNameInput.value,
        email: customerEmailInput.value,
        phone: document.getElementById('customer-phone').value,
        notes: document.getElementById('customer-notes').value
    };

    const submitBtn = document.querySelector('#customer-details-step .btn.primary.large');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Confirming...';
    submitBtn.disabled = true;
    submitBtn.classList.add('btn-loading');

    setTimeout(() => {
        console.log('Final Booking Data:', window.selectedBookingDetails);
        // alert('Booking submitted!');

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');

        showMainStep('confirmation-step');

        const { date, time, service, trainer, customer } = window.selectedBookingDetails;
        const formattedDateFull = new Date(`${date}T${time}`).toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

        // Populate the booking summary within the confirmation section
        const bookingSummaryConfirmationDiv = document.getElementById('confirmation-details-modern'); // This is the div with class booking-summary-confirmation
        bookingSummaryConfirmationDiv.innerHTML = `
            <h3>Booking Details</h3>
            <p><strong>Service:</strong> <span>${service.name} (${service.duration})</span></p>
            <p><strong>Date & Time:</strong> <span>${formattedDateFull}</span></p>
            <p><strong>Trainer:</strong> <span>${trainer ? trainer.name : 'Not selected'}</span></p>
            <p><strong>Customer:</strong> <span>${customer.name}</span></p>
            <p><strong>Email:</strong> <span>${customer.email}</span></p>
            ${customer.phone ? `<p><strong>Phone:</strong> <span>${customer.phone}</span></p>` : ''}
            ${customer.notes ? `<p><strong>Notes:</strong> <span>${customer.notes}</span></p>` : ''}
            <p><strong>Total Cost:</strong> <span class="service-price">${service.price}</span></p>
            <p><strong>Booking ID:</strong> <span>FL-${Math.random().toString(36).substr(2, 9).toUpperCase()}</span></p>
        `;

        // Update the QR code data here (though it's dummy data for now)
        const qrCodeImg = document.querySelector('.e-receipt-qr-code');
        if (qrCodeImg) {
            const dummyBookingId = `FL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FitLifeGymBookingID-${dummyBookingId}`;
            const qrHint = document.querySelector('.qr-hint');
            if (qrHint) qrHint.textContent = `Show this code (ID: ${dummyBookingId}) at the reception.`;
        }

        window.selectedBookingDetails = {};
        window.currentSelectedDate = null;
        window.currentSelectedTime = null;

    }, 1500);
}

function downloadBookingDetails() {
    alert('Downloading booking details... (dummy function)');
}

function startNewBooking() {
    showMainStep('booking-calendar-step');
}

// --- Dynamic Content & Listener Attachments ---

function populateTimeSlots() {
    const timeSlotsGrid = document.getElementById('time-slots-grid');
    timeSlotsGrid.querySelectorAll('.time-slot.selected').forEach(s => s.classList.remove('selected'));
    
    timeSlotsGrid.querySelectorAll('.time-slot').forEach(slot => {
        if (!slot.classList.contains('unavailable')) {
            slot.removeEventListener('click', handleTimeSlotClick);
            slot.addEventListener('click', handleTimeSlotClick);
        }
    });

    function handleTimeSlotClick() {
        timeSlotsGrid.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        this.classList.add('selected');
        document.getElementById('proceed-to-service-selection-btn').disabled = false;
        window.currentSelectedTime = this.dataset.time;
    }
}

function attachServiceAndTrainerSelectionListeners() {
    const serviceGrid = document.getElementById('service-grid');
    const trainerGrid = document.getElementById('trainer-grid');
    const proceedButton = document.getElementById('proceed-to-customer-details-btn');
    
    if (!serviceGrid || !trainerGrid || !proceedButton) {
        console.warn('Service/Trainer grids or proceed button not found.');
        return;
    }

    serviceGrid.querySelectorAll('.selection-card').forEach(card => {
        card.removeEventListener('click', handleServiceCardClick);
    });
    trainerGrid.querySelectorAll('.selection-card').forEach(card => {
        card.removeEventListener('click', handleTrainerCardClick);
    });

    serviceGrid.querySelectorAll('.selection-card').forEach(card => {
        card.addEventListener('click', handleServiceCardClick);
    });
    trainerGrid.querySelectorAll('.selection-card').forEach(card => {
        card.addEventListener('click', handleTrainerCardClick);
    });

    function handleServiceCardClick() {
        serviceGrid.querySelectorAll('.selection-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        proceedButton.disabled = false;
        updateTotalCostAndBookingDetails();
    }

    function handleTrainerCardClick() {
        trainerGrid.querySelectorAll('.selection-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        updateTotalCostAndBookingDetails();
    }

    function updateTotalCostAndBookingDetails() {
        const selectedServiceCard = serviceGrid.querySelector('.selection-card.selected');
        const selectedTrainerCard = trainerGrid.querySelector('.selection-card.selected');
        const totalCostSpan = document.getElementById('total-cost');
        
        window.selectedBookingDetails = window.selectedBookingDetails || {};

        if (selectedServiceCard) {
            const price = parseFloat(selectedServiceCard.dataset.price);
            totalCostSpan.textContent = price.toFixed(2);
            
            window.selectedBookingDetails.service = {
                id: selectedServiceCard.dataset.id,
                name: selectedServiceCard.querySelector('h4').textContent,
                price: `$${price.toFixed(2)}`,
                duration: selectedServiceCard.dataset.duration
            };
        } else {
            totalCostSpan.textContent = '0.00';
            window.selectedBookingDetails.service = null;
        }

        if (selectedTrainerCard) {
            window.selectedBookingDetails.trainer = {
                id: selectedTrainerCard.dataset.id,
                name: selectedTrainerCard.querySelector('h4').textContent
            };
        } else {
            window.selectedBookingDetails.trainer = { id: 'any', name: 'Any Available Trainer' };
        }
    }

    updateTotalCostAndBookingDetails();
}

function populateBookingSummaryPreview() {
    const summaryDiv = document.getElementById('booking-summary-preview');
    if (!window.selectedBookingDetails || !window.selectedBookingDetails.service) {
        summaryDiv.innerHTML = '<p>No details selected yet.</p>';
        document.getElementById('final-total-cost').textContent = '0.00';
        return;
    }

    const { date, time, service, trainer } = window.selectedBookingDetails;

    const formattedDate = new Date(date).toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: true });

    let html = `
        <div class="selected-service">
            <span>Date:</span>
            <span>${formattedDate}</span>
        </div>
        <div class="selected-service">
            <span>Time:</span>
            <span>${formattedTime}</span>
        </div>
        <div class="selected-service">
            <span>Service:</span>
            <span>${service.name} (${service.duration})</span>
        </div>
        <div class="selected-service">
            <span>Trainer:</span>
            <span>${trainer ? trainer.name : 'Not selected'}</span>
        </div>
        <div class="selected-service">
            <span>Price:</span>
            <span class="service-price">${service.price}</span>
        </div>
    `;
    summaryDiv.innerHTML = html;
    document.getElementById('final-total-cost').textContent = parseFloat(service.price.replace('$', '')).toFixed(2);
}


// Initial load: ensure hero section is displayed
document.addEventListener('DOMContentLoaded', () => {
    showMainStep(currentActiveMainStepId);
});

// Global variables for booking data.
window.currentSelectedDate = null;
window.currentSelectedTime = null;
window.selectedBookingDetails = {};