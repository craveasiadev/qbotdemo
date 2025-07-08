// Admin Panel Management - Gym Focused
class AdminManager {
    constructor() {
        this.currentUser = null;
        this.currentBusiness = null;
        this.currentSection = 'dashboard';
        this.formFields = [];
        this.dummyData = this.generateDummyData();
    }

    // Generate dummy data for testing
    generateDummyData() {
        return {
            customers: [
                {
                    id: '1',
                    firstName: 'John',
                    lastName: 'Smith',
                    email: 'john.smith@email.com',
                    phone: '(555) 123-4567',
                    membershipType: 'premium',
                    joinDate: '2024-01-15',
                    totalBookings: 24,
                    lastVisit: '2024-12-19',
                    emergencyContact: 'Jane Smith (555) 123-4568'
                },
                {
                    id: '2',
                    firstName: 'Maria',
                    lastName: 'Garcia',
                    email: 'maria.garcia@email.com',
                    phone: '(555) 234-5678',
                    membershipType: 'basic',
                    joinDate: '2024-02-20',
                    totalBookings: 15,
                    lastVisit: '2024-12-18',
                    emergencyContact: 'Carlos Garcia (555) 234-5679'
                },
                {
                    id: '3',
                    firstName: 'Robert',
                    lastName: 'Johnson',
                    email: 'robert.j@email.com',
                    phone: '(555) 345-6789',
                    membershipType: 'vip',
                    joinDate: '2024-03-10',
                    totalBookings: 32,
                    lastVisit: '2024-12-20',
                    emergencyContact: 'Linda Johnson (555) 345-6790',
                    healthConditions: 'Previous knee injury'
                }
            ],
            classes: [
                {
                    id: '1',
                    name: 'HIIT Training',
                    description: 'High-intensity interval training for maximum results',
                    instructor: 'Sarah Johnson',
                    duration: 45,
                    price: 25,
                    maxParticipants: 15,
                    schedule: 'Mon/Wed/Fri 7:00 AM'
                },
                {
                    id: '2',
                    name: 'Yoga Flow',
                    description: 'Relaxing yoga session for flexibility and mindfulness',
                    instructor: 'Emily Rodriguez',
                    duration: 60,
                    price: 20,
                    maxParticipants: 20,
                    schedule: 'Tue/Thu 6:00 PM'
                }
            ],
            appointments: [
                {
                    id: '1',
                    date: '2024-12-20',
                    time: '09:00',
                    customer: 'John Smith',
                    trainer: 'Sarah Johnson',
                    service: 'Personal Training',
                    duration: 60,
                    status: 'confirmed'
                },
                {
                    id: '2',
                    date: '2024-12-20',
                    time: '14:00',
                    customer: 'Maria Garcia',
                    trainer: 'Mike Chen',
                    service: 'Strength Training',
                    duration: 45,
                    status: 'pending'
                }
            ],
            outlets: [
                {
                    id: '1',
                    name: 'Downtown Fitness Center',
                    address: '123 Main St, Downtown',
                    phone: '(555) 123-4567',
                    manager: 'John Manager',
                    status: 'active'
                },
                {
                    id: '2',
                    name: 'Westside Gym',
                    address: '456 Oak Ave, Westside',
                    phone: '(555) 234-5678',
                    manager: 'Jane Manager',
                    status: 'active'
                }
            ],
            holidays: [
                {
                    id: '1',
                    name: 'New Year\'s Day',
                    date: '2025-01-01',
                    type: 'public',
                    recurring: true
                },
                {
                    id: '2',
                    name: 'Christmas Day',
                    date: '2024-12-25',
                    type: 'public',
                    recurring: true
                },
                {
                    id: '3',
                    name: 'Staff Training Day',
                    date: '2024-12-30',
                    type: 'business',
                    recurring: false
                }
            ],
            users: [
                {
                    id: '1',
                    name: 'Sarah Johnson',
                    email: 'sarah@fitlifegym.com',
                    role: 'Personal Trainer',
                    specialization: 'Weight Training, HIIT',
                    locations: ['Downtown Fitness Center', 'Westside Gym'],
                    status: 'active'
                },
                {
                    id: '2',
                    name: 'Mike Chen',
                    email: 'mike@fitlifegym.com',
                    role: 'Personal Trainer',
                    specialization: 'Cardio, Athletic Performance',
                    locations: ['Downtown Fitness Center'],
                    status: 'active'
                },
                {
                    id: '3',
                    name: 'Emily Rodriguez',
                    email: 'emily@fitlifegym.com',
                    role: 'Yoga Instructor',
                    specialization: 'Yoga, Pilates, Flexibility',
                    locations: ['Westside Gym'],
                    status: 'active'
                }
            ],
            recentBookings: [
                {
                    customer: 'John Smith',
                    service: 'Personal Training',
                    time: '09:00 AM',
                    trainer: 'Sarah Johnson'
                },
                {
                    customer: 'Maria Garcia',
                    service: 'HIIT Class',
                    time: '10:30 AM',
                    trainer: 'Mike Chen'
                },
                {
                    customer: 'Robert Johnson',
                    service: 'Yoga Flow',
                    time: '06:00 PM',
                    trainer: 'Emily Rodriguez'
                }
            ],
            popularClasses: [
                {
                    name: 'HIIT Training',
                    instructor: 'Sarah Johnson',
                    bookings: 45
                },
                {
                    name: 'Yoga Flow',
                    instructor: 'Emily Rodriguez',
                    bookings: 38
                },
                {
                    name: 'Strength Training',
                    instructor: 'Mike Chen',
                    bookings: 32
                }
            ]
        };
    }

