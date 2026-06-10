export const pillars = [
  {
    num: "01",
    title: "Specialist Only",
    body: "Every patient is seen by a GDC-registered Specialist in Prosthodontics. Not a generalist, not a dentist with implant training — a specialist who has dedicated their career to doing so.",
  },
  {
    num: "02",
    title: "Unhurried Care",
    body: "We are not a high-throughput clinic. We take on the cases we can treat exceptionally well, and we give each one the time it deserves. From the first phone call to your final review appointment.",
  },
  {
    num: "03",
    title: "Digital Precision",
    body: "From 3D cone beam CT scanning to digital smile design and guided implant placement — every case is planned with precision before treatment begins. Our technology exists to improve outcomes, not to impress.",
  },
  {
    num: "04",
    title: "Collaborative Thinking",
    body: "Complex cases are discussed by both specialists before treatment begins. You benefit from two specialist minds working together — no patient is treated in isolation from the combined thinking of the team.",
  },
] as const;

export const team = [
  {
    photo: "/images/dr-sherif-elsharkawy.png",
    badge: "Honorary Consultant",
    subtitle: "King's College London",
    name: "Dr Sherif Elsharkawy",
    role: "Honorary Consultant in Prosthodontics",
    credentials: ["GDC Specialist", "King's College London"],
    bio: "Dr Elsharkawy holds an Honorary Consultancy and Senior Clinical Lectureship at King's College London Dental Institute — one of the UK's leading academic dental centres. His clinical approach combines structural precision with a deep understanding of long-term implant outcomes.",
    specialties: [
      "Dental Implants",
      "Full Arch Restoration",
      "Crowns & Bridges",
      "Implant Rehabilitation",
    ],
  },
  {
    photo: "/images/dr-sumaia-rashed-v2.png",
    badge: "MRCSEd",
    subtitle: "Prosthodontics & Facial Aesthetics",
    name: "Dr Sumaia Rashed",
    role: "Specialist in Prosthodontics & Implants",
    credentials: ["GDC Registered", "Royal College of Surgeons"],
    bio: "Dr Rashed is a Member of the Royal College of Surgeons of Edinburgh (MRCSEd) — a postgraduate surgical fellowship awarded for demonstrated clinical excellence. Her clinical approach integrates restorative precision with aesthetic sensitivity, producing results that look natural and complement the whole face.",
    specialties: [
      "Smile Makeovers",
      "Veneers & Bonding",
      "Facial Aesthetics",
      "Full Mouth Rehabilitation",
    ],
  },
] as const;

export const credentials = [
  {
    title: "King's College London",
    body: "Dr Sherif Elsharkawy holds an Honorary Consultancy and Senior Clinical Lectureship at King's College London Dental Institute — one of the UK's leading academic dental centres.",
  },
  {
    title: "Royal College of Surgeons",
    body: "Dr Sumaia Rashed is a Member of the Royal College of Surgeons of Edinburgh (MRCSEd) — a postgraduate surgical fellowship awarded for demonstrated clinical excellence.",
  },
  {
    title: "Honorary Consultant Grade",
    body: "An honorary consultant position is one of the most recognised clinical appointments in UK dentistry, requiring peer review, academic contribution, and proven specialist-level practice.",
  },
  {
    title: "GDC Registered & Regulated",
    body: "Both specialists are registered with the General Dental Council. All treatment at Kaleidoscope is delivered within the GDC's standards for the dental team and specialist practice.",
  },
] as const;

export const techItems = [
  {
    title: "3D Cone Beam CT (CBCT) Scanning",
    desc: "Full 3D imaging of bone structure, nerve position, and anatomy before any implant is placed. Planning that eliminates guesswork.",
  },
  {
    title: "Digital Smile Design",
    desc: "Software-assisted smile design allows you to preview proportions, shape, and aesthetics before treatment begins. You approve the result in advance.",
  },
  {
    title: "Guided Surgical Placement",
    desc: "Surgical guides manufactured from digital scans ensure every implant is placed with sub-millimetre precision — improving outcomes and reducing recovery time.",
  },
  {
    title: "Premium-Grade Materials",
    desc: "Zirconia, lithium disilicate, and titanium — certified, premium-grade materials from established dental laboratories. Nothing is compromised.",
  },
] as const;

export const philosophyTiles = [
  {
    variant: "dark-tall" as const,
    roman: "I",
    title: "Specialism is not a label. It is a standard.",
    body: "There is a meaningful difference between a dentist who places implants and a specialist who has dedicated their career to doing so.",
    quote:
      '"The quality of an outcome reflects the depth of the thinking behind it."',
  },
  {
    variant: "cream" as const,
    roman: "II",
    title: "Honest advice above all",
    body: "A specialist consultation at Kaleidoscope will give you a clear picture of what is possible — and also what is not. We do not oversell treatment.",
  },
  {
    variant: "cream" as const,
    roman: "III",
    title: "Outcomes built to last",
    body: "Specialist-grade training, premium materials, digital planning technology, and the time invested in each case all contribute to the cost. We never compromise.",
  },
  {
    variant: "gold" as const,
    roman: "IV",
    title: "Treatment as a journey",
    body: "From first conversation to long-term results, every stage is guided by the same specialist team. You are never handed off to an associate for the parts that matter.",
  },
] as const;

export const processSteps = [
  {
    num: "01",
    title: "Specialist Consultation",
    body: "A comprehensive specialist assessment of your teeth, bone structure, and aesthetic goals. No obligation, no pressure.",
    detail: "Typically 60 minutes with one or both specialists",
  },
  {
    num: "02",
    title: "Digital Planning",
    body: "3D CBCT scans and digital smile design allow you to visualise your result before a single instrument is picked up.",
    detail: "Full arch cases include guided surgical planning",
  },
  {
    num: "03",
    title: "Treatment",
    body: "Delivered by specialist hands, in a calm and unhurried environment. Your comfort, safety, and outcome are the only priorities.",
    detail: "Tailored to your clinical needs and schedule",
  },
  {
    num: "04",
    title: "Long-Term Results",
    body: "Natural, permanent teeth — and the confidence that goes with them. Supported by the same specialist team throughout your aftercare.",
    detail: "Lifelong support and implant maintenance",
  },
] as const;

export const testimonials = [
  {
    featured: true,
    text: "After years of avoiding smiling in photos, I finally feel confident. The care and precision at Kaleidoscope was unlike anywhere I had been before. Sherif and Sumaia made every step feel considered.",
    initial: "A",
    name: "A.M. — London",
  },
  {
    featured: false,
    text: "I was nervous about implants after a bad experience elsewhere. From the very first consultation, I felt completely at ease. The result is more natural than I ever expected.",
    initial: "S",
    name: "S.K. — London",
  },
  {
    featured: false,
    text: "The level of detail that went into planning my smile makeover was extraordinary. Seeing the digital preview before any treatment started gave me real confidence.",
    initial: "R",
    name: "R.T. — London",
  },
] as const;

export const ctaTrustItems = [
  "GDC Registered Specialists",
  "King's College London Affiliation",
  "Complimentary First Consultation*",
  "Marylebone, London W1",
] as const;
