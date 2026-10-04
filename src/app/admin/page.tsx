import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export default async function AdminCRM() {
  const commitmentsPath = path.resolve(process.cwd(), 'commitments.json');
  let leads = [];
  
  if (fs.existsSync(commitmentsPath)) {
    leads = JSON.parse(fs.readFileSync(commitmentsPath, 'utf-8'));
  }

  leads = leads.reverse();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans selection:bg-blue-500">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight">JC Coffey Foundation CRM</h1>
            <p className="text-slate-400 mt-2">Manage inbound AI Receptionist commitments & invoices.</p>
          </div>
          <div className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-lg font-bold border border-blue-500/30">
            {leads.length} Total Leads
          </div>
        </header>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 text-sm tracking-wider uppercase text-slate-400 border-b border-slate-700">
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Business</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                      No commitments yet. The Night Shift agent is hunting...
                    </td>
                  </tr>
                ) : (
                  leads.map((lead: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition">
                      <td className="p-4 text-slate-400 text-sm">
                        {new Date(lead.timestamp).toLocaleDateString()} <br/>
                        <span className="text-xs">{new Date(lead.timestamp).toLocaleTimeString()}</span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-lg">{lead.businessName}</div>
                        <a href={lead.website} target="_blank" className="text-blue-400 text-sm hover:underline">{lead.website}</a>
                      </td>
                      <td className="p-4 text-slate-300">{lead.email}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          lead.status.includes('Payment Link Generated') 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {lead.status.includes('Awaiting') ? (
                          <a href={`mailto:${lead.email}?subject=JC Coffey Foundation - AI Setup Invoice`} className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition">
                            Send Invoice
                          </a>
                        ) : (
                          <span className="text-slate-500 text-sm">Automated</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