    // Initialize admin panel
    init() {
        this.checkAuthStatus();
        this.setupEventListeners();
        this.loadInitialData();
    }

    // Check if user is authenticated
    checkAuthStatus() {
        const currentUser = storage.getCurrentUser();
        if (currentUser) {
            this.currentUser = currentUser;
            this.loadUserBusiness();
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    // Show login form
    showLogin() {
        const loginContainer = document.getElementById('admin-login');
        const dashboard = document.getElementById('admin-dashboard');
        
        if (loginContainer) {
            loginContainer.classList.add('active');
            loginContainer.style.display = 'flex';
        }
        if (dashboard) {
            dashboard.classList.remove('active');
            dashboard.style.display = 'none';
        }
    }

    // Show dashboard
    showDashboard() {
        const loginContainer = document.getElementById('admin-login');
        const dashboard = document.getElementById('admin-dashboard');
        
        if (loginContainer) {
            loginContainer.classList.remove('active');
            loginContainer.style.display = 'none';
        }
        if (dashboard) {
            dashboard.classList.add('active');
            dashboard.style.display = 'flex';
        }
        
        if (this.currentBusiness) {
            const businessNameElement = document.getElementById('business-name');
            if (businessNameElement) {
                businessNameElement.textContent = this.currentBusiness.name;
            }
        }
        
        this.loadDashboardData();
    }

    // Load user's business
    loadUserBusiness() {
        const businesses = storage.getBusinesses();
        this.currentBusiness = businesses.find(b => b.owner.email === this.currentUser.email);
        
        if (!this.currentBusiness) {
            // Create dummy business for demo
            this.currentBusiness = {
                id: 'demo-business',
                name: 'FitLife Gym',
                type: 'gym',
                description: 'Premium fitness facility',
                phone: '(555) 123-4567',
                email: 'info@fitlifegym.com',
                website: 'https://fitlifegym.com',
                owner: this.currentUser
            };
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item, .nav-subitem').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                if (section) {
                    this.showSection(section);
                }
            });
        });

        // Parent menu toggles
        document.querySelectorAll('.nav-parent').forEach(parent => {
            parent.addEventListener('click', (e) => {
                e.preventDefault();
                const submenu = parent.nextElementSibling;
                if (submenu && submenu.classList.contains('nav-submenu')) {
                    parent.classList.toggle('expanded');
                    submenu.classList.toggle('expanded');
                }
            });
        });

        // Modal overlay
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }
    }

    // Load initial dashboard data
    loadInitialData() {
        this.loadDashboard();
        this.loadCustomers();
        this.loadClasses();
        this.loadAppointments();
        this.loadOutlets();
        this.loadHolidays();
        this.loadUsers();
        this.loadStaffSchedule();
    }

    // Show specific section
    showSection(sectionId) {
        // Update navigation
        document.querySelectorAll('.nav-item, .nav-subitem').forEach(item => {
            item.classList.remove('active');
        });
        const activeNavItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // Update content
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.classList.add('active');
        }

        this.currentSection = sectionId;

        // Load section-specific data
        switch(sectionId) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'customers':
                this.loadCustomers();
                break;
            case 'classes':
                this.loadClasses();
                break;
            case 'appointments':
                this.loadAppointments();
                break;
            case 'outlets':
                this.loadOutlets();
                break;
            case 'holidays':
                this.loadHolidays();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'staff-schedule':
                this.loadStaffSchedule();
                break;
        }
    }

    // Load dashboard
    loadDashboard() {
        // Load recent bookings
        const recentBookingsContainer = document.getElementById('recent-bookings');
        if (recentBookingsContainer) {
            recentBookingsContainer.innerHTML = this.dummyData.recentBookings.map(booking => `
                <div class="booking-item">
                    <div class="booking-avatar">${booking.customer.charAt(0)}</div>
                    <div class="booking-info">
                        <div class="booking-name">${booking.customer}</div>
                        <div class="booking-details">${booking.service} with ${booking.trainer}</div>
                    </div>
                    <div class="booking-time">${booking.time}</div>
                </div>
            `).join('');
        }

        // Load popular classes
        const popularClassesContainer = document.getElementById('popular-classes');
        if (popularClassesContainer) {
            popularClassesContainer.innerHTML = this.dummyData.popularClasses.map(classItem => `
                <div class="class-item">
                    <div class="class-info">
                        <h4>${classItem.name}</h4>
                        <div class="class-meta">Instructor: ${classItem.instructor}</div>
                    </div>
                    <div class="class-stats">
                        <div class="class-count">${classItem.bookings}</div>
                        <div class="class-label">Bookings</div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Load customers
    loadCustomers() {
        const customersGrid = document.getElementById('customers-grid');
        if (!customersGrid) return;

        customersGrid.innerHTML = this.dummyData.customers.map(customer => {
            const memberSince = this.formatDate(customer.joinDate);
            const lastVisit = this.formatDate(customer.lastVisit);
            const initials = (customer.firstName[0] + customer.lastName[0]).toUpperCase();

            return `
                <div class="customer-card">
                    <div class="customer-header">
                        <div class="customer-avatar">${initials}</div>
                        <div class="customer-info">
                            <h4>${customer.firstName} ${customer.lastName}</h4>
                            <div class="customer-email">${customer.email}</div>
                        </div>
                    </div>
                    
                    <div class="customer-details">
                        <div class="detail-item">
                            <div class="detail-label">Phone</div>
                            <div class="detail-value">${customer.phone}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Membership</div>
                            <div class="detail-value">
                                <span class="membership-badge ${customer.membershipType}">${customer.membershipType.toUpperCase()}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Member Since</div>
                            <div class="detail-value">${memberSince}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Last Visit</div>
                            <div class="detail-value">${lastVisit}</div>
                        </div>
                        ${customer.emergencyContact ? `
                            <div class="detail-item">
                                <div class="detail-label">Emergency</div>
                                <div class="detail-value">${customer.emergencyContact}</div>
                            </div>
                        ` : ''}
                        ${customer.healthConditions ? `
                            <div class="detail-item">
                                <div class="detail-label">Health Notes</div>
                                <div class="detail-value">${customer.healthConditions}</div>
                            </div>
                        ` : ''}
                    </div>

                    <div class="customer-stats">
                        <div class="stat-item">
                            <div class="stat-number">${customer.totalBookings}</div>
                            <div class="stat-label">Total Bookings</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${this.getMonthsSinceJoin(customer.joinDate)}</div>
                            <div class="stat-label">Months Active</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${this.getAverageBookingsPerMonth(customer)}</div>
                            <div class="stat-label">Avg/Month</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Load classes
    loadClasses() {
        const classesList = document.getElementById('classes-list');
        if (!classesList) return;

        classesList.innerHTML = this.dummyData.classes.map(classItem => `
            <div class="list-item">
                <div class="item-info">
                    <h4>${classItem.name}</h4>
                    <p>${classItem.description}</p>
                    <small>Instructor: ${classItem.instructor} | Schedule: ${classItem.schedule}</small>
                </div>
                <div class="item-meta">
                    <div class="service-price">$${classItem.price}</div>
                    <div>${classItem.duration} minutes</div>
                    <div class="list-item-actions">
                        <button class="action-btn edit" onclick="adminManager.editClass('${classItem.id}')">Edit</button>
                        <button class="action-btn delete" onclick="adminManager.deleteClass('${classItem.id}')">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Load appointments
    loadAppointments() {
        const appointmentsTable = document.getElementById('appointments-tbody');
        if (!appointmentsTable) return;

        appointmentsTable.innerHTML = this.dummyData.appointments.map(appointment => `
            <tr>
                <td>${this.formatDate(appointment.date)} ${appointment.time}</td>
                <td>${appointment.customer}</td>
                <td>${appointment.trainer}</td>
                <td>${appointment.service}</td>
                <td>${appointment.duration} min</td>
                <td><span class="status-badge ${appointment.status}">${appointment.status}</span></td>
                <td>
                    <button class="action-btn edit" onclick="adminManager.viewAppointment('${appointment.id}')">View</button>
                    <button class="action-btn delete" onclick="adminManager.cancelAppointment('${appointment.id}')">Cancel</button>
                </td>
            </tr>
        `).join('');
    }

    // Load outlets
    loadOutlets() {
        const outletsGrid = document.getElementById('outlets-grid');
        if (!outletsGrid) return;

        outletsGrid.innerHTML = this.dummyData.outlets.map(outlet => `
            <div class="outlet-card">
                <div class="outlet-header">
                    <div>
                        <div class="outlet-name">${outlet.name}</div>
                        <div class="outlet-address">${outlet.address}</div>
                    </div>
                    <div class="outlet-actions">
                        <button class="action-btn edit" onclick="adminManager.editOutlet('${outlet.id}')">Edit</button>
                        <button class="action-btn delete" onclick="adminManager.deleteOutlet('${outlet.id}')">Delete</button>
                    </div>
                </div>
                <p><strong>Phone:</strong> ${outlet.phone}</p>
                <p><strong>Manager:</strong> ${outlet.manager}</p>
                <p><strong>Status:</strong> <span class="status-badge ${outlet.status}">${outlet.status}</span></p>
            </div>
        `).join('');
    }

    // Load holidays
    loadHolidays() {
        const holidaysList = document.getElementById('holidays-list');
        if (!holidaysList) return;

        holidaysList.innerHTML = this.dummyData.holidays.map(holiday => `
            <div class="list-item">
                <div class="item-info">
                    <h4>${holiday.name}</h4>
                    <p>${this.formatDate(holiday.date)} - ${holiday.type} holiday</p>
                    <small>${holiday.recurring ? 'Recurring annually' : 'One-time event'}</small>
                </div>
                <div class="item-meta">
                    <div class="list-item-actions">
                        <button class="action-btn edit" onclick="adminManager.editHoliday('${holiday.id}')">Edit</button>
                        <button class="action-btn delete" onclick="adminManager.deleteHoliday('${holiday.id}')">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Load users
    loadUsers() {
        const usersGrid = document.getElementById('users-grid');
        if (!usersGrid) return;

        usersGrid.innerHTML = this.dummyData.users.map(user => `
            <div class="user-card">
                <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                <div class="user-name">${user.name}</div>
                <div class="user-role">${user.role}</div>
                <div class="user-role">${user.specialization}</div>
                <div class="user-locations">
                    ${user.locations.map(location => 
                        `<span class="location-tag">${location}</span>`
                    ).join('')}
                </div>
                <div class="user-actions">
                    <button class="action-btn edit" onclick="adminManager.editUser('${user.id}')">Edit</button>
                    <button class="action-btn delete" onclick="adminManager.deleteUser('${user.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // Load staff schedule
    loadStaffSchedule() {
        const tabsContainer = document.getElementById('staff-schedule-tabs');
        if (!tabsContainer) return;

        const allStaff = this.dummyData.users;

        if (allStaff.length === 0) {
            tabsContainer.innerHTML = '<p>No staff members found. Please add staff first.</p>';
            return;
        }

        tabsContainer.innerHTML = allStaff.map((member, index) => `
            <button class="schedule-tab ${index === 0 ? 'active' : ''}" 
                    onclick="adminManager.showStaffSchedule('${member.id}')">
                <div class="tab-avatar">${member.name.charAt(0).toUpperCase()}</div>
                <span>${member.name}</span>
            </button>
        `).join('');

        // Show first staff schedule
        if (allStaff.length > 0) {
            this.showStaffSchedule(allStaff[0].id);
        }
    }

    // Show specific staff schedule
    showStaffSchedule(staffId) {
        const allStaff = this.dummyData.users;
        const staff = allStaff.find(s => s.id === staffId);
        if (!staff) return;

        // Update active tab
        document.querySelectorAll('.schedule-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.closest('.schedule-tab').classList.add('active');

        // Generate schedule form
        const scheduleContent = document.getElementById('schedule-content');
        if (!scheduleContent) return;

        const days = [
            { key: 'monday', label: 'Monday' },
            { key: 'tuesday', label: 'Tuesday' },
            { key: 'wednesday', label: 'Wednesday' },
            { key: 'thursday', label: 'Thursday' },
            { key: 'friday', label: 'Friday' },
            { key: 'saturday', label: 'Saturday' },
            { key: 'sunday', label: 'Sunday' }
        ];
        
        scheduleContent.innerHTML = `
            <div class="schedule-header">
                <div class="staff-info">
                    <div class="staff-avatar-large">${staff.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <h3>${staff.name}'s Schedule</h3>
                        <p class="staff-role">${staff.role}</p>
                    </div>
                </div>
                <div class="schedule-actions">
                    <button class="btn secondary" onclick="adminManager.copyScheduleTemplate('${staffId}')">
                        Copy Template
                    </button>
                    <button class="btn primary" onclick="adminManager.saveSchedule('${staffId}')">
                        Save Changes
                    </button>
                </div>
            </div>
            <div class="schedule-grid-modern">
                ${days.map(day => {
                    const schedule = { isWorking: true, startTime: '09:00', endTime: '17:00' };
                    return `
                        <div class="schedule-day-card ${schedule.isWorking ? 'working' : 'off'}">
                            <div class="day-header">
                                <div class="day-info">
                                    <h4>${day.label}</h4>
                                    <span class="day-status">${schedule.isWorking ? 'Working' : 'Day Off'}</span>
                                </div>
                                <label class="modern-toggle">
                                    <input type="checkbox" ${schedule.isWorking ? 'checked' : ''}
                                           onchange="adminManager.toggleStaffWorkDay('${staffId}', '${day.key}', this.checked)">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="time-section ${!schedule.isWorking ? 'disabled' : ''}">
                                <div class="time-input-group">
                                    <label>Start Time</label>
                                    <input type="time" value="${schedule.startTime}" 
                                           class="modern-time-input"
                                           onchange="adminManager.updateStaffSchedule('${staffId}', '${day.key}', 'startTime', this.value)"
                                           ${!schedule.isWorking ? 'disabled' : ''}>
                                </div>
                                <div class="time-separator">to</div>
                                <div class="time-input-group">
                                    <label>End Time</label>
                                    <input type="time" value="${schedule.endTime}"
                                           class="modern-time-input"
                                           onchange="adminManager.updateStaffSchedule('${staffId}', '${day.key}', 'endTime', this.value)"
                                           ${!schedule.isWorking ? 'disabled' : ''}>
                                </div>
                            </div>
                            <div class="schedule-summary">
                                ${schedule.isWorking ? 
                                    `<span class="hours-count">${this.calculateHours(schedule.startTime, schedule.endTime)} hours</span>` :
                                    '<span class="day-off-text">Not working</span>'
                                }
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // Calculate hours between two times
    calculateHours(startTime, endTime) {
        const start = new Date(`2000-01-01 ${startTime}`);
        const end = new Date(`2000-01-01 ${endTime}`);
        const diff = (end - start) / (1000 * 60 * 60);
        return diff > 0 ? diff.toFixed(1) : '0';
    }

    // Utility functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    getMonthsSinceJoin(joinDate) {
        const join = new Date(joinDate);
        const now = new Date();
        const diffTime = Math.abs(now - join);
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
        return diffMonths;
    }

    getAverageBookingsPerMonth(customer) {
        const months = this.getMonthsSinceJoin(customer.joinDate);
        return Math.round(customer.totalBookings / Math.max(months, 1));
    }

    // Modal functions
    openModal(title, content) {
        const modal = document.getElementById('modal-content');
        const overlay = document.getElementById('modal-overlay');
        
        if (modal && overlay) {
            modal.innerHTML = `
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="adminManager.closeModal()">×</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            `;
            
            overlay.classList.add('active');
        }
    }

    closeModal() {
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    // Modal forms with full functionality
    openCustomerModal() {
        const content = `
            <form onsubmit="adminManager.saveCustomer(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label for="customer-first-name">First Name</label>
                        <input type="text" id="customer-first-name" required>
                    </div>
                    <div class="form-group">
                        <label for="customer-last-name">Last Name</label>
                        <input type="text" id="customer-last-name" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="customer-email">Email</label>
                        <input type="email" id="customer-email" required>
                    </div>
                    <div class="form-group">
                        <label for="customer-phone">Phone</label>
                        <input type="tel" id="customer-phone" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="customer-membership">Membership Type</label>
                    <select id="customer-membership" required>
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                        <option value="vip">VIP</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="customer-emergency">Emergency Contact</label>
                    <input type="text" id="customer-emergency" placeholder="Name and phone number">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn secondary" onclick="adminManager.closeModal()">Cancel</button>
                    <button type="submit" class="btn primary">Add Customer</button>
                </div>
            </form>
        `;
        this.openModal('Add Customer', content);
    }

    openClassModal() {
        const content = `
            <form onsubmit="adminManager.saveClass(event)">
                <div class="form-group">
                    <label for="class-name">Class Name</label>
                    <input type="text" id="class-name" required>
                </div>
                <div class="form-group">
                    <label for="class-description">Description</label>
                    <textarea id="class-description" rows="3"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="class-instructor">Instructor</label>
                        <select id="class-instructor" required>
                            <option value="">Select Instructor</option>
                            <option value="sarah">Sarah Johnson</option>
                            <option value="mike">Mike Chen</option>
                            <option value="emily">Emily Rodriguez</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="class-duration">Duration (minutes)</label>
                        <input type="number" id="class-duration" value="60" min="15" step="15" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="class-price">Price ($)</label>
                        <input type="number" id="class-price" value="25" min="0" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="class-max">Max Participants</label>
                        <input type="number" id="class-max" value="15" min="1" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="class-schedule">Schedule</label>
                    <input type="text" id="class-schedule" placeholder="e.g., Mon/Wed/Fri 7:00 AM">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn secondary" onclick="adminManager.closeModal()">Cancel</button>
                    <button type="submit" class="btn primary">Add Class</button>
                </div>
            </form>
        `;
        this.openModal('Add Class', content);
    }

    openAppointmentModal() {
        const content = `
            <form onsubmit="adminManager.saveAppointment(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label for="appointment-customer">Customer</label>
                        <select id="appointment-customer" required>
                            <option value="">Select Customer</option>
                            <option value="john">John Smith</option>
                            <option value="maria">Maria Garcia</option>
                            <option value="robert">Robert Johnson</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="appointment-trainer">Trainer</label>
                        <select id="appointment-trainer" required>
                            <option value="">Select Trainer</option>
                            <option value="sarah">Sarah Johnson</option>
                            <option value="mike">Mike Chen</option>
                            <option value="emily">Emily Rodriguez</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="appointment-date">Date</label>
                        <input type="date" id="appointment-date" required>
                    </div>
                    <div class="form-group">
                        <label for="appointment-time">Time</label>
                        <input type="time" id="appointment-time" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="appointment-service">Service</label>
                        <select id="appointment-service" required>
                            <option value="">Select Service</option>
                            <option value="personal">Personal Training</option>
                            <option value="strength">Strength Training</option>
                            <option value="cardio">Cardio Session</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="appointment-duration">Duration (minutes)</label>
                        <select id="appointment-duration" required>
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60" selected>60 minutes</option>
                            <option value="90">90 minutes</option>
                        </select>
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn secondary" onclick="adminManager.closeModal()">Cancel</button>
                    <button type="submit" class="btn primary">Book Appointment</button>
                </div>
            </form>
        `;
        this.openModal('Book Appointment', content);
    }

    openOutletModal() {
        const content = `
            <form onsubmit="adminManager.saveOutlet(event)">
                <div class="form-group">
                    <label for="outlet-name">Outlet Name</label>
                    <input type="text" id="outlet-name" required>
                </div>
                <div class="form-group">
                    <label for="outlet-address">Address</label>
                    <textarea id="outlet-address" rows="3" required></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="outlet-phone">Phone</label>
                        <input type="tel" id="outlet-phone" required>
                    </div>
                    <div class="form-group">
                        <label for="outlet-manager">Manager</label>
                        <input type="text" id="outlet-manager" required>
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn secondary" onclick="adminManager.closeModal()">Cancel</button>
                    <button type="submit" class="btn primary">Add Outlet</button>
                </div>
            </form>
        `;
        this.openModal('Add Outlet', content);
    }

    openHolidayModal() {
        const content = `
            <form onsubmit="adminManager.saveHoliday(event)">
                <div class="form-group">
                    <label for="holiday-name">Holiday Name</label>
                    <input type="text" id="holiday-name" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="holiday-date">Date</label>
                        <input type="date" id="holiday-date" required>
                    </div>
                    <div class="form-group">
                        <label for="holiday-type">Type</label>
                        <select id="holiday-type" required>
                            <option value="public">Public Holiday</option>
                            <option value="business">Business Holiday</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="holiday-recurring">
                        Recurring annually
                    </label>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn secondary" onclick="adminManager.closeModal()">Cancel</button>
                    <button type="submit" class="btn primary">Add Holiday</button>
                </div>
            </form>
        `;
        this.openModal('Add Holiday', content);
    }

    openUserModal() {
        const content = `
            <form onsubmit="adminManager.saveUser(event)">
                <div class="form-group">
                    <label for="user-name">Full Name</label>
                    <input type="text" id="user-name" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="user-email">Email</label>
                        <input type="email" id="user-email" required>
                    </div>
                    <div class="form-group">
                        <label for="user-role">Role</label>
                        <select id="user-role" required>
                            <option value="">Select Role</option>
                            <option value="Personal Trainer">Personal Trainer</option>
                            <option value="Yoga Instructor">Yoga Instructor</option>
                            <option value="Manager">Manager</option>
                            <option value="Receptionist">Receptionist</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="user-specialization">Specialization</label>
                    <input type="text" id="user-specialization" placeholder="e.g., Weight Training, Yoga, Cardio">
                </div>
                <div class="form-group">
                    <label class="form-label-modern">Available Locations</label>
                    <div class="location-selector">
                        <div class="location-option" data-location-id="1" onclick="adminManager.toggleLocationSelection(this)">
                            <div class="location-option-content">
                                <div class="location-icon">📍</div>
                                <div class="location-details">
                                    <div class="location-name">Downtown Fitness Center</div>
                                    <div class="location-address">123 Main St, Downtown</div>
                                </div>
                                <div class="selection-indicator">
                                    <div class="checkmark">✓</div>
                                </div>
                            </div>
                        </div>
                        <div class="location-option" data-location-id="2" onclick="adminManager.toggleLocationSelection(this)">
                            <div class="location-option-content">
                                <div class="location-icon">📍</div>
                                <div class="location-details">
                                    <div class="location-name">Westside Gym</div>
                                    <div class="location-address">456 Oak Ave, Westside</div>
                                </div>
                                <div class="selection-indicator">
                                    <div class="checkmark">✓</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn secondary" onclick="adminManager.closeModal()">Cancel</button>
                    <button type="submit" class="btn primary">Add Staff</button>
                </div>
            </form>
        `;
        this.openModal('Add Staff', content);
    }

    // Toggle location selection in modals
    toggleLocationSelection(element) {
        element.classList.toggle('selected');
    }

    // Save functions for forms
    saveCustomer(event) {
        event.preventDefault();
        Utils.showNotification('Customer added successfully!', 'success');
        this.closeModal();
        this.loadCustomers();
    }

    saveClass(event) {
        event.preventDefault();
        Utils.showNotification('Class added successfully!', 'success');
        this.closeModal();
        this.loadClasses();
    }

    saveAppointment(event) {
        event.preventDefault();
        Utils.showNotification('Appointment booked successfully!', 'success');
        this.closeModal();
        this.loadAppointments();
    }

    saveOutlet(event) {
        event.preventDefault();
        Utils.showNotification('Outlet added successfully!', 'success');
        this.closeModal();
        this.loadOutlets();
    }

    saveHoliday(event) {
        event.preventDefault();
        Utils.showNotification('Holiday added successfully!', 'success');
        this.closeModal();
        this.loadHolidays();
    }

    saveUser(event) {
        event.preventDefault();
        Utils.showNotification('Staff member added successfully!', 'success');
        this.closeModal();
        this.loadUsers();
    }

    // Placeholder edit/delete functions
    editClass(id) { console.log('Edit class:', id); }
    deleteClass(id) { console.log('Delete class:', id); }
    viewAppointment(id) { console.log('View appointment:', id); }
    cancelAppointment(id) { console.log('Cancel appointment:', id); }
    editOutlet(id) { console.log('Edit outlet:', id); }
    deleteOutlet(id) { console.log('Delete outlet:', id); }
    editHoliday(id) { console.log('Edit holiday:', id); }
    deleteHoliday(id) { console.log('Delete holiday:', id); }
    editUser(id) { console.log('Edit user:', id); }
    deleteUser(id) { console.log('Delete user:', id); }

    // Schedule functions
    updateStaffSchedule(staffId, day, field, value) {
        console.log('Update schedule:', staffId, day, field, value);
    }

    toggleStaffWorkDay(staffId, day, isWorking) {
        console.log('Toggle work day:', staffId, day, isWorking);
        this.showStaffSchedule(staffId);
    }

    copyScheduleTemplate(staffId) {
        console.log('Copy schedule template:', staffId);
    }

    saveSchedule(staffId) {
        console.log('Save schedule:', staffId);
    }

    // Load dashboard data periodically
    loadDashboardData() {
        this.loadDashboard();
        setTimeout(() => this.loadDashboardData(), 300000);
    }

    // Logout
    logout() {
        storage.remove('currentUser');
        this.currentUser = null;
        this.currentBusiness = null;
        this.showLogin();
    }
}

// Global functions for HTML onclick events
function adminLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-password')?.value;
    
    if (!email || !password) {
        Utils.showNotification('Please enter email and password', 'error');
        return;
    }
    
    // Demo login - accept any credentials
    const demoUser = {
        email: email,
        name: 'Demo Owner',
        role: 'owner'
    };
    
    storage.setCurrentUser(demoUser);
    if (window.adminManager) {
        window.adminManager.currentUser = demoUser;
        window.adminManager.loadUserBusiness();
        window.adminManager.showDashboard();
    }
    Utils.showNotification('Login successful!', 'success');
}

function logout() {
    if (window.adminManager) {
        window.adminManager.logout();
    }
}

function saveBusinessProfile(event) {
    event.preventDefault();
    Utils.showNotification('Business profile saved successfully!', 'success');
}

function openCustomerModal() {
    if (window.adminManager) {
        window.adminManager.openCustomerModal();
    }
}

function openClassModal() {
    if (window.adminManager) {
        window.adminManager.openClassModal();
    }
}

function openAppointmentModal() {
    if (window.adminManager) {
        window.adminManager.openAppointmentModal();
    }
}

function openOutletModal() {
    if (window.adminManager) {
        window.adminManager.openOutletModal();
    }
}

function openHolidayModal() {
    if (window.adminManager) {
        window.adminManager.openHolidayModal();
    }
}

function openUserModal() {
    if (window.adminManager) {
        window.adminManager.openUserModal();
    }
}

// Initialize admin manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('admin-login')) {
        window.adminManager = new AdminManager();
        adminManager.init();
    }
});

// Make AdminManager available globally
window.AdminManager = AdminManager;