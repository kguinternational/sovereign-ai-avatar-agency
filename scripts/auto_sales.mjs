import OpenAI from 'openai';
import { exec } from 'child_process';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// Load API keys
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
});

// --- CONFIGURATION ---
const VAPI_PHONE = "(555) 123-4567"; 
// Put your actual nonprofit email below so Apple Mail sends it from the right account:
const NONPROFIT_EMAIL = "info@jccoffeyfoundation.org"; 

// Read leads from a JSON file
const leads = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'scripts/leads.json'), 'utf-8'));

const SYSTEM_PROMPT = `You are writing a cold email to a local business on behalf of the JC Coffey Foundation.
You must use psychology and dopamine triggers: create a curiosity gap, agitate a severe pain point (losing emergency jobs to voicemail), and offer instant gratification.

Write the email using this exact structure:
1. Hook: Identify the pain of losing money. ("If you miss one emergency call this weekend, you just lost a $500+ invoice to a competitor.")
2. Instant Solution: "I built an AI Voice Receptionist for [Business Name] that answers on the first ring, sounds exactly like a real human, and books jobs straight into your CRM."
3. The Offer: "Agencies charge $5,000 for this. Because we are a nonprofit, we deploy it for a flat $1,000 tax-deductible donation."
4. Instant Gratification CTA: "Call ${VAPI_PHONE} right now to hear the AI answer the phone. If you love it, you can deploy it instantly at jccoffeyfoundation.org/demo."

Keep it under 80 words. Punchy, aggressive value, and highly exciting. Sign off as "The JC Coffey Foundation Team".`;

const sendAppleMail = (toAddress, subject, body) => {
  return new Promise((resolve, reject) => {
    const escapedSubject = subject.replace(/"/g, '\\"');
    const escapedBody = body.replace(/"/g, '\\"');
    
    // AppleScript without 'sender' specified (uses default Mac Mail account)
    const script = `
      tell application "Mail"
        set newMessage to make new outgoing message with properties {subject:"${escapedSubject}", content:"${escapedBody}", visible:false}
        tell newMessage
          make new to recipient at end of to recipients with properties {address:"${toAddress}"}
        end tell
        send newMessage
      end tell
    `;
    
    const child = exec('osascript', (error, stdout, stderr) => {
      if (error) {
        console.error(`Failed to send to ${toAddress}:`, stderr);
        reject(error);
      } else {
        console.log(`✅ Successfully sent email to ${toAddress}`);
        resolve(stdout);
      }
    });
    
    child.stdin.write(script);
    child.stdin.end();
  });
};

async function runAutonomousSales() {
  console.log("🤖 Initializing JC Coffey Foundation AI Sales Agent...");
  console.log(`Found ${leads.length} leads. Generating custom nonprofit pitches...`);

  for (const lead of leads) {
    console.log(`\nAnalyzing business: ${lead.businessName} (${lead.niche})...`);
    
    try {
      const response = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Business Name: ${lead.businessName}\nNiche: ${lead.niche}` }
        ]
      });

      const emailBody = response.choices[0].message.content.trim();
      const subject = `Partnership: Upgrading ${lead.businessName} with AI (Tax Deductible)`;

      console.log(`Drafting email to ${lead.email} from ${NONPROFIT_EMAIL}...`);
      await sendAppleMail(lead.email, subject, emailBody);
      
      // 🛡️ ANTI-BAN PROTECTION: Human Mimicry Delay
      // Random delay between 2 and 5 minutes (120,000 to 300,000 milliseconds)
      const minDelay = 120000;
      const maxDelay = 300000;
      const delayMs = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      
      const delayMinutes = (delayMs / 60000).toFixed(1);
      console.log(`🛡️ Anti-Ban Active: Waiting ${delayMinutes} minutes before sending the next pitch to mimic human behavior...`);
      
      await new Promise(res => setTimeout(res, delayMs));
    } catch (error) {
      console.error(`❌ Error processing ${lead.businessName}:`, error.message);
    }
  }

  console.log("\n🎉 Campaign complete! Awaiting inbound donations.");
}

runAutonomousSales();
