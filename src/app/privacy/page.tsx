import Link from 'next/link';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans py-24 px-6 selection:bg-blue-500">
      <div className="max-w-4xl mx-auto prose prose-invert prose-blue">
        <h1 className="text-4xl font-black text-white mb-2">Privacy Policy</h1>
        <p className="text-slate-500 mb-8">Last Updated: October 2026</p>

        <h2>1. Information We Collect</h2>
        <p>The JC Coffey Foundation collects information necessary to provide and improve our AI Voice Receptionist services. This includes:</p>
        <ul>
          <li><strong>Client Data:</strong> Business name, email, website, and payment information (processed securely via Stripe).</li>
          <li><strong>End-User Audio Data:</strong> When customers call your AI Receptionist, the audio is captured in real-time, transcribed to text, and processed by our LLM providers (e.g., OpenAI, Anthropic) and Voice providers (e.g., ElevenLabs) via the Vapi orchestration layer.</li>
        </ul>

        <h2>2. How We Use Your Data</h2>
        <p>Audio and transcript data is used strictly for the purpose of executing the conversation, booking appointments in your CRM, and providing you with call logs. We do not sell your data or your customers' data to third-party brokers.</p>

        <h2>3. Third-Party Subprocessors</h2>
        <p>To provide our advanced AI services, we share necessary data with trusted subprocessors, including but not limited to:</p>
        <ul>
          <li><strong>Stripe:</strong> For secure payment processing.</li>
          <li><strong>Vapi.ai:</strong> For voice orchestration and telephony routing.</li>
          <li><strong>ElevenLabs:</strong> For text-to-speech voice generation.</li>
          <li><strong>OpenAI / Anthropic:</strong> For natural language processing and conversational intelligence.</li>
        </ul>
        <p>By using our services, you consent to the processing of data by these third-party infrastructure providers.</p>

        <h2>4. Data Retention and Security</h2>
        <p>We implement commercially reasonable security measures to protect your data. Call transcripts and recordings are retained for a period required to fulfill our service obligations to you, after which they are securely deleted or anonymized.</p>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link href="/" className="text-blue-400 hover:text-blue-300 font-bold">&larr; Return to Home</Link>
        </div>
      </div>
    </div>
  );
}
