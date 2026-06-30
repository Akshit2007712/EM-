import { SiteContent } from "./store";

const portrait = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?w=600&h=800&fit=crop&q=80`;

// Curated portrait seeds (Unsplash)
const P = [
  "1531123897727-8f129e1688ce", // 0
  "1494790108377-be9c29b29330", // 1
  "1500648767791-00dcc994a43e", // 2
  "1438761681033-6461ffad8d80", // 3
  "1472099645785-5658abf4ff4e", // 4
  "1544005313-94ddf0286df2", // 5
  "1519085360753-af0119f7cbe7", // 6
  "1573496359142-b8d87734a5a2", // 7
  "1487412720507-e7ab37603c6f", // 8
  "1506794778202-cad84cf45f1d", // 9
  "1524504388940-b1c1722653e1", // 10
  "1517841905240-472988babdf9", // 11
];

const eventPhoto = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?w=1200&h=800&fit=crop&q=80`;

const galleryPhoto = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?w=800&h=800&fit=crop&q=80`;

export const defaultContent: SiteContent = {
  heroTagline: "Knowledge in Action, Innovation in Motion.",
  heroSubtitle:
    "The Empirical Society is a collective of curious students dedicated to rigorous inquiry, creative thought, and meaningful impact across our campus and beyond.",
  about:
    "Founded as a home for thinkers, makers, and storytellers, The Empirical Society brings together students from every discipline. We host events, run creative initiatives, publish writing, and build a culture where curiosity is the highest currency.",
  mission:
    "To cultivate a generation of curious, capable, and compassionate leaders by fostering an environment of inquiry, collaboration, and creative expression.",
  sponsors: [
    {
      id: "s1",
      name: "EDA",
      abbr: "EDA",
      category: "Event Partner",
      description:
        "Fueling our society with events, experiences, and student-focused engagement.",
      website: "https://eda.org",
      image: "/sponsors/eda.svg",
    },
    {
      id: "s2",
      name: "Microsoft Azure",
      abbr: "Azure",
      category: "Technology Sponsor",
      description:
        "Backing our initiatives with cloud tools, infrastructure, and platform support.",
      website: "https://azure.microsoft.com",
      image: "/sponsors/microsoft-azure.svg",
    },
    {
      id: "s3",
      name: "Reskill-i",
      abbr: "RS",
      category: "Skill Development Partner",
      description:
        "Empowering students with career-ready skills and employability training.",
      website: "https://reskilll.com/",
      image: "/sponsors/reskill-i.svg",
    },
    {
      id: "s4",
      name: "Young Skilled India",
      abbr: "YSI",
      category: "Employment Partner",
      description:
        "Helping students stay employable with ongoing upskilling and industry exposure.",
      website: "https://youngskilledindia.com",
      image: "/sponsors/young-skilled-india.svg",
    },
  ],
  socialLinks: {
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    email: "mailto:hello@empirical.org",
    phone: "+91 98765 43210, +91 87654 32109",
  },
  mentors: [
    {
      id: "m1",
      name: "Dr. Anika Verma",
      role: "Faculty Mentor",
      photo: portrait(P[0]),
      description: "Guides our research initiatives and inter-departmental projects.",
    },
    {
      id: "m2",
      name: "Prof. Rohan Mehta",
      role: "Senior Mentor",
      photo: portrait(P[8]),
      description: "20 years shaping student leaders across the institute.",
    },
    {
      id: "m3",
      name: "Dr. Sara Iqbal",
      role: "Mentor",
      photo: portrait(P[1]),
      description: "Champions inclusion and creative collaboration.",
    },
  ],
  faculty: [
    { id: "f1", name: "Prof. Vikram Shah", role: "Faculty Coordinator", photo: portrait(P[3]) },
    { id: "f2", name: "Dr. Maya Krishnan", role: "Faculty Coordinator", photo: portrait(P[2]) },
  ],
  leads: [
    {
      id: "l1",
      name: "Aarav Kapoor",
      role: "President",
      photo: portrait(P[4]),
      description: "Leads vision, strategy, and society-wide initiatives.",
    },
    {
      id: "l2",
      name: "Ishita Roy",
      role: "Vice President",
      photo: portrait(P[1]),
      description: "Drives operations and inter-team coordination.",
    },
    {
      id: "l3",
      name: "Karan Singh",
      role: "General Secretary",
      photo: portrait(P[5]),
      description: "Owns logistics, partnerships, and member experience.",
    },
  ],
  teams: [
    {
      id: "t1",
      name: "Creative Team",
      leads: [{ id: "lc1", name: "Meera Joshi", role: "Creative Lead", photo: portrait(P[1]) }],
      members: [
        { id: "c1", name: "Rhea Patel", role: "Designer", photo: portrait(P[2]) },
        { id: "c2", name: "Arjun Nair", role: "Illustrator", photo: portrait(P[6]) },
        { id: "c3", name: "Tanvi Rao", role: "Designer", photo: portrait(P[3]) },
      ],
    },
    {
      id: "t2",
      name: "Marketing Team",
      leads: [{ id: "lm1", name: "Dev Malhotra", role: "Marketing Lead", photo: portrait(P[4]) }],
      members: [
        { id: "mk1", name: "Sneha Reddy", role: "Outreach", photo: portrait(P[1]) },
        { id: "mk2", name: "Yash Khanna", role: "Strategy", photo: portrait(P[8]) },
      ],
    },
    {
      id: "t3",
      name: "Literary Team",
      leads: [{ id: "ll1", name: "Ananya Sen", role: "Literary Lead", photo: portrait(P[7]) }],
      members: [
        { id: "li1", name: "Kabir Bose", role: "Editor", photo: portrait(P[6]) },
        { id: "li2", name: "Prisha Iyer", role: "Writer", photo: portrait(P[3]) },
        { id: "li3", name: "Neel Sharma", role: "Writer", photo: portrait(P[5]) },
      ],
    },
    {
      id: "t4",
      name: "Social Media Team",
      leads: [{ id: "ls1", name: "Zara Ahmed", role: "Social Lead", photo: portrait(P[2]) }],
      members: [
        { id: "s1", name: "Rohan Pillai", role: "Content", photo: portrait(P[6]) },
        { id: "s2", name: "Aisha Khan", role: "Reels", photo: portrait(P[1]) },
      ],
    },
    {
      id: "t5",
      name: "Event Management",
      leads: [{ id: "le1", name: "Vivaan Gupta", role: "Events Lead", photo: portrait(P[4]) }],
      members: [
        { id: "e1", name: "Diya Menon", role: "Coordinator", photo: portrait(P[3]) },
        { id: "e2", name: "Krish Verma", role: "Logistics", photo: portrait(P[5]) },
      ],
    },
    {
      id: "t6",
      name: "Core Team",
      leads: [{ id: "lcr1", name: "Saanvi Desai", role: "Core Lead", photo: portrait(P[7]) }],
      members: [
        { id: "cr1", name: "Aditya Rao", role: "Core Member", photo: portrait(P[8]) },
        { id: "cr2", name: "Mira Saxena", role: "Core Member", photo: portrait(P[2]) },
      ],
    },
  ],
  events: [
    {
      id: "e1",
      title: "Symposium 2024",
      date: "2024-11-12",
      shortDescription: "A two-day inter-collegiate gathering of speakers, debates, and ideas.",
      description:
        "Symposium 2024 brought together 400+ students across 12 colleges for two days of keynotes, panel debates, and hands-on workshops. Highlights included sessions on AI ethics, climate policy, and a closing fireside chat with industry leaders.",
      venue: "Main Auditorium",
      cover: eventPhoto("1505373877841-8d25f7d46678"),
      photos: [
        eventPhoto("1505373877841-8d25f7d46678"),
        eventPhoto("1540575467063-178a50c2df87"),
        eventPhoto("1511578314322-379afb476865"),
      ],
    },
    {
      id: "e2",
      title: "Literary Night",
      date: "2024-09-21",
      shortDescription: "Spoken word, poetry, and prose under candlelight.",
      description:
        "An intimate evening of original writing, performed by students and alumni. Three sets of poetry, two short stories, and an open mic that ran past midnight.",
      venue: "Open Lawn",
      cover: eventPhoto("1481627834876-b7833e8f5570"),
      photos: [eventPhoto("1481627834876-b7833e8f5570"), eventPhoto("1524995997946-a1c2e315a42f")],
    },
    {
      id: "e3",
      title: "Design Sprint",
      date: "2024-07-08",
      shortDescription: "48 hours. 9 teams. Real campus problems.",
      description:
        "Teams of four tackled real challenges sourced from departments across campus. Outcomes included a peer-tutoring app, a campus mental health resource map, and a sustainable cafeteria proposal — two of which are now in pilot.",
      venue: "Innovation Lab",
      cover: eventPhoto("1517048676732-d65bc937f952"),
      photos: [
        eventPhoto("1517048676732-d65bc937f952"),
        eventPhoto("1531403009284-440f080d1e12"),
        eventPhoto("1552664730-d307ca884978"),
      ],
    },
    {
      id: "e4",
      title: "Founders Fest",
      date: "2024-04-15",
      shortDescription: "Pitches, prototypes, and a packed demo floor.",
      description:
        "Twelve student-led ventures presented to a panel of investors and faculty. The fest closed with a demo floor open to the entire campus.",
      venue: "Convention Hall",
      cover: eventPhoto("1556761175-5973dc0f32e7"),
      photos: [eventPhoto("1556761175-5973dc0f32e7"), eventPhoto("1559136555-9303baea8ebd")],
    },
  ],
  gallery: [
    { id: "g1", url: galleryPhoto("1505373877841-8d25f7d46678") },
    { id: "g2", url: galleryPhoto("1540575467063-178a50c2df87") },
    { id: "g3", url: galleryPhoto("1511578314322-379afb476865") },
    { id: "g4", url: galleryPhoto("1481627834876-b7833e8f5570") },
    { id: "g5", url: galleryPhoto("1524995997946-a1c2e315a42f") },
    { id: "g6", url: galleryPhoto("1517048676732-d65bc937f952") },
    { id: "g7", url: galleryPhoto("1531403009284-440f080d1e12") },
    { id: "g8", url: galleryPhoto("1556761175-5973dc0f32e7") },
    { id: "g9", url: galleryPhoto("1559136555-9303baea8ebd") },
    { id: "g10", url: galleryPhoto("1540575467063-178a50c2df87") },
    { id: "g11", url: galleryPhoto("1505373877841-8d25f7d46678") },
    { id: "g12", url: galleryPhoto("1511578314322-379afb476865") },
  ],
};
