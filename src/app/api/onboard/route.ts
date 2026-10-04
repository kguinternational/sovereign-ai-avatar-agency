import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';

// Initialize Stripe (will use dummy key if missing so app doesn't crash)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {} as any);

const VAPI_API_KEY = process.env.VAPI_API_KEY;

export async function POST(req: Request) {
  try {
    const { businessName, website, email } = await req.json();
    
    console.log(`🚀 [AUTOMATION TRIGGERED] Processing new client: ${businessName}`);

    // --- PHASE 1: AUTOMATED INVOICING (STRIPE) ---
    // If the user has added their Stripe key, we automatically generate a real checkout link
    let checkoutUrl = null;
    
    if (process.env.STRIPE_SECRET_KEY) {
      console.log(`💳 [STRIPE] Generating $1,000 automated checkout session for ${email}...`);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'JC Coffey Foundation: AI Voice Receptionist Setup',
                description: `Custom AI setup for ${businessName}. Tax-deductible donation.`,
              },
              unit_amount: 100000, // $1,000.00
            },
            quantity: 1,
          },
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'AI Hosting & Minutes',
              },
              unit_amount: 9900, // $99.00
              recurring: { interval: 'month' }
            },
            quantity: 1,
          }
        ],
        mode: 'subscription',
        success_url: `http://localhost:3001/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3001/demo`,
      });
      checkoutUrl = session.url;
    }

    // --- PHASE 2: ZERO-TOUCH FULFILLMENT (VAPI) ---
    // If the user has added their Vapi key, we automatically build the AI
    let newPhoneNumber = "Pending Payment";
    let assistantId = "Pending";

    if (VAPI_API_KEY) {
      console.log(`🤖 [VAPI] Automatically provisioning AI Assistant for ${businessName}...`);
      
      // 1. Create the custom Assistant in Vapi
      const assistantResponse = await fetch("https://api.vapi.ai/assistant", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${VAPI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: `${businessName} AI Receptionist`,
          model: {
            provider: "openai",
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: `You are the friendly, highly capable AI voice receptionist for ${businessName}. Answer calls professionally, answer questions based on the context of their industry, and help book appointments.`
              }
            ]
          },
          voice: {
            provider: "11labs",
            voiceId: "pNInz6obpgDQGcFmaJcg", // Professional friendly voice
            model: "eleven_turbo_v4" // CTO Upgrade: Ultra-low latency v4 Turbo model (~150ms)
          }
        })
      });
      
      if (assistantResponse.ok) {
        const assistantData = await assistantResponse.json();
        assistantId = assistantData.id;
        console.log(`✅ [VAPI] Assistant created: ${assistantId}`);

        // 2. Buy a phone number and bind it to the assistant
        // (In production, this requires an active Twilio connection in Vapi)
        // const phoneResponse = await fetch("https://api.vapi.ai/phone-number", { ... });
      }
    }

    // Save commitment locally as backup
    const commitmentsPath = path.resolve(process.cwd(), 'commitments.json');
    let commitments = [];
    if (fs.existsSync(commitmentsPath)) {
      commitments = JSON.parse(fs.readFileSync(commitmentsPath, 'utf-8'));
    }
    
    commitments.push({
      businessName,
      website,
      email,
      timestamp: new Date().toISOString(),
      checkoutUrl: checkoutUrl || "Manual Invoice Required",
      assistantId: assistantId,
      status: checkoutUrl ? "Payment Link Generated" : "Awaiting Manual Invoice"
    });

    fs.writeFileSync(commitmentsPath, JSON.stringify(commitments, null, 2));

    return NextResponse.json({ 
      success: true, 
      checkoutUrl: checkoutUrl,
      message: checkoutUrl 
        ? "Automated checkout generated! Redirecting..." 
        : "Commitment received! Official invoice will be sent shortly." 
    });

  } catch (error) {
    console.error("Fulfillment Error:", error);
    return NextResponse.json({ error: "Failed to process automation" }, { status: 500 });
  }
}
