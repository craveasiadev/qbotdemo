// Admin Customer management functionality
class AdminCustomerManager {
    constructor() {
        this.customers = this.generateDummyCustomers();
        this.filteredCustomers = [...this.customers];
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderCustomers();
    }

    bindEvents() {
        const searchInput = document.getElementById('customer-search');
        const membershipFilter = document.getElementById('membership-filter');

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.filterCustomers();
            });
        }

        if (membershipFilter) {
            membershipFilter.addEventListener('change', () => {
                this.filterCustomers();
            });
        }
    }

    generateDummyCustomers() {
        const customers = [
            {
                id: 1,
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
                id: 2,
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
                id: 3,
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
            },
            {
                id: 4,
                firstName: 'Lisa',
                lastName: 'Brown',
                email: 'lisa.brown@email.com',
                phone: '(555) 456-7890',
                membershipType: 'premium',
                joinDate: '2024-04-05',
                totalBookings: 18,
                lastVisit: '2024-12-17',
                emergencyContact: 'Tom Brown (555) 456-7891'
            },
            {
                id: 5,
                firstName: 'Michael',
                lastName: 'Davis',
                email: 'michael.davis@email.com',
                phone: '(555) 567-8901',
                membershipType: 'basic',
                joinDate: '2024-05-12',
                totalBookings: 9,
                lastVisit: '2024-12-16',
                emergencyContact: 'Sarah Davis (555) 567-8902'
            },
            {
                id: 6,
                firstName: 'Jennifer',
                lastName: 'Wilson',
                email: 'jennifer.w@email.com',
                phone: '(555) 678-9012',
                membershipType: 'vip',
                joinDate: '2024-06-08',
                totalBookings: 21,
                lastVisit: '2024-12-19',
                emergencyContact: 'Mark Wilson (555) 678-9013'
            },
            {
                id: 7,
                firstName: 'David',
                lastName: 'Miller',
                email: 'david.miller@email.com',
                phone: '(555) 789-0123',
                membershipType: 'premium',
                joinDate: '2024-07-22',
                totalBookings: 12,
                lastVisit: '2024-12-15',
                emergencyContact: 'Emma Miller (555) 789-0124'
            },
            {
                id: 8,
                firstName: 'Sarah',
                lastName: 'Jones',
                email: 'sarah.jones@email.com',
                phone: '(555) 890-1234',
                membershipType: 'basic',
                joinDate: '2024-08-14',
                totalBookings: 7,
                lastVisit: '2024-12-14',
                emergencyContact: 'Paul Jones (555) 890-1235'
            },
            {
                id: 9,
                firstName: 'James',
                lastName: 'Taylor',
                email: 'james.taylor@email.com',
                phone: '(555) 901-2345',
                membershipType: 'vip',
                joinDate: '2024-09-03',
                totalBookings: 16,
                lastVisit: '2024-12-18',
                emergencyContact: 'Mary Taylor (555) 901-2346'
            },
            {
                id: 10,
                firstName: 'Amanda',
                lastName: 'White',
                email: 'amanda.white@email.com',
                phone: '(555) 012-3456',
                membershipType: 'premium',
                joinDate: '2024-10-11',
                totalBookings: 8,
                lastVisit: '2024-12-17',
                emergencyContact: 'Steve White (555) 012-3457'
            },
            {
                id: 11,
                firstName: 'Christopher',
                lastName: 'Lee',
                email: 'chris.lee@email.com',
                phone: '(555) 123-4567',
                membershipType: 'basic',
                joinDate: '2024-11-02',
                totalBookings: 4,
                lastVisit: '2024-12-13',
                emergencyContact: 'Helen Lee (555) 123-4568'
            },
            {
                id: 12,
                firstName: 'Jessica',
                lastName: 'Martinez',
                email: 'jessica.martinez@email.com',
                phone: '(555) 234-5678',
                membershipType: 'vip',
                joinDate: '2024-11-18',
                totalBookings: 6,
                lastVisit: '2024-12-19',
                emergencyContact: 'Luis Martinez (555) 234-5679',
                healthConditions: 'Asthma'
            }
        ];

        return customers;
    }

    filterCustomers() {
        const searchTerm = document.getElementById('customer-search')?.value.toLowerCase() || '';
        const membershipFilter = document.getElementById('membership-filter')?.value || '';

        this.filteredCustomers = this.customers.filter(customer => {
            const matchesSearch = !searchTerm || 
                customer.firstName.toLowerCase().includes(searchTerm) ||
                customer.lastName.toLowerCase().includes(searchTerm) ||
                customer.email.toLowerCase().includes(searchTerm);

            const matchesMembership = !membershipFilter || customer.membershipType === membershipFilter;

            return matchesSearch && matchesMembership;
        });

        this.renderCustomers();
    }

    renderCustomers() {
        const grid = document.getElementById('customers-grid');
        if (!grid) return;

        grid.innerHTML = this.filteredCustomers.map(customer => {
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
}

// Initialize admin customer manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('customers-grid')) {
        window.adminCustomerManager = new AdminCustomerManager();
    }
});