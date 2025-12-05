const servicesData = {
    categories: [
        { id: 'hair', name: 'Hair', icon: 'fa-scissors', image: 'https://images.unsplash.com/photo-1593702295094-aea22597af65?q=80&w=800&auto=format&fit=crop' },
        { id: 'face', name: 'Face', icon: 'fa-face-smile', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=800&auto=format&fit=crop' },
        { id: 'shaving', name: 'Shaving', icon: 'fa-user-tie', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop' },
        { id: 'combo', name: 'Combo', icon: 'fa-layer-group', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop' }
    ],
    items: {
        hair: [
            { id: 'h1', name: 'Wash & Haircut + Eyebrow Trim', price: 70, duration: 45, description: 'Complete grooming package.' },
            { id: 'h2', name: 'Wash & Haircut', price: 60, duration: 45, description: 'Refreshing wash followed by a precision cut.' },
            { id: 'h3', name: 'Haircut', price: 55, duration: 45, description: 'Classic precision haircut.' },
            { id: 'h4', name: 'Wash & Style', price: 40, duration: 30, description: 'Wash and professional styling.' }
        ],
        face: [
            { id: 'f1', name: 'Face Massage', price: 45, duration: 30, description: 'Relaxing facial massage.' },
            { id: 'f2', name: 'Waxing (Nose)', price: 35, duration: 15, description: 'Quick and clean nose waxing.' },
            { id: 'f3', name: 'Waxing (Ear)', price: 35, duration: 15, description: 'Quick and clean ear waxing.' },
            { id: 'f4', name: 'Black Mask', price: 45, duration: 30, description: 'Deep cleansing black mask.' }
        ],
        shaving: [
            { id: 's1', name: 'Hot Towel Clean Shave', price: 45, duration: 30, description: 'Traditional hot towel shave.' },
            { id: 's2', name: 'Beard Trim', price: 45, duration: 30, description: 'Shape and trim your beard.' }
        ],
        combo: [
            { id: 'c1', name: 'COMBO A', price: 195, duration: 90, description: 'Wash & Cut, Eyebrow Trim, Nose Waxing, Face Massage, Black Mask' },
            { id: 'c2', name: 'COMBO B', price: 150, duration: 75, description: 'Wash & Cut, Eyebrow Trim, Nose Waxing, Black Mask' },
            { id: 'c3', name: 'COMBO C', price: 150, duration: 75, description: 'Wash & Cut, Eyebrow Trim, Nose Waxing, Face Massage' },
            { id: 'c4', name: 'Wash & Haircut + Hot Towel Clean Shave', price: 105, duration: 75, description: 'Full service haircut and shave.' },
            { id: 'c5', name: 'Wash & Haircut + Face Massage', price: 105, duration: 60, description: 'Haircut with relaxing face massage.' },
            { id: 'c6', name: 'Wash & Haircut + Beard Trim', price: 105, duration: 75, description: 'Haircut and beard maintenance.' },
            { id: 'c7', name: 'Haircut + Hot Towel Clean Shave', price: 100, duration: 75, description: 'Precision cut and shave.' },
            { id: 'c8', name: 'Haircut + Beard Trim', price: 100, duration: 75, description: 'Cut and beard trim.' }
        ]
    },
    addons: [
        { id: 'a1', name: 'Eyebrow Trim', price: 10, duration: 0 },
        { id: 'a2', name: 'Face Massage', price: 45, duration: 30 },
        { id: 'a3', name: 'Waxing (Nose)', price: 35, duration: 15 },
        { id: 'a4', name: 'Black Mask', price: 45, duration: 30 }
    ],
    barbers: [
        { id: 'b1', name: 'Alex', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { id: 'b2', name: 'Sam', image: 'https://randomuser.me/api/portraits/men/45.jpg' },
        { id: 'b3', name: 'Jordan', image: 'https://randomuser.me/api/portraits/men/22.jpg' },
        { id: 'b4', name: 'Mike', image: 'https://randomuser.me/api/portraits/men/11.jpg' }
    ]
};
