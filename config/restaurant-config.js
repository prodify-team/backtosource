// Restaurant Configuration - Easy to modify locations and roles

const RESTAURANT_CONFIG = {
  // Available Roles
  roles: {
    'owner': {
      hindi: 'मालिक',
      english: 'Owner',
      permissions: ['all'],
      description: 'Full access to all restaurant operations'
    },
    'regional-manager': {
      hindi: 'क्षेत्रीय प्रबंधक',
      english: 'Regional Manager',
      permissions: ['manage-multiple-locations', 'staff-management', 'reports'],
      description: 'Manages multiple restaurant locations'
    },
    'restaurant-manager': {
      hindi: 'रेस्टोरेंट मैनेजर',
      english: 'Restaurant Manager',
      permissions: ['location-management', 'staff-management', 'inventory'],
      description: 'Manages single restaurant location'
    },
    'head-chef': {
      hindi: 'मुख्य रसोइया',
      english: 'Head Chef',
      permissions: ['kitchen-management', 'recipe-access', 'staff-training'],
      description: 'Leads kitchen operations and menu planning'
    },
    'chef': {
      hindi: 'रसोइया',
      english: 'Chef',
      permissions: ['cooking', 'recipe-access', 'inventory-update'],
      description: 'Prepares food and maintains quality standards'
    },
    'waiter': {
      hindi: 'वेटर',
      english: 'Waiter',
      permissions: ['order-taking', 'customer-service', 'table-management'],
      description: 'Serves customers and manages dining experience'
    },
    'cashier': {
      hindi: 'कैशियर',
      english: 'Cashier',
      permissions: ['billing', 'payment-processing', 'daily-reports'],
      description: 'Handles payments and billing operations'
    },
    'cleaner': {
      hindi: 'सफाई कर्मचारी',
      english: 'Cleaner',
      permissions: ['cleaning-schedules', 'hygiene-protocols'],
      description: 'Maintains cleanliness and hygiene standards'
    },
    'delivery-boy': {
      hindi: 'डिलीवरी बॉय',
      english: 'Delivery Boy',
      permissions: ['delivery-management', 'customer-interaction'],
      description: 'Handles food delivery and customer interaction'
    },
    'supervisor': {
      hindi: 'सुपरवाइजर',
      english: 'Supervisor',
      permissions: ['team-coordination', 'quality-control', 'training'],
      description: 'Supervises daily operations and staff coordination'
    },
    'trainee': {
      hindi: 'प्रशिक्षु',
      english: 'Trainee',
      permissions: ['learning-access', 'basic-tasks'],
      description: 'Learning restaurant operations and procedures'
    }
  },

  // Restaurant Locations
  locations: {
    'delhi-cp': {
      name: 'Delhi - Connaught Place',
      address: 'Block A, Connaught Place, New Delhi - 110001',
      manager: 'राजेश कुमार',
      phone: '+91-11-4567-8901',
      city: 'New Delhi',
      state: 'Delhi',
      region: 'North',
      timezone: 'Asia/Kolkata',
      languages: ['hindi', 'english', 'punjabi']
    },
    'delhi-gk': {
      name: 'Delhi - Greater Kailash',
      address: 'M Block Market, Greater Kailash I, New Delhi - 110048',
      manager: 'सुनील गुप्ता',
      phone: '+91-11-4567-8902',
      city: 'New Delhi',
      state: 'Delhi',
      region: 'North',
      timezone: 'Asia/Kolkata',
      languages: ['hindi', 'english', 'punjabi']
    },
    'mumbai-bandra': {
      name: 'Mumbai - Bandra',
      address: 'Linking Road, Bandra West, Mumbai - 400050',
      manager: 'विकास पटेल',
      phone: '+91-22-4567-8903',
      city: 'Mumbai',
      state: 'Maharashtra',
      region: 'West',
      timezone: 'Asia/Kolkata',
      languages: ['hindi', 'english', 'marathi']
    },
    'mumbai-andheri': {
      name: 'Mumbai - Andheri',
      address: 'Andheri West, Mumbai - 400058',
      manager: 'प्रिया शर्मा',
      phone: '+91-22-4567-8904',
      city: 'Mumbai',
      state: 'Maharashtra',
      region: 'West',
      timezone: 'Asia/Kolkata',
      languages: ['hindi', 'english', 'marathi']
    },
    'bangalore-koramangala': {
      name: 'Bangalore - Koramangala',
      address: '5th Block, Koramangala, Bangalore - 560095',
      manager: 'अर्जुन राव',
      phone: '+91-80-4567-8905',
      city: 'Bangalore',
      state: 'Karnataka',
      region: 'South',
      timezone: 'Asia/Kolkata',
      languages: ['hindi', 'english', 'kannada']
    },
    'bangalore-indiranagar': {
      name: 'Bangalore - Indiranagar',
      address: '100 Feet Road, Indiranagar, Bangalore - 560038',
      manager: 'लक्ष्मी नायर',
      phone: '+91-80-4567-8906',
      city: 'Bangalore',
      state: 'Karnataka',
      region: 'South',
      timezone: 'Asia/Kolkata',
      languages: ['hindi', 'english', 'kannada']
    },
    'pune-fc': {
      name: 'Pune - FC Road',
      address: 'FC Road, Pune - 411005',
      manager: 'अनिल शर्मा',
      phone: '+91-20-4567-8907',
      city: 'Pune',
      state: 'Maharashtra',
      region: 'West',
      timezone: 'Asia/Kolkata',
      languages: ['hindi', 'english', 'marathi']
    },
    'hyderabad-hitech': {
      name: 'Hyderabad - Hi-Tech City',
      address: 'HITEC City, Hyderabad - 500081',
      manager: 'राम कुमार',
      phone: '+91-40-4567-8908',
      city: 'Hyderabad',
      state: 'Telangana',
      region: 'South',
      timezone: 'Asia/Kolkata',
      languages: ['hindi', 'english', 'telugu']
    },
    'chennai-tnagar': {
      name: 'Chennai - T.Nagar',
      address: 'Pondy Bazaar, T.Nagar, Chennai - 600017',
      manager: 'रमेश कुमार',
      phone: '+91-44-4567-8909',
      city: 'Chennai',
      state: 'Tamil Nadu',
      region: 'South',
      timezone: 'Asia/Kolkata',
      languages: ['hindi', 'english', 'tamil']
    },
    'kolkata-saltlake': {
      name: 'Kolkata - Salt Lake',
      address: 'Salt Lake City, Kolkata - 700064',
      manager: 'सुब्रत दास',
      phone: '+91-33-4567-8910',
      city: 'Kolkata',
      state: 'West Bengal',
      region: 'East',
      timezone: 'Asia/Kolkata',
      languages: ['hindi', 'english', 'bengali']
    },
    'ahmedabad-sg': {
      name: 'Ahmedabad - SG Highway',
      address: 'SG Highway, Ahmedabad - 380015',
      manager: 'दीपक पटेल',
      phone: '+91-79-4567-8911',
      city: 'Ahmedabad',
      state: 'Gujarat',
      region: 'West',
      timezone: 'Asia/Kolkata',
      languages: ['hindi', 'english', 'gujarati']
    }
  },

  // Default Settings
  defaults: {
    language: 'hindi',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    workingHours: {
      start: '10:00',
      end: '23:00'
    }
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RESTAURANT_CONFIG;
}