import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data.json');

export type SubjectData = {
  mastery: number; // 0 to 100
  provider: string; // e.g. "Math Academy", "IXL"
  currentTopic: string;
  gaps: string[];
};

export type Note = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
};

export type Student = {
  id: string;
  name: string;
  engagement: number; // 0 to 100
  timeBackHours: number; // Hours earned for passions
  needsLimitlessMeeting: boolean;
  subjects: {
    [subjectName: string]: SubjectData;
  };
  lifeSkills: string[];
  guideNotes: Note[];
  badges: { name: string; url: string; issuedAt: string }[];
};

export type Database = {
  students: Student[];
};

const defaultDb: Database = {
  students: [
    {
      id: "1",
      name: "Alex Johnson",
      engagement: 85,
      timeBackHours: 4.5,
      needsLimitlessMeeting: false,
      subjects: {
        "Math": {
          mastery: 88,
          provider: "Math Academy",
          currentTopic: "Algebra II - Polynomials",
          gaps: [],
        },
        "Reading": {
          mastery: 100,
          provider: "IXL Learning",
          currentTopic: "Critical Analysis",
          gaps: [],
        },
        "Science": {
          mastery: 65,
          provider: "Trilogy",
          currentTopic: "Chemistry - Bonding",
          gaps: ["Covalent vs Ionic"],
        }
      },
      lifeSkills: ["Robotics Workshop", "Python Programming"],
      guideNotes: [
        { id: "n1", author: "Guide Sarah", text: "Alex is doing great in Reading! We are working on pushing Math past the 90% threshold.", createdAt: new Date().toISOString() }
      ],
      badges: []
    },
    {
      id: "2",
      name: "Sam Smith",
      engagement: 40,
      timeBackHours: 1.0,
      needsLimitlessMeeting: true,
      subjects: {
        "Math": {
          mastery: 42,
          provider: "Math Academy",
          currentTopic: "Pre-Algebra - Fractions",
          gaps: ["Adding unlike denominators", "Simplifying fractions"],
        },
        "Reading": {
          mastery: 75,
          provider: "MobyMax",
          currentTopic: "Reading Comprehension",
          gaps: [],
        }
      },
      lifeSkills: ["Public Speaking"],
      guideNotes: [],
      badges: []
    }
  ]
};

export function getDb(): Database {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2));
    return defaultDb;
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error("Database read error", e);
    return defaultDb;
  }
}

export function saveDb(db: Database) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export function getStudent(id: string): Student | undefined {
  const db = getDb();
  return db.students.find(s => s.id === id);
}

export function updateStudent(id: string, updates: Partial<Student>) {
  const db = getDb();
  const index = db.students.findIndex(s => s.id === id);
  if (index !== -1) {
    db.students[index] = { ...db.students[index], ...updates };
    saveDb(db);
  }
}

export function addNote(studentId: string, author: string, text: string) {
  const db = getDb();
  const index = db.students.findIndex(s => s.id === studentId);
  if (index !== -1) {
    db.students[index].guideNotes.push({
      id: Math.random().toString(36).substring(7),
      author,
      text,
      createdAt: new Date().toISOString()
    });
    saveDb(db);
  }
}
