const state = {
    step: 'landing', // landing, categories, items, addons, barber, time, details, confirmation, payment, success
    category: null,
    cart: {
        main: null,
        addons: []
    },
    barber: null,
    time: null,
    details: {
        name: '',
        phone: '',
        email: ''
    },
    activeInput: 'name' // 'name', 'phone', or 'email'
};

const app = document.getElementById('app');

// --- LocalStorage for booked times ---
const STORAGE_KEY = 'barber_kiosk_bookings';

function getBookedTimes() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        const bookings = JSON.parse(data);
        // Filter to only today's bookings
        const today = new Date().toDateString();
        return bookings.filter(b => new Date(b.date).toDateString() === today).map(b => b.time);
    } catch (e) {
        return [];
    }
}

function saveBooking(time) {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        const bookings = data ? JSON.parse(data) : [];
        bookings.push({
            time: time,
            date: new Date().toISOString(),
            name: state.details.name,
            phone: state.details.phone
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
        console.error('Failed to save booking', e);
    }
}

function clearAllBookings() {
    localStorage.removeItem(STORAGE_KEY);
}

// --- Step Configuration (Combined Service step) ---
const stepConfig = [
    { id: 'service', label: 'Service', icon: 'fa-scissors', steps: ['categories', 'items'] },
    { id: 'addons', label: 'Add-ons', icon: 'fa-plus', steps: ['addons'] },
    { id: 'barber', label: 'Barber', icon: 'fa-user', steps: ['barber'] },
    { id: 'time', label: 'Time', icon: 'fa-clock', steps: ['time'] },
    { id: 'details', label: 'Details', icon: 'fa-id-card', steps: ['details'] },
    { id: 'confirmation', label: 'Confirm', icon: 'fa-check', steps: ['confirmation'] }
];

// --- Date Formatter ---
const getTodayDate = () => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
};

const getShortDate = () => {
    const today = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
};

// --- Formatters ---
const formatPrice = (price) => `RM ${price}`;
const formatDuration = (min) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
};

// --- Progress Bar Helper ---
function getStepConfigIndex(step) {
    return stepConfig.findIndex(s => s.steps.includes(step));
}

function renderProgressBar() {
    const currentConfigIndex = getStepConfigIndex(state.step);
    if (currentConfigIndex < 0) return ''; // Don't show for landing/payment/success

    return `
        <div class="progress-container">
            <div class="progress-bar">
                ${stepConfig.map((stepItem, index) => {
        const isComplete = index < currentConfigIndex;
        const isCurrent = index === currentConfigIndex;
        const isPending = index > currentConfigIndex;

        return `
                        <div class="progress-step ${isComplete ? 'complete' : ''} ${isCurrent ? 'current' : ''} ${isPending ? 'pending' : ''}">
                            <div class="step-indicator">
                                ${isComplete ? '<i class="fa-solid fa-check"></i>' : `<span>${index + 1}</span>`}
                            </div>
                            <div class="step-label">${stepItem.label}</div>
                        </div>
                        ${index < stepConfig.length - 1 ? `<div class="step-connector ${isComplete ? 'complete' : ''}"></div>` : ''}
                    `;
    }).join('')}
            </div>
        </div>
    `;
}

// --- Render Functions ---

let lastRenderedStep = null;

function renderLanding() {
    lastRenderedStep = 'landing';
    // Landing page is a special case, full screen replace
    app.innerHTML = `
        <div class="flex-1 relative w-full h-full bg-brand-dark">
            <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1920&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover opacity-50">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-10 animate-fade-in">
                <h1 class="text-8xl font-bold mb-6 tracking-wider text-brand-gold drop-shadow-lg">BARBER KIOSK</h1>
                <p class="text-3xl text-gray-200 mb-16 drop-shadow-md">Premium Grooming Experience</p>
                <button onclick="setStep('categories')" class="bg-brand-gold text-brand-text px-20 py-8 rounded-full text-4xl font-bold hover:bg-white transition-all transform hover:scale-105 shadow-xl shadow-brand-gold/30 border-4 border-transparent hover:border-brand-gold">
                    START BOOKING
                </button>
            </div>
        </div>
    `;
}

