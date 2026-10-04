"use client";

import { useState, useEffect } from "react";
import { Users, AlertCircle, CheckCircle2, TrendingUp, TrendingDown, MessageSquare } from "lucide-react";
import { Student } from "@/lib/db";

export default function GuideDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    fetch("/api/students")
      .then(res => res.json())
      .then(data => setStudents(data));
      
    const interval = setInterval(() => {
      fetch("/api/students")
        .then(res => res.json())
        .then(data => setStudents(data));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const addNote = async (studentId: string) => {
    if (!newNote.trim()) return;
    
    await fetch(`/api/students/${studentId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: "Lead Guide", text: newNote })
    });
    
    setNewNote("");
    fetch("/api/students").then(res => res.json()).then(data => setStudents(data));
  };

  const toggleLimitlessMeeting = async (student: Student) => {
    await fetch(`/api/students/${student.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...student, needsLimitlessMeeting: !student.needsLimitlessMeeting })
    });
    fetch("/api/students").then(res => res.json()).then(data => setStudents(data));
  };

  if (students.length === 0) return <div className="p-12">Loading Incept Cohort Data...</div>;

  const onTrack = students.filter(s => s.engagement >= 70 && !s.needsLimitlessMeeting).length;
  const stuck = students.filter(s => s.needsLimitlessMeeting).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Guide Portal: Incept Dashboard</h1>
        <p className="text-gray-500 mt-1">Monitor engagement, spot knowledge gaps, and facilitate Limitless Meetings.</p>
      </header>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Cohort</div>
          <div className="text-3xl font-bold">{students.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-2">High Engagement</div>
          <div className="text-3xl font-bold text-emerald-700">{onTrack}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-orange-600 text-sm font-semibold uppercase tracking-wider mb-2">Limitless Mtg Needed</div>
          <div className="text-3xl font-bold text-orange-700">{stuck}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold flex items-center">
            <Users className="w-5 h-5 mr-2" /> Live Cohort Monitoring
          </h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {students.map(student => (
            <div key={student.id} className="flex flex-col">
              <div className={`p-6 flex items-center justify-between transition-colors ${student.needsLimitlessMeeting ? 'bg-orange-50' : 'hover:bg-gray-50'}`}>
                <div>
                  <h3 className="font-bold text-lg flex items-center">
                    {student.name}
                    {student.needsLimitlessMeeting && (
                      <span className="ml-3 text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full uppercase tracking-wider font-bold">
                        Intervention Required
                      </span>
                    )}
                  </h3>
                  
                  <div className="mt-2 space-y-1">
                    {Object.entries(student.subjects).map(([sub, data]: [string, any]) => (
                      <div key={sub} className="text-sm flex items-center">
                        <span className="w-20 font-medium text-gray-700">{sub}:</span>
                        <span className="w-24 text-gray-500">{data.provider}</span>
                        <span className={`font-semibold ${data.mastery >= 90 ? 'text-purple-600' : 'text-blue-600'}`}>
                          {data.mastery}% Mastery
                        </span>
                        {data.gaps.length > 0 && (
                          <span className="ml-4 text-xs bg-red-100 text-red-700 px-2 rounded">
                            Gaps: {data.gaps.join(", ")}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-500">Engagement</div>
                    <div className={`font-bold flex items-center justify-end ${student.engagement >= 70 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {student.engagement >= 70 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {student.engagement}%
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setExpandedId(expandedId === student.id ? null : student.id)}
                    className={`px-4 py-2 rounded-lg font-medium border ${
                      student.needsLimitlessMeeting 
                        ? 'bg-orange-600 text-white border-orange-700 hover:bg-orange-700' 
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {expandedId === student.id ? 'Close Profile' : (student.needsLimitlessMeeting ? 'Start Limitless Meeting' : 'View Profile')}
                  </button>
                </div>
              </div>

              {expandedId === student.id && (
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center"><MessageSquare className="w-4 h-4 mr-2"/> Guide Notes & Observations</h4>
                      <div className="space-y-4 mb-4 max-h-48 overflow-y-auto">
                        {student.guideNotes?.map(note => (
                          <div key={note.id} className="bg-white p-3 rounded shadow-sm border border-gray-100">
                            <div className="text-xs text-gray-500 mb-1 flex justify-between">
                              <span className="font-semibold">{note.author}</span>
                              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-800">{note.text}</p>
                          </div>
                        ))}
                        {(!student.guideNotes || student.guideNotes.length === 0) && (
                          <p className="text-sm text-gray-500 italic">No notes yet.</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Add a new observation..."
                          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                        <button onClick={() => addNote(student.id)} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700">Add</button>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4">Action Items</h4>
                      <div className="space-y-2">
                        <button 
                          onClick={() => toggleLimitlessMeeting(student)}
                          className={`w-full text-left px-4 py-3 rounded border font-semibold ${student.needsLimitlessMeeting ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' : 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'}`}
                        >
                          {student.needsLimitlessMeeting ? 'Resolve Limitless Meeting Flag' : 'Flag for Limitless Meeting'}
                        </button>
                        <div className="bg-white p-4 rounded border border-gray-200 mt-4">
                          <p className="text-sm font-semibold text-gray-700">TimeBack Status</p>
                          <p className="text-2xl font-bold text-blue-600 mt-1">{student.timeBackHours} Hours Earned</p>
                          <p className="text-xs text-gray-500 mt-1">Focusing on: {student.lifeSkills.join(", ")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
