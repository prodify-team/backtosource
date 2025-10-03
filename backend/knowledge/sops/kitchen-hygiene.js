module.exports = {
  id: "kitchen-hygiene",
  title: "Kitchen Hygiene Standards - Daily SOPs",
  category: "sops",
  priority: "critical",
  
  content: {
    chef: {
      standards: [
        "Hand Protocol: 20 seconds soap wash before every task",
        "Uniform: Clean apron daily, hair net mandatory, closed shoes",
        "Food Safety: Raw-cooked separation, FIFO rotation strict",
        "Temperature Control: Cold storage 4°C, hot holding 65°C+",
        "Equipment: Daily sanitization of all tools and surfaces",
        "Team Monitoring: Ensure all kitchen staff follow protocols"
      ],
      
      responsibilities: [
        "Lead by example in hygiene practices",
        "Train junior chefs on proper procedures", 
        "Monitor team compliance throughout shift",
        "Report any hygiene violations immediately",
        "Maintain hygiene checklist and documentation"
      ],
      
      wrongWay: "Dirty hands se food handle karna या team ki hygiene ignore karna",
      rightWay: "Every step mein cleanliness maintain karna और team ko guide karna",
      
      assignment: "Team ko hygiene training diye aur daily checklist implement kariye",
      
      dailyTip: "Kitchen ki cleanliness restaurant ki reputation hai! Lead by example! 🏆"
    },
    
    waiter: {
      standards: [
        "Personal Hygiene: Clean uniform, trimmed nails, fresh breath",
        "Hand Sanitization: Before serving, between tables, after cleaning",
        "Table Service: Clean serving tools, proper plate handling",
        "Dining Area: Clean tables, chairs, floor maintenance",
        "Guest Safety: Hand sanitizer available, maintain cleanliness"
      ],
      
      serviceHygiene: [
        "Never touch food directly with hands",
        "Use serving spoons and tongs properly",
        "Clean and sanitize tables between guests",
        "Maintain personal grooming standards",
        "Report any cleanliness issues immediately"
      ],
      
      wrongWay: "Dirty uniform mein guests ko serve karna या careless table cleaning",
      rightWay: "Impeccable presentation aur thorough cleaning between services",
      
      assignment: "Today 10 tables ko perfect hygiene standards se serve kariye",
      
      dailyTip: "Aapki cleanliness restaurant ka first impression hai! Guests notice everything! 👔"
    },
    
    "delivery-boy": {
      standards: [
        "Personal Hygiene: Clean uniform, helmet, sanitized hands",
        "Vehicle Cleanliness: Clean delivery box, sanitized surfaces daily",
        "Food Safety: Insulated bags, temperature maintenance check",
        "Customer Interaction: Maintain distance, use hand sanitizer",
        "Packaging: Check sealed containers, no spillage, clean presentation"
      ],
      
      deliveryProtocol: [
        "Sanitize hands before handling food packages",
        "Check delivery bag cleanliness before each shift",
        "Maintain cold chain for temperature-sensitive items",
        "Use contactless delivery when possible",
        "Report any packaging or hygiene issues"
      ],
      
      wrongWay: "Dirty delivery bag ya careless food handling",
      rightWay: "Food safety priority aur professional appearance maintain karna",
      
      assignment: "Today 10 deliveries mein perfect hygiene protocol follow kariye",
      
      dailyTip: "Aap restaurant ka mobile ambassador hain! Cleanliness reflects our brand! 🏍️"
    },
    
    supervisor: {
      responsibilities: [
        "Team Monitoring: Daily hygiene checks, uniform inspection",
        "Training Oversight: Regular hygiene training sessions conduct",
        "Compliance: Health department standards, audit preparation",
        "Documentation: Hygiene checklists, incident reports maintain",
        "Corrective Action: Immediate fixes, staff counseling when needed"
      ],
      
      auditPoints: [
        "Personal hygiene of all staff members",
        "Cleanliness of work areas and equipment",
        "Proper food storage and temperature control",
        "Waste management and disposal procedures",
        "Hand washing stations and sanitizer availability"
      ],
      
      wrongWay: "Team ki hygiene ignore karna या documentation skip karna",
      rightWay: "Proactive monitoring aur continuous improvement focus",
      
      assignment: "Team ke liye weekly hygiene audit conduct kariye aur improvement plan banayiye",
      
      dailyTip: "Team ki hygiene aapki responsibility hai! Regular monitoring prevents problems! 📋"
    },
    
    trainee: {
      basics: [
        "Personal Hygiene: Daily bath, clean clothes, trimmed nails mandatory",
        "Hand Washing: 20 seconds with soap, before every task without fail",
        "Food Safety: Never touch food directly, always use gloves/tools",
        "Workspace: Keep your area clean and organized always",
        "Questions: When in doubt about hygiene, ask supervisor immediately"
      ],
      
      learningPath: [
        "Week 1: Personal hygiene and hand washing techniques",
        "Week 2: Food safety basics and cross-contamination prevention", 
        "Week 3: Equipment cleaning and sanitization procedures",
        "Week 4: Advanced hygiene practices and quality standards"
      ],
      
      wrongWay: "Hygiene rules ko ignore karna या 'chalta hai' attitude",
      rightWay: "Every rule ko seriously follow karna aur questions puchna",
      
      assignment: "Hygiene checklist banayiye aur daily follow kariye. Mentor se feedback liye",
      
      dailyTip: "Good habits शुरू से ही बनाइए! Hygiene mein compromise never! ✨"
    }
  },
  
  commonViolations: [
    "Not washing hands properly",
    "Wearing dirty uniforms", 
    "Cross-contamination of raw and cooked food",
    "Improper temperature control",
    "Unclean work surfaces"
  ],
  
  consequences: [
    "First violation: Verbal warning and retraining",
    "Second violation: Written warning", 
    "Third violation: Suspension and mandatory training",
    "Serious violations: Immediate action as per policy"
  ]
};