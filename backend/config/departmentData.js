export const INDUSTRIAL_DEPARTMENTS = [
  {
    id: "Chemical & Process Plant",
    name: "Chemical & Process Plant",
    riskLevel: "High Risk",
    icon: "FlaskConical",
    requiredPPE: [
      { id: "helmet", name: "Hard Hat / Safety Helmet", icon: "HardHat", mandatory: true },
      { id: "goggles", name: "Chemical Splash Goggles", icon: "Glasses", mandatory: true },
      { id: "respirator", name: "Gas Mask / Respirator", icon: "ShieldAlert", mandatory: true },
      { id: "gloves", name: "Chemical Resistant Nitrile Gloves", icon: "Hand", mandatory: true },
      { id: "vest", name: "High-Visibility Safety Vest", icon: "Vest", mandatory: true },
      { id: "boots", name: "Steel-Toe Chemical Shoes", icon: "Footprints", mandatory: true }
    ],
    hazards: ["Toxic Gas Vapors", "Acid & Solvent Spills", "High Pressure Lines", "Flammable Liquids"],
    safetyRules: [
      "No open flames or non-explosion proof electronic devices allowed.",
      "Check wind direction socks before entering chemical storage zones.",
      "In case of chemical splash, use Emergency Eye Wash station immediately for 15 minutes."
    ],
    quiz: [
      {
        id: 1,
        question: "What is the primary action if an emergency chemical spill alarm sounds in the Process Plant?",
        options: [
          "Run into the control room and lock the doors",
          "Evacuate crosswind/upwind towards designated Emergency Assembly Point A",
          "Ignore if doing a short visit",
          "Continue working normally"
        ],
        answer: 1
      },
      {
        id: 2,
        question: "Which PPE item is mandatory when handling or walking near chemical lines?",
        options: [
          "Regular sunglasses",
          "Earphones",
          "Chemical Splash Goggles & Gas Mask",
          "Cloth gloves"
        ],
        answer: 2
      },
      {
        id: 3,
        question: "Where should chemical splash victims be taken immediately?",
        options: [
          "Main cafeteria",
          "Parking lot",
          "Security gate reception",
          "Emergency Eye Wash / Deluge Shower station"
        ],
        answer: 3
      }
    ]
  },
  {
    id: "Heavy Machinery & Fabrication",
    name: "Heavy Machinery & Fabrication",
    riskLevel: "High Risk",
    icon: "Cog",
    requiredPPE: [
      { id: "helmet", name: "Hard Hat / Safety Helmet", icon: "HardHat", mandatory: true },
      { id: "glasses", name: "Impact Safety Glasses", icon: "Glasses", mandatory: true },
      { id: "ear", name: "Hearing Protection (Ear Defenders)", icon: "VolumeX", mandatory: true },
      { id: "cutgloves", name: "Kevlar Cut-Resistant Gloves", icon: "Hand", mandatory: true },
      { id: "vest", name: "High-Vis Reflective Vest", icon: "Vest", mandatory: true },
      { id: "boots", name: "Steel-Toe Safety Boots", icon: "Footprints", mandatory: true }
    ],
    hazards: ["Overhead Crane Operations", "Heavy Metal Objects", "High Noise (>85dB)", "Pinch Points"],
    safetyRules: [
      "Always remain outside the yellow safety perimeter line of active cranes.",
      "Hearing protection must be worn at all times in fabrication bays.",
      "Never touch moving conveyor belts or robotic arms."
    ],
    quiz: [
      {
        id: 1,
        question: "What must you do when walking under or near overhead crane movement areas?",
        options: [
          "Stand directly under suspended loads to guide them",
          "Take photos with mobile phone",
          "Stay clear of suspended loads and watch for overhead crane warnings",
          "Walk rapidly without looking up"
        ],
        answer: 2
      },
      {
        id: 2,
        question: "Why is ear protection required in Heavy Fabrication zones?",
        options: [
          "Continuous noise levels exceed 85 dB and can cause hearing loss",
          "To block background music",
          "It is optional for visitors",
          "To prevent dust entry into ears"
        ],
        answer: 0
      },
      {
        id: 3,
        question: "What footwear is strictly required in the Fabrication shop?",
        options: [
          "Canvas sneakers",
          "Steel-Toe Safety Boots",
          "Open sandals",
          "Formal leather shoes"
        ],
        answer: 1
      }
    ]
  },
  {
    id: "Electrical & Substation",
    name: "Electrical & Substation",
    riskLevel: "High Risk",
    icon: "Zap",
    requiredPPE: [
      { id: "helmet", name: "Non-Conductive Hard Hat", icon: "HardHat", mandatory: true },
      { id: "arcshield", name: "Arc-Flash Face Shield", icon: "Shield", mandatory: true },
      { id: "rubber-gloves", name: "Dielectric Rubber Gloves", icon: "Hand", mandatory: true },
      { id: "vest", name: "Flame-Resistant High-Vis Vest", icon: "Vest", mandatory: true },
      { id: "boots", name: "Electrical Hazard (EH) Rated Boots", icon: "Footprints", mandatory: true }
    ],
    hazards: ["High Voltage Electricity", "Arc Flash Hazard", "Strong Magnetic Fields"],
    safetyRules: [
      "Remove all metal objects (watches, rings, metal belts) before entry.",
      "Maintain minimum safe clearance distance (1.5 meters) from high voltage panels.",
      "Do not touch electrical control switches or breaker panels."
    ],
    quiz: [
      {
        id: 1,
        question: "What items must be removed before entering the High Voltage Substation?",
        options: [
          "Visitor identification badge",
          "Safety helmet",
          "Safety boots",
          "All metallic objects (watches, rings, metal buckles)"
        ],
        answer: 3
      },
      {
        id: 2,
        question: "What is Arc Flash?",
        options: [
          "A camera flash light",
          "A dangerous electrical explosion that releases high heat and light",
          "A solar panel reflection",
          "A type of LED light"
        ],
        answer: 1
      },
      {
        id: 3,
        question: "Are visitors allowed to operate electrical switches?",
        options: [
          "Yes, if in a hurry",
          "Strictly prohibited unless authorized and accompanied by Chief Electrical Officer",
          "Yes, freely",
          "Only on weekends"
        ],
        answer: 1
      }
    ]
  },
  {
    id: "Central Warehouse & Logistics",
    name: "Central Warehouse & Logistics",
    riskLevel: "Moderate Risk",
    icon: "Boxes",
    requiredPPE: [
      { id: "helmet", name: "Safety Hard Hat", icon: "HardHat", mandatory: true },
      { id: "vest", name: "High-Visibility Vest", icon: "Vest", mandatory: true },
      { id: "boots", name: "Steel-Toe Safety Shoes", icon: "Footprints", mandatory: true }
    ],
    hazards: ["Forklift & AGV Traffic", "Falling Staked Pallets", "Automated Conveyors"],
    safetyRules: [
      "Walk exclusively within marked green pedestrian walkways.",
      "Forklifts always have the right of way.",
      "Make eye contact with forklift operators before crossing aisles."
    ],
    quiz: [
      {
        id: 1,
        question: "Who has the right of way in Warehouse traffic aisles?",
        options: [
          "Pedestrians and visitors",
          "Forklifts and material handling vehicles",
          "Bicycles",
          "Cleaning staff"
        ],
        answer: 1
      },
      {
        id: 2,
        question: "Where should visitors walk inside the Logistics hub?",
        options: [
          "Anywhere in the middle of forklift lanes",
          "On top of pallet racks",
          "Inside marked pedestrian walkways",
          "Behind moving forklifts"
        ],
        answer: 2
      },
      {
        id: 3,
        question: "What PPE makes you visible to heavy forklift operators?",
        options: [
          "Black jacket",
          "Dark raincoat",
          "White lab coat",
          "High-Visibility Reflective Vest"
        ],
        answer: 3
      }
    ]
  },
  {
    id: "Cleanroom & R&D Lab",
    name: "Cleanroom & R&D Lab",
    riskLevel: "Controlled Environment",
    icon: "Microscope",
    requiredPPE: [
      { id: "smock", name: "ESD Cleanroom Smock / Bunny Suit", icon: "Shirt", mandatory: true },
      { id: "goggles", name: "Safety Glasses", icon: "Glasses", mandatory: true },
      { id: "nitrile", name: "Nitrile Gloves", icon: "Hand", mandatory: true },
      { id: "shoecovers", name: "Anti-Static Shoe Covers", icon: "Footprints", mandatory: true }
    ],
    hazards: ["Electrostatic Discharge (ESD)", "Sensitive Lab Instruments", "Chemical Reagents"],
    safetyRules: [
      "Pass through air shower before cleanroom entry.",
      "Touch ESD grounding plate before touching equipment.",
      "No food, drinks, or cosmetics inside the laboratory."
    ],
    quiz: [
      {
        id: 1,
        question: "What is the purpose of anti-static shoe covers and ESD grounding?",
        options: [
          "To keep shoes clean",
          "To prevent electrostatic discharge from damaging sensitive electronic components",
          "For noise reduction",
          "For fashion compliance"
        ],
        answer: 1
      },
      {
        id: 2,
        question: "Are food or beverages permitted inside the R&D Laboratory?",
        options: [
          "Allowed if covered",
          "Allowed during lunchtime",
          "Strictly prohibited in lab areas",
          "Allowed near water coolers"
        ],
        answer: 2
      },
      {
        id: 3,
        question: "What procedure must be followed before entering the cleanroom zone?",
        options: [
          "Don cleanroom apparel (Smock, Shoe Covers, Gloves) and pass through air shower",
          "Just walk in directly",
          "Wash hands with cold water only",
          "Turn off room lights"
        ],
        answer: 0
      }
    ]
  },
  {
    id: "General Admin & Corporate",
    name: "General Admin & Corporate",
    riskLevel: "Low Risk",
    icon: "Building2",
    requiredPPE: [
      { id: "badge", name: "Visitor Pass Badge", icon: "IdCard", mandatory: true },
      { id: "vest", name: "High-Vis Vest (Plant Corridor Transit)", icon: "Vest", mandatory: false }
    ],
    hazards: ["Slips, Trips & Falls", "Office Emergency Evacuation"],
    safetyRules: [
      "Keep stairs clear and use handrails.",
      "Escorted by host employee at all times."
    ],
    quiz: [
      {
        id: 1,
        question: "What should you do in the event of a fire alarm in the Admin block?",
        options: [
          "Use elevators to leave quickly",
          "Stay at your desk",
          "Follow green emergency exit signs and assemble at Main Assembly Point",
          "Gather personal belongings from all floors"
        ],
        answer: 2
      },
      {
        id: 2,
        question: "Must visitors be accompanied by a host employee in facility corridors?",
        options: [
          "Yes, visitors must remain escorted by host staff during the visit",
          "No, visitors can roam freely anywhere in the plant",
          "Only during night hours",
          "Only in cafeteria"
        ],
        answer: 0
      },
      {
        id: 3,
        question: "What identification item must be visible on your person at all times?",
        options: [
          "Personal credit card",
          "Printed Digital Visitor QR Badge",
          "Driver license in pocket",
          "No badge required"
        ],
        answer: 1
      }
    ]
  }
]