function renderCategories() {
    const categoriesHtml = servicesData.categories.map(cat => `
        <div onclick="selectCategory('${cat.id}')" class="glass p-8 rounded-3xl flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-brand-gold/10 transition-all group h-full shadow-lg">
            <div class="w-40 h-40 rounded-full bg-brand-gray flex items-center justify-center group-hover:bg-brand-gold transition-colors shadow-inner">
                <i class="fa-solid ${cat.icon} text-6xl text-brand-gold group-hover:text-white"></i>
            </div>
            <h3 class="text-4xl font-bold text-brand-text">${cat.name}</h3>
        </div>
    `).join('');

    renderLayout('Select Service Category', `
        <div class="grid grid-cols-2 gap-8 p-8 h-full w-full">
            ${categoriesHtml}
        </div>
    `, true);
}

function renderItems() {
    const items = servicesData.items[state.category];
    const itemsHtml = items.map(item => `
        <div onclick="selectMainService('${item.id}')" class="glass p-8 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-brand-gold/5 transition-all border-l-8 border-transparent hover:border-brand-gold shadow-md">
            <div>
                <h3 class="text-3xl font-bold mb-2 text-brand-text">${item.name}</h3>
                <p class="text-xl text-gray-500 max-w-2xl">${item.description}</p>
            </div>
            <div class="text-right">
                <div class="text-4xl font-bold text-brand-gold">${formatPrice(item.price)}</div>
                <div class="text-xl text-gray-400 mt-1"><i class="fa-regular fa-clock mr-2"></i>${formatDuration(item.duration)}</div>
            </div>
        </div>
    `).join('');

    renderLayout(servicesData.categories.find(c => c.id === state.category).name, `
        <div class="flex flex-col gap-6 p-8 w-full h-full overflow-y-auto no-scrollbar pb-32">
            ${itemsHtml}
        </div>
    `);
}

function renderAddons() {
    const addonsHtml = servicesData.addons.map(addon => {
        const isSelected = state.cart.addons.find(a => a.id === addon.id);
        return `
        <div onclick="toggleAddon('${addon.id}')" class="glass ${isSelected ? 'glass-active' : ''} p-8 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-brand-gold/5 transition-all shadow-md">
            <div class="flex items-center gap-6">
                <div class="w-10 h-10 rounded border-2 border-brand-gold flex items-center justify-center bg-white">
                    ${isSelected ? '<div class="w-6 h-6 bg-brand-gold rounded-sm"></div>' : ''}
                </div>
                <h3 class="text-3xl font-bold text-brand-text">${addon.name}</h3>
            </div>
            <div class="text-right">
                <div class="text-3xl font-bold text-brand-gold">+${formatPrice(addon.price)}</div>
                ${addon.duration ? `<div class="text-xl text-gray-400 mt-1">+${formatDuration(addon.duration)}</div>` : ''}
            </div>
        </div>
    `}).join('');

    renderLayout('Add-ons & Extras', `
        <div class="flex flex-col gap-6 p-8 w-full h-full overflow-y-auto no-scrollbar pb-40">
            ${addonsHtml}
        </div>
        <div class="absolute bottom-0 left-0 right-0 p-8 bg-white/90 backdrop-blur border-t border-gray-200 flex justify-end z-20">
            <button onclick="setStep('barber')" class="bg-brand-gold text-white px-12 py-6 rounded-xl text-2xl font-bold hover:bg-brand-text transition-all shadow-lg">
                Continue <i class="fa-solid fa-arrow-right ml-3"></i>
            </button>
        </div>
    `);
}

function renderBarber() {
    const barbersHtml = servicesData.barbers.map(barber => `
        <div onclick="selectBarber('${barber.id}')" class="glass p-8 rounded-3xl flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-brand-gold/10 transition-all ${state.barber?.id === barber.id ? 'glass-active' : ''} shadow-lg h-full">
            <img src="${barber.image}" class="w-48 h-48 rounded-full object-cover border-4 border-brand-gold shadow-md">
            <h3 class="text-3xl font-bold text-brand-text">${barber.name}</h3>
        </div>
    `).join('');

    renderLayout('Select Barber', `
        <div class="grid grid-cols-2 gap-10 p-12 max-w-5xl mx-auto w-full h-full content-center">
            ${barbersHtml}
        </div>
    `);
}

