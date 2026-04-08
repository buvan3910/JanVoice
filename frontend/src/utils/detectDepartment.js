/**
 * Utility for detecting the most relevant Karnataka government department
 * based on keywords and context in a complaint description.
 */

const departmentMappings = [
  {
    department: "BESCOM / Electricity",
    keywords: ["electricity", "power cut", "current", "transformer", "wire", "eb bill", "bescom", "power supply", "fuse", "blackout", "load shedding"],
    issueTags: ["Power Cut", "Transformer Issue", "Billing Error", "Dangerous Wire"]
  },
  {
    department: "BWSSB / Water Supply",
    keywords: ["water", "drainage", "sewage", "pipe leak", "bwssb", "water tank", "drinking water", "tap water", "manhole", "clogged drain", "pipeline"],
    issueTags: ["Water Leakage", "Sewage Overflow", "No Water Supply", "Drainage Blockage"]
  },
  {
    department: "BBMP / Municipal Services",
    keywords: ["road", "pothole", "streetlight", "garbage", "municipal", "bbmp", "waste", "bin", "park", "drain maintenance", "public toilet"],
    issueTags: ["Pothole Repair", "Streetlight Repair", "Garbage Collection", "Civic Maintenance"]
  },
  {
    department: "Police Department",
    keywords: ["theft", "harassment", "fraud", "violence", "missing", "police", "robbery", "crime", "threat", "assault", "stolen", "fight", "fir"],
    issueTags: ["Theft Report", "Harassment Case", "Physical Safety", "Emergency Assistance"]
  },
  {
    department: "Transport / RTO",
    keywords: ["vehicle", "license", "rc", "driving", "rto", "challan", "permit", "traffic violation", "number plate", "registration"],
    issueTags: ["License Inquiry", "RC Renewal", "Challan Issue", "Vehicle Permit"]
  },
  {
    department: "Health & Family Welfare",
    keywords: ["hospital", "doctor", "medicine", "health center", "ambulance", "pharmacy", "vaccination", "patient", "clinic", "fever", "outbreak"],
    issueTags: ["Medical Assistance", "Ambulance Request", "Health Facility Issue", "Medicine Shortage"]
  },
  {
    department: "Education Department",
    keywords: ["school", "college", "teacher", "scholarship", "exam", "student", "admission", "fees", "results", "education"],
    issueTags: ["Scholarship Issue", "School Admission", "Exam Query", "Teacher Feedback"]
  },
  {
    department: "Cyber Crime Cell",
    keywords: ["cyber fraud", "online scam", "hacked", "fake call", "otp", "phishing", "credit card fraud", "bank account", "malware", "social media hack"],
    issueTags: ["Financial Fraud", "Hacking Attempt", "Fake Call/OTP Scam", "Online Identity Theft"]
  },
  {
    department: "Forest Department",
    keywords: ["forest", "tree cutting", "wildlife", "land encroachment", "animal rescue", "planting", "nursery", "illegal logging", "land clearing"],
    issueTags: ["Illegal Tree Cutting", "Wildlife Sighting", "Forest Encroachment", "Animal Rescue"]
  },
  {
    department: "Food & Civil Supplies",
    keywords: ["ration", "food card", "rice", "civil supplies", "fps", "fair price shop", "kerosene", "sugar", "bpl card", "apl card"],
    issueTags: ["Ration Card Issue", "Food Grain Quality", "FPS Shop Complaint", "Card Enrollment"]
  },
  {
    department: "Labor Department",
    keywords: ["labor", "salary", "worker", "wages", "employment issue", "pf", "esi", "workplace safety", "termination", "unpaid wages"],
    issueTags: ["Wage Dispute", "Workplace Safety", "Employee Rights", "PF/ESI Issues"]
  },
  {
    department: "Women & Child Development",
    keywords: ["women safety", "child abuse", "domestic violence", "anganwadi", "nutrition", "maternal care", "harassment of women", "child welfare"],
    issueTags: ["Domestic Violence", "Child Safety", "Anganwadi Service", "Women's Helpline"]
  },
  {
    department: "Pollution Control Board",
    keywords: ["pollution", "smoke", "waste burning", "dirty air", "water pollution", "noise", "industrial waste", "chemical spill", "plastic waste", "dirty water"],
    issueTags: ["Air Pollution", "Noise Pollution", "Illegal Waste Burning", "Water Contamination"]
  },
  {
    department: "Revenue Department",
    keywords: ["government land", "revenue", "survey", "property records", "khata", "rtc", "mutation", "land records", "village accountant", "encroachment"],
    issueTags: ["Property Khata", "Land Records Inquiry", "Mutation Process", "Survey Request"]
  },
  {
    department: "Social Welfare Department",
    keywords: ["social pension", "welfare scheme", "disability support", "caste certificate", "income certificate", "sc/st welfare", "hostel", "grant", "pension"],
    issueTags: ["Pension Status", "Certificate Issuance", "Welfare Scheme Query", "Hostel Facilities"]
  }
];

