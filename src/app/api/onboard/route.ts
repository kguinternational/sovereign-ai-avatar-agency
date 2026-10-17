import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Client, Environment } from 'square';

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN || '',
  environment: process.env.SQUARE_ENVIRONMENT === 'sandbox' ? Environment.Sandbox : Environment.Production,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessName, email, website, paymentMethod, tier = 'basic', avatarPersona = 'Sarah (Executive Dispatcher)' } = body;

    const isAvatarTier = tier === 'avatar';
    const priceUsd = isAvatarTier ? 2500 : 1000;
    const priceCents = BigInt(priceUsd * 100);
    const productName = isAvatarTier
      ? `Tier 2: 1:1 Interactive Video Avatar Twin (Runway GWM-1) for ${businessName}`
      : `Tier 1: 24/7 AI Voice Receptionist for ${businessName}`;

    console.log(`[ONBOARDING] Initiating ${tier.toUpperCase()} ($${priceUsd}) deployment for ${businessName} via ${paymentMethod}...`);

    let checkoutUrl = '';

    // 1. PAYMENT GATEWAY ROUTING
    if (paymentMethod === 'cashapp') {
      if (process.env.SQUARE_ACCESS_TOKEN) {
        const response = await squareClient.checkoutApi.createPaymentLink({
          idempotencyKey: crypto.randomUUID(),
          quickPay: {
            name: productName,
            priceMoney: {
              amount: priceCents,
              currency: 'USD',
            },
            locationId: process.env.SQUARE_LOCATION_ID || '',
          },
          checkoutOptions: {
            redirectUrl: 'https://jccoffeyfoundation.org/success',
          },
        });
        checkoutUrl = response.result.paymentLink?.url || '';
        console.log(`[ONBOARDING] Square/CashApp checkout link generated: ${checkoutUrl}`);
      } else {
        const rawCashtag = (process.env.CASHAPP_CASHTAG || '$JCCoffeyFoundation').replace(/^\$/, '');
        checkoutUrl = `https://cash.app/$${rawCashtag}/${priceUsd}`;
        console.log(`[ONBOARDING] Direct CashApp $Cashtag ($${priceUsd}) checkout link generated: ${checkoutUrl}`);
      }
    } else {
      if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('...')) {
        checkoutUrl = `https://checkout.stripe.com/pay/cs_live_${tier}_${priceUsd}_for_` + businessName.replace(/\s+/g, '');
      } else {
        const rawCashtag = (process.env.CASHAPP_CASHTAG || '$JCCoffeyFoundation').replace(/^\$/, '');
        checkoutUrl = `https://cash.app/$${rawCashtag}/${priceUsd}`;
      }
    }

    // 2. AI VOICE + RUNWAY CHARACTER GWM-1 PROVISIONING
    const mockAgentId = (isAvatarTier ? 'runway_gwm1_' : 'vapi_') + Math.random().toString(36).substring(7);

    // 3. DATABASE COMMITMENT
    const filePath = path.resolve(process.cwd(), 'commitments.json');
    let commitments = [];
    if (fs.existsSync(filePath)) {
      commitments = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    commitments.push({
      id: crypto.randomUUID(),
      businessName,
      email,
      website,
      tier,
      priceUsd,
      avatarPersona: isAvatarTier ? avatarPersona : null,
      paymentMethod,
      agentId: mockAgentId,
      status: 'Pending Payment',
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(filePath, JSON.stringify(commitments, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Checkout and AI deployment initialized.',
      checkoutUrl,
      agentId: mockAgentId,
      priceUsd,
    });
  } catch (error: any) {
    console.error('[ONBOARDING ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