function renderTime() {
    const bookedTimes = getBookedTimes();
    const slots = ['10:00', '10:30', '11:00', '11:30', '12:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

    const slotsHtml = slots.map(time => {
        const isBooked = bookedTimes.includes(time);
        const isSelected = state.time === time;

        if (isBooked) {
            return `
                <div class="time-slot-disabled p-8 rounded-2xl text-center shadow-md flex flex-col items-center justify-center gap-2 cursor-not-allowed">
                    <div class="text-4xl font-bold text-gray-300">${time}</div>
                    <div class="text-sm text-gray-400 uppercase tracking-wide">Booked</div>
                </div>
            `;
        }

        return `
            <div onclick="selectTime('${time}')" class="glass p-8 rounded-2xl text-center cursor-pointer hover:bg-brand-gold/10 transition-all ${isSelected ? 'glass-active' : ''} shadow-md flex items-center justify-center">
                <div class="text-4xl font-bold text-brand-text">${time}</div>
            </div>
        `;
    }).join('');

    renderLayout('Select Time', `
        <div class="flex flex-col gap-6 p-8 max-w-4xl mx-auto w-full h-full overflow-y-auto no-scrollbar">
            <!-- Today's Date Display -->
            <div class="today-date-banner glass p-6 rounded-2xl text-center shadow-lg">
                <div class="flex items-center justify-center gap-3">
                    <i class="fa-regular fa-calendar text-brand-gold text-3xl"></i>
                    <div>
                        <span class="text-brand-gold font-bold text-2xl">(Today)</span>
                        <span class="text-brand-text text-2xl ml-2">${getTodayDate()}</span>
                    </div>
                </div>
            </div>
            
            <!-- Time Slots Grid -->
            <div class="grid grid-cols-3 gap-6 w-full">
                ${slotsHtml}
            </div>
            
            <!-- Info Text -->
            <div class="text-center text-gray-400 text-lg mt-2">
                <i class="fa-solid fa-info-circle mr-2"></i>
                Grayed out slots are already booked
            </div>
        </div>
    `);
}

function renderDetails() {
    const emailDomains = ['@gmail.com', '@yahoo.com', '@outlook.com', '@icloud.com', '@hotmail.com'];

    const emailDomainsHtml = emailDomains.map(d => `
        <button onclick="appendEmailDomain('${d}')" class="email-domain-btn bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 shadow-sm rounded-xl px-4 py-3 text-lg font-medium hover:from-brand-gold/10 hover:to-brand-gold/20 hover:text-brand-gold active:bg-brand-gold active:text-white transition-all border border-gray-200 hover:border-brand-gold/30">${d}</button>
    `).join('');

    renderLayout('Your Details', `
        <div class="flex flex-col justify-start h-full w-full p-8 gap-6 max-w-4xl mx-auto overflow-y-auto no-scrollbar">
            <!-- Form Fields -->
            <div class="flex flex-col gap-5">
                <!-- Full Name Field -->
                <div class="glass p-6 rounded-2xl shadow-sm">
                    <label class="block text-lg text-gray-500 mb-2 font-medium">Full Name <span class="text-red-400">*</span></label>
                    <input 
                        type="text" 
                        id="input-name"
                        value="${state.details.name}"
                        oninput="updateDetail('name', this.value)"
                        onfocus="setActiveInput('name')"
                        placeholder="Enter your full name"
                        class="w-full text-3xl font-semibold bg-transparent border-b-2 border-gray-200 focus:border-brand-gold pb-2 transition-colors text-brand-text placeholder:text-gray-300"
                    >
                </div>

                <!-- Phone Field -->
                <div class="glass p-6 rounded-2xl shadow-sm">
                    <label class="block text-lg text-gray-500 mb-2 font-medium">Phone Number <span class="text-red-400">*</span></label>
                    <input 
                        type="tel" 
                        id="input-phone"
                        value="${state.details.phone}"
                        oninput="updateDetail('phone', this.value)"
                        onfocus="setActiveInput('phone')"
                        placeholder="Enter your phone number"
                        class="w-full text-3xl font-semibold bg-transparent border-b-2 border-gray-200 focus:border-brand-gold pb-2 transition-colors text-brand-text placeholder:text-gray-300"
                    >
                </div>

                <!-- Email Field -->
                <div class="glass p-6 rounded-2xl shadow-sm">
                    <label class="block text-lg text-gray-500 mb-2 font-medium">Email <span class="text-gray-400 font-normal">(Optional)</span></label>
                    <input 
                        type="email" 
                        id="input-email"
                        value="${state.details.email}"
                        oninput="updateDetail('email', this.value)"
                        onfocus="setActiveInput('email')"
                        placeholder="Enter your email address"
                        class="w-full text-3xl font-semibold bg-transparent border-b-2 border-gray-200 focus:border-brand-gold pb-2 transition-colors text-brand-text placeholder:text-gray-300"
                    >
                    
                    <!-- Quick Email Domains -->
                    <div class="mt-4">
                        <p class="text-sm text-gray-400 mb-3">Quick add domain:</p>
                        <div class="flex flex-wrap gap-2">
                            ${emailDomainsHtml}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Submit Button -->
            <button onclick="submitDetails()" class="bg-brand-gold text-white w-full py-6 rounded-2xl font-bold text-3xl hover:bg-brand-text transition-all shadow-lg mt-auto">
                Review Order
            </button>
        </div>
    `);
}

function renderConfirmation() {
    const main = state.cart.main;
    const addons = state.cart.addons;
    const total = main.price + addons.reduce((sum, a) => sum + a.price, 0);
    const duration = main.duration + addons.reduce((sum, a) => sum + a.duration, 0);

    // Build contact info display
    let contactInfo = state.details.phone;
    if (state.details.email) {
        contactInfo += ` · ${state.details.email}`;
    }

    renderLayout('Confirm Order', `
        <div class="flex flex-col gap-8 p-8 h-full w-full max-w-5xl mx-auto justify-center overflow-y-auto no-scrollbar">
            <div class="glass p-10 rounded-3xl flex flex-col gap-6 shadow-lg">
                <h3 class="text-gray-500 uppercase tracking-widest text-xl font-bold">Service Summary</h3>
                <div class="flex justify-between items-start">
                    <span class="text-5xl font-bold text-brand-text">${main.name}</span>
                    <span class="text-5xl font-bold text-brand-gold">${formatPrice(main.price)}</span>
                </div>
                ${addons.map(a => `
                    <div class="flex justify-between items-center text-gray-600 text-2xl">
                        <span>+ ${a.name}</span>
                        <span>${formatPrice(a.price)}</span>
                    </div>
                `).join('')}
                <div class="border-t border-gray-200 my-6"></div>
                <div class="flex justify-between items-center text-6xl font-bold text-brand-text">
                    <span>Total</span>
                    <span class="text-brand-gold">${formatPrice(total)}</span>
                </div>
                <div class="flex items-center gap-3 text-gray-500 text-2xl mt-2">
                    <i class="fa-regular fa-clock"></i> Total Duration: ${formatDuration(duration)}
                </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
                <div class="glass p-8 rounded-2xl shadow-md">
                    <div class="text-gray-500 text-xl">Barber</div>
                    <div class="font-bold text-4xl text-brand-text">${state.barber.name}</div>
                </div>
                <div class="glass p-8 rounded-2xl shadow-md">
                    <div class="text-gray-500 text-xl">Time</div>
                    <div class="font-bold text-4xl text-brand-text">${state.time}</div>
                </div>
                <div class="glass p-8 rounded-2xl col-span-2 shadow-md">
                    <div class="text-gray-500 text-xl">Customer</div>
                    <div class="font-bold text-4xl text-brand-text">${state.details.name}</div>
                    <div class="text-2xl text-gray-600 mt-1">${contactInfo}</div>
                </div>
            </div>

            <button onclick="setStep('payment')" class="bg-brand-gold text-white w-full py-8 rounded-2xl font-bold text-4xl hover:bg-brand-text transition-all shadow-xl shadow-brand-gold/30">
                Proceed to Payment
            </button>
        </div>
    `);
}

function renderPayment() {
    renderLayout('Select Payment Method', `
        <div class="flex flex-col gap-8 p-12 max-w-4xl mx-auto w-full h-full justify-center">
            <button onclick="processPayment('qr')" class="glass p-12 rounded-3xl flex items-center gap-8 hover:bg-brand-gold/10 transition-all text-left shadow-xl group w-full">
                <div class="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-5xl group-hover:scale-110 transition-transform flex-shrink-0"><i class="fa-solid fa-qrcode"></i></div>
                <div>
                    <div class="font-bold text-5xl text-brand-text mb-3">QR Pay</div>
                    <div class="text-2xl text-gray-500">E-Wallet (GrabPay, TnG), DuitNow QR</div>
                </div>
            </button>
            
            <div class="text-center text-gray-400 font-bold text-xl uppercase tracking-widest">- OR -</div>

            <button onclick="processPayment('card')" class="glass p-12 rounded-3xl flex items-center gap-8 hover:bg-brand-gold/10 transition-all text-left shadow-xl group w-full">
                <div class="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-5xl group-hover:scale-110 transition-transform flex-shrink-0"><i class="fa-regular fa-credit-card"></i></div>
                <div>
                    <div class="font-bold text-5xl text-brand-text mb-3">Credit / Debit Card</div>
                    <div class="text-2xl text-gray-500">Visa, Mastercard, Amex</div>
                </div>
            </button>
        </div>
    `, false, true);
}

function renderSuccess() {
    // Save the booking to localStorage
    saveBooking(state.time);

    // Success page is also a full screen replace usually, but we can keep the header if we want.
    // Let's make it full screen for impact
    app.innerHTML = `
        <div class="flex-1 flex flex-col items-center justify-center text-center p-10 animate-fade-in bg-white">
            <div class="w-40 h-40 rounded-full bg-green-500 flex items-center justify-center text-white text-7xl mb-10 shadow-2xl shadow-green-500/40">
                <i class="fa-solid fa-check"></i>
            </div>
            <h1 class="text-6xl font-bold mb-4 text-brand-text">Booking Confirmed!</h1>
            <p class="text-3xl text-gray-500 mb-16">Your appointment is set for ${state.time}.</p>
            <div class="glass p-10 rounded-3xl max-w-md w-full mb-16 shadow-lg border-2 border-brand-gold/20">
                <div class="text-xl text-gray-500 mb-2">Order Number</div>
                <div class="text-6xl font-mono font-bold text-brand-gold">#${Math.floor(Math.random() * 9000) + 1000}</div>
            </div>
            <button onclick="resetApp()" class="text-gray-400 hover:text-brand-gold transition-colors text-2xl font-bold uppercase tracking-widest">
                Return to Home
            </button>
        </div>
    `;
}

// --- Layout Helper ---
function renderLayout(title, content, isHome = false, hideProgress = false) {
    const showProgress = !hideProgress && getStepConfigIndex(state.step) >= 0;
    const existingHeader = document.getElementById('layout-header');
    const existingMain = document.getElementById('layout-main');

    if (existingHeader && existingMain) {
        // Update existing shell
        const titleEl = document.getElementById('header-title');
        const backContainer = document.getElementById('header-back');
        const progressContainer = document.getElementById('progress-wrapper');

        if (titleEl.innerText !== title) {
            titleEl.innerText = title;
        }

        if (isHome) {
            backContainer.innerHTML = '';
        } else {
            backContainer.innerHTML = `<button onclick="goBack()" class="back-btn w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center hover:bg-brand-gold hover:text-white transition-all text-brand-text text-2xl shadow-md"><i class="fa-solid fa-arrow-left"></i></button>`;
        }

        if (progressContainer) {
            progressContainer.innerHTML = showProgress ? renderProgressBar() : '';
        }

        existingMain.innerHTML = content;

        // Only retrigger animation if the step has changed
        if (state.step !== lastRenderedStep) {
            existingMain.classList.remove('animate-slide-up');
            void existingMain.offsetWidth; // Force reflow
            existingMain.classList.add('animate-slide-up');
        }

    } else {
        // Create new shell
        app.innerHTML = `
            <header id="layout-header" class="flex flex-col border-b border-gray-200 bg-white z-10 shadow-sm">
                <!-- Top Row: Back, Title, Cancel -->
                <div class="h-28 px-8 flex items-center justify-between">
                    <div class="flex items-center gap-6">
                        <div id="header-back" class="flex items-center justify-center">
                            ${!isHome ? `<button onclick="goBack()" class="back-btn w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center hover:bg-brand-gold hover:text-white transition-all text-brand-text text-2xl shadow-md"><i class="fa-solid fa-arrow-left"></i></button>` : ''}
                        </div>
                        <h2 id="header-title" class="text-4xl font-bold tracking-wide text-brand-text">${title}</h2>
                    </div>
                    <button onclick="resetApp()" class="text-lg text-gray-400 hover:text-red-500 uppercase tracking-widest font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-all">Cancel</button>
                </div>
                <!-- Progress Bar -->
                <div id="progress-wrapper" class="px-8 pb-4">
                    ${showProgress ? renderProgressBar() : ''}
                </div>
            </header>
            <main id="layout-main" class="flex-1 relative overflow-hidden flex flex-col animate-slide-up bg-brand-gray">
                ${content}
            </main>
        `;
    }

    lastRenderedStep = state.step;
}

// --- Actions ---

function setStep(step) {
    state.step = step;
    render();
}

function selectCategory(id) {
    state.category = id;
    setStep('items');
}

function selectMainService(id) {
    const item = servicesData.items[state.category].find(i => i.id === id);
    state.cart.main = item;
    state.cart.addons = [];
    setStep('addons');
}

function toggleAddon(id) {
    const addon = servicesData.addons.find(a => a.id === id);
    const index = state.cart.addons.findIndex(a => a.id === id);
    if (index >= 0) {
        state.cart.addons.splice(index, 1);
    } else {
        state.cart.addons.push(addon);
    }
    render();
}

function selectBarber(id) {
    state.barber = servicesData.barbers.find(b => b.id === id);
    setStep('time');
}

function selectTime(time) {
    state.time = time;
    setStep('details');
}

function setActiveInput(input) {
    state.activeInput = input;
    // Don't re-render, just update focus state
}

function updateDetail(field, value) {
    state.details[field] = value;
    // Don't re-render to prevent input losing focus
}

function appendEmailDomain(domain) {
    const emailInput = document.getElementById('input-email');
    // Remove any existing domain first
    let currentEmail = state.details.email;
    const atIndex = currentEmail.indexOf('@');
    if (atIndex > 0) {
        currentEmail = currentEmail.substring(0, atIndex);
    }
    state.details.email = currentEmail + domain;
    if (emailInput) {
        emailInput.value = state.details.email;
    }
}

function submitDetails() {
    if (!state.details.name || !state.details.phone) {
        // Show validation feedback
        const nameInput = document.getElementById('input-name');
        const phoneInput = document.getElementById('input-phone');

        if (!state.details.name && nameInput) {
            nameInput.classList.add('border-red-400');
            nameInput.placeholder = 'Name is required';
        }
        if (!state.details.phone && phoneInput) {
            phoneInput.classList.add('border-red-400');
            phoneInput.placeholder = 'Phone is required';
        }
        return;
    }
    setStep('confirmation');
}

function processPayment(method) {
    app.innerHTML = `
        <div class="flex-1 flex flex-col items-center justify-center text-center p-10 animate-fade-in bg-white">
            <div class="w-24 h-24 border-8 border-brand-gold border-t-transparent rounded-full animate-spin mb-10"></div>
            <h2 class="text-4xl font-bold text-brand-text mb-4">Processing Payment...</h2>
            <p class="text-2xl text-gray-500">Please follow instructions on the terminal</p>
        </div>
    `;
    setTimeout(() => {
        setStep('success');
    }, 2000);
}

function goBack() {
    const flow = ['landing', 'categories', 'items', 'addons', 'barber', 'time', 'details', 'confirmation', 'payment', 'success'];
    const currentIndex = flow.indexOf(state.step);
    if (currentIndex > 0) {
        setStep(flow[currentIndex - 1]);
    }
}

function resetApp() {
    state.step = 'landing';
    state.category = null;
    state.cart = { main: null, addons: [] };
    state.barber = null;
    state.time = null;
    state.details = { name: '', phone: '', email: '' };
    state.activeInput = 'name';
    render();
}

// --- Main Render Loop ---
function render() {
    switch (state.step) {
        case 'landing': renderLanding(); break;
        case 'categories': renderCategories(); break;
        case 'items': renderItems(); break;
        case 'addons': renderAddons(); break;
        case 'barber': renderBarber(); break;
        case 'time': renderTime(); break;
        case 'details': renderDetails(); break;
        case 'confirmation': renderConfirmation(); break;
        case 'payment': renderPayment(); break;
        case 'success': renderSuccess(); break;
    }
}

// Init
render();
