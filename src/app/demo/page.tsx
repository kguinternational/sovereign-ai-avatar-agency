"use client";

import { useState } from "react";
import { Phone, CalendarCheck, Clock, ShieldCheck, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export default function DemoLandingPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    businessName: "",
    website: "",
    email: ""
  });

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);

    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.checkoutUrl) {
        // Stripe integration is active! Redirect client to payment link.
        window.location.href = data.checkoutUrl;
      } else {
        // Fallback or Manual Invoicing success
        setDeploymentResult(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeploying(false);
    }
  };

  const VAPI_PHONE_NUMBER = "(555) 123-4567";

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500">
      
      {/* Navigation */}
      <nav className="border-b border-slate-800 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg mr-2 flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          VocalAI<span className="text-blue-500">.</span>
        </div>
        <a href="#pricing" className="text-sm font-semibold text-slate-300 hover:text-white transition">Pricing</a>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center md:py-32">
        <div className="inline-flex items-center bg-blue-500/10 text-blue-400 font-semibold px-4 py-2 rounded-full mb-8 border border-blue-500/20">
          <span className="relative flex h-3 w-3 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          Live Demo Now Active
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Imagine if <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">AMD</span> and <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-white">Elon Musk</span> had a baby.
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          Her name is VocalAI, and she runs our entire company. Now, she is ready to answer your phones 24/7, book your appointments, and never call in sick.
        </p>

        {/* CTA Box */}
        <div className="max-w-2xl mx-auto bg-slate-800 border border-slate-700 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
          <h2 className="text-2xl font-bold mb-4">Call the AI Right Now</h2>
          <p className="text-slate-400 mb-8">Grab your phone and dial the number below. Ask it questions about our services, or ask it to book an appointment.</p>
          
          <div className="text-4xl md:text-6xl font-black text-white tracking-widest mb-8">
            {VAPI_PHONE_NUMBER}
          </div>
          
          <p className="text-sm text-slate-500 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 mr-2" /> No credit card required to test the demo
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-950 py-24 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
              <Clock className="text-blue-400 w-12 h-12 mb-6" />
              <h3 className="text-2xl font-bold mb-3">24/7 Availability</h3>
              <p className="text-slate-400 leading-relaxed">Stop losing leads to voicemail. Our AI answers on the first ring, every single time, day or night.</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
              <CalendarCheck className="text-cyan-400 w-12 h-12 mb-6" />
              <h3 className="text-2xl font-bold mb-3">Automated Booking</h3>
              <p className="text-slate-400 leading-relaxed">The AI checks your real-time availability and books clients directly into your calendar without you lifting a finger.</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
              <Phone className="text-blue-400 w-12 h-12 mb-6" />
              <h3 className="text-2xl font-bold mb-3">Human-Like Voice</h3>
              <p className="text-slate-400 leading-relaxed">Powered by state-of-the-art voice models with ultra-low latency. Your callers will think they are speaking to your best employee.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Offer */}
      <section id="pricing" className="py-24 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">Stop paying answering services $1,500/month.</h2>
        <p className="text-xl text-slate-400 mb-12">Get your custom AI Receptionist built and deployed automatically in 60 seconds.</p>

        <div className="bg-gradient-to-b from-blue-900/20 to-slate-900 border border-blue-500/30 p-12 rounded-3xl relative">
          <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-3xl uppercase tracking-wider">
            Automated Setup
          </div>
          <h3 className="text-3xl font-bold mb-2">Complete System Deployment</h3>
          <div className="flex justify-center items-baseline mb-8">
            <span className="text-5xl font-black text-white">$1,000</span>
            <span className="text-slate-400 ml-2"> flat fee</span>
          </div>

          {!showOnboarding ? (
            <button 
              onClick={() => setShowOnboarding(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold py-4 px-12 rounded-full transition shadow-lg shadow-blue-500/25 flex items-center justify-center mx-auto w-full md:w-auto"
            >
              Start Automated Deployment <ArrowRight className="ml-2 w-6 h-6" />
            </button>
          ) : deploymentResult ? (
            <div className="bg-emerald-900/40 border border-emerald-500 p-8 rounded-2xl text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Deployment Successful!</h3>
              <p className="text-slate-300 mb-6">Your AI Receptionist has been generated and configured.</p>
              <div className="bg-emerald-950 p-6 rounded-xl border border-emerald-800">
                <p className="text-sm text-emerald-400 uppercase tracking-widest font-bold mb-2">Your New Phone Number</p>
                <p className="text-4xl font-black text-white">{deploymentResult.phoneNumber}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDeploy} className="text-left bg-slate-950 p-8 rounded-2xl border border-slate-800 max-w-md mx-auto">
              <h4 className="font-bold text-xl mb-6 flex items-center"><ShieldCheck className="mr-2 text-blue-500" /> Secure Checkout & Setup</h4>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-1">Business Name</label>
                  <input required type="text" onChange={e => setFormData({...formData, businessName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="Acme Plumbing" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-1">Website URL</label>
                  <input required type="url" onChange={e => setFormData({...formData, website: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-1">Your Email</label>
                  <input required type="email" onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="you@company.com" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isDeploying}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl flex items-center justify-center transition disabled:opacity-50"
              >
                {isDeploying ? <><Loader2 className="animate-spin w-5 h-5 mr-2" /> Building AI...</> : "Pay $1,000 & Deploy AI"}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="text-center py-12 border-t border-slate-800 text-slate-500">
        <p>&copy; 2026 VocalAI Automation Agency. All rights reserved.</p>
      </footer>
    </div>
  );
}
