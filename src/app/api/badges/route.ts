import { NextResponse } from 'next/server';
import { getStudent, updateStudent } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { studentId, subject } = await req.json();
    
    // Validate with Unstoppable Domains API key (simulated minting)
    const apiKey = process.env.UNSTOPPABLEDOMAINS_API_KEY;
    if (!apiKey) {
      console.warn("Unstoppable Domains API Key missing! Simulating badge anyway...");
    }

    // "Mint" the badge
    const newBadge = {
      name: `${subject} Mastery Level 100`,
      url: `https://unstoppabledomains.com/b/${studentId}-${subject.toLowerCase()}-${Date.now()}`,
      issuedAt: new Date().toISOString()
    };

    const student = getStudent(studentId);
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    const updatedBadges = [...student.badges, newBadge];
    updateStudent(studentId, { badges: updatedBadges });

    return NextResponse.json({ success: true, badge: newBadge });
  } catch (error) {
    console.error("Badge Error:", error);
    return NextResponse.json({ error: "Failed to issue badge" }, { status: 500 });
  }
}