const urgencyKeywords = {
  High: ["emergency", "immediate", "urgent", "danger", "hazard", "threat", "violence", "accident", "broken", "critical", "safety", "no power", "no water", "leakage"],
  Medium: ["delay", "pending", "not working", "issue", "problem", "complaint", "repair", "maintenance", "quality", "billing"],
  Low: ["inquiry", "information", "suggestion", "feedback", "general", "process", "status"]
};

/**
 * Detects the department based on the description.
 * @param {string} description - The complaint text.
 * @returns {Object} - Object containing detected department, confidence, tags, summary, urgency, and formal version.
 */
export const analyzeComplaint = (description) => {
  if (!description || description.trim().length < 5) {
    return {
      department: null,
      confidence: 0,
      tags: [],
      summary: "",
      urgency: "Medium",
      formalComplaint: "",
      detected: false
    };
  }

  const text = description.toLowerCase();
  let bestMatch = null;
  let maxScore = 0;

  departmentMappings.forEach(mapping => {
    let score = 0;
    mapping.keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 1;
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        if (regex.test(text)) score += 1;
      }
    });

    if (score > maxScore) {
      maxScore = score;
      bestMatch = mapping;
    }
  });

  // Calculate mock confidence percentage
  let confidence = 0;
  if (maxScore > 0) {
    if (maxScore <= 2) confidence = 40 + (maxScore * 10) + Math.floor(Math.random() * 5);
    else if (maxScore <= 4) confidence = 70 + (maxScore * 3) + Math.floor(Math.random() * 5);
    else confidence = 90 + Math.min(maxScore, 8) + Math.floor(Math.random() * 2);
  }

  // Detect Urgency
  let urgency = "Medium";
  let highCount = urgencyKeywords.High.filter(k => text.includes(k)).length;
  let mediumCount = urgencyKeywords.Medium.filter(k => text.includes(k)).length;
  
  if (highCount > 0) urgency = "High";
  else if (mediumCount > 0) urgency = "Medium";
  else urgency = "Low";

  // Generate issue tags
  const tags = bestMatch ? [...new Set([...bestMatch.issueTags.slice(0, 2), ...bestMatch.keywords.filter(k => text.includes(k)).slice(0, 1)])] : [];

  // Generate a mock summary
  let summary = "";
  if (bestMatch) {
    const mainKeyword = bestMatch.keywords.find(k => text.includes(k)) || bestMatch.department.split('/')[0].trim();
    summary = `Reported issue related to ${mainKeyword} under ${bestMatch.department}.`;
  }

  // Generate Formal Version
  let formalComplaint = "";
  if (bestMatch && description.length > 10) {
    formalComplaint = `Subject: Formal Complaint regarding ${tags[0] || 'Civic Issue'}\n\nI am writing to bring to your attention a persistent issue in our locality. ${description.charAt(0).toUpperCase() + description.slice(1)}. This matter requires ${urgency === 'High' ? 'immediate' : 'prompt'} attention as it affects public convenience. I request the ${bestMatch.department.split(' / ')[0]} to take necessary actions at the earliest.`;
  }

  return {
    department: bestMatch ? bestMatch.department : null,
    confidence: Math.min(confidence, 99),
    tags,
    summary,
    urgency,
    formalComplaint,
    detected: maxScore > 0
  };
};

// Keep old exports for backward compatibility if needed, but analyzeComplaint is the new main one
export const detectDepartment = (description) => {
  const result = analyzeComplaint(description);
  return {
    department: result.department,
    confidence: result.confidence,
    tags: result.tags,
    summary: result.summary,
    detected: result.detected
  };
};

export const suggestTitle = (description, detectedDept) => {
  if (!description || description.length < 10) return "";
  const words = description.split(' ').slice(0, 5).join(' ');
  return `${detectedDept ? detectedDept.split(' / ')[0] : 'Complaint'}: ${words}...`;
};
