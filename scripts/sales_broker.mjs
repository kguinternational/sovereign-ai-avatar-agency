import OpenAI from 'openai';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// Load the API keys we saved earlier
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
});

// PASTE YOUR 100 DOMAINS HERE
const MY_DOMAINS = [
  "miami-real-estate.crypto",
  "web3-plumbing.x",
  "sarah-smith.nft",
  "fast-loans.wallet",
  // Add the rest of your 100 domains here...
];

const SYSTEM_PROMPT = `You are a ruthless, highly persuasive domain broker. 
The user is doing a 48-hour fire sale to liquidate Unstoppable Domains.
For the given domain, write a very short, punchy cold-email (3-4 sentences max).
Identify the target buyer in your head, then write the email directly to them.
Include urgency: "Liquidating assets, willing to transfer to your wallet today for $50."`;

async function generatePitches() {
  console.log("🚀 Starting AI Sales Broker...");
  let output = "# AI Generated Sales Pitches\n\n";

  for (const domain of MY_DOMAINS) {
    console.log(`Generating pitch for: ${domain}...`);
    try {
      const response = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Write a pitch for the domain: ${domain}` }
        ]
      });

      const pitch = response.choices[0].message.content;
      output += `## Domain: ${domain}\n**Target Buyer Profile:** (Look up companies matching this name)\n\n${pitch}\n\n---\n`;
    } catch (error) {
      console.error(`Error on ${domain}:`, error.message);
    }
  }

  fs.writeFileSync('sales_pitches.md', output);
  console.log("✅ DONE! All pitches saved to 'sales_pitches.md'");
}

generatePitches();
