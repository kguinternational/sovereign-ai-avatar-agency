import Link from 'next/link';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans py-24 px-6 selection:bg-blue-500">
      <div className="max-w-4xl mx-auto prose prose-invert prose-blue">
        <h1 className="text-4xl font-black text-white mb-2">Terms and Conditions</h1>
        <p className="text-slate-500 mb-8">Last Updated: October 2026</p>

        <h2>1. Agreement to Terms</h2>
        <p>By accessing or using the services provided by the JC Coffey Foundation ("Company", "we", "us", or "our"), including our AI Voice Receptionist deployments, you agree to be bound by these Terms and Conditions.</p>

        <h2>2. AI Services and Liability Disclaimer</h2>
        <p><strong>Crucial Protection:</strong> Our services utilize advanced Large Language Models (LLMs) and artificial intelligence to simulate human conversation. While we strive for accuracy, AI is subject to "hallucinations" or errors. </p>
        <p>By using our AI Receptionist, you explicitly agree that the JC Coffey Foundation is <strong>not liable for any lost revenue, incorrect pricing quoted by the AI, missed appointments, or business damages</strong> resulting from the AI's interactions with your customers. You are responsible for monitoring the AI's performance and providing corrections to its knowledge base.</p>

        <h2>3. Payments and Refunds</h2>
        <p>The standard deployment requires a $1,000.00 USD upfront setup fee, followed by a $99.00 USD monthly recurring hosting and maintenance fee. </p>
        <p><strong>No Refunds:</strong> Due to the custom engineering, prompt design, and voice cloning required to build your specific AI Receptionist, the $1,000 setup fee is strictly non-refundable once deployment begins. You may cancel your $99/mo subscription at any time.</p>

        <h2>4. Data and Call Recording</h2>
        <p>Our systems record and transcribe audio for the purpose of AI processing and quality assurance. As the business owner, you are solely responsible for ensuring that your use of our AI complies with your local jurisdiction's telecommunications and wiretapping laws (e.g., obtaining Two-Party Consent if required in your state).</p>

        <h2>5. Indemnification</h2>
        <p>You agree to indemnify, defend, and hold harmless the JC Coffey Foundation and its agents from any claims, damages, liabilities, and expenses arising from your use of the AI services or violation of these Terms.</p>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link href="/" className="text-blue-400 hover:text-blue-300 font-bold">&larr; Return to Home</Link>
        </div>
      </div>
    </div>
  );
}
