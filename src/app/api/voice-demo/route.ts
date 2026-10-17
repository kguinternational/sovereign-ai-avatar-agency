import { NextResponse } from 'next/server';

async function transcribeUserAudio(audioBase64: string): Promise<string> {
  const groqKey = process.env.GROK_API_KEY || process.env.GROQ_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  const base64Payload = audioBase64.includes(',') ? audioBase64.split(',')[1] : audioBase64;
  const buffer = Buffer.from(base64Payload, 'base64');

  if (buffer.length < 800) return '';

  // Priority 1: Groq LPU Whisper-Large-v3-Turbo (~150ms transcription)
  if (groqKey && groqKey.startsWith('gsk_')) {
    try {
      const formData = new FormData();
      const blob = new Blob([buffer], { type: 'audio/wav' });
      formData.append('file', blob, 'speech.wav');
      formData.append('model', 'whisper-large-v3-turbo');
      formData.append('language', 'en');
      formData.append('temperature', '0');

      const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
        },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        const text = (data.text || '').trim();
        if (
          text &&
          !['thank you.', 'thanks for watching.', 'you', 'bye.'].includes(text.toLowerCase())
        ) {
          return text;
        }
      }
    } catch (e) {
      console.error('[Groq Whisper Error]', e);
    }
  }

  // Priority 2: OpenAI Whisper-1 Fallback
  if (openAiKey) {
    try {
      const formData = new FormData();
      const blob = new Blob([buffer], { type: 'audio/wav' });
      formData.append('file', blob, 'speech.wav');
      formData.append('model', 'whisper-1');

      const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiKey}`,
        },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.text?.trim()) return data.text.trim();
      }
    } catch (e) {
      console.error('[OpenAI Whisper Error]', e);
    }
  }

  return '';
}

async function synthesizeHumanAudioAndVideo(
  text: string,
  avatarId: string,
  wantVideo: boolean,
  customImageBase64?: string | null,
  grokVoice?: string
): Promise<{ audioDataUrl: string | null; videoDataUrl: string | null; renderMs?: number }> {
  // 1. PRIMARY: Local Apple M5 Neural Voice + Wav2Lip-GAN CoreML GPU Server
  try {
    const endpoint = wantVideo ? 'http://127.0.0.1:8099/wav2lip' : 'http://127.0.0.1:8099/tts';
    const localRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        speed: 1.04,
        avatarId: avatarId || 'sarah-webcam',
        grokVoice: grokVoice || '',
        wantVideo,
        customImageBase64: customImageBase64 || null,
      }),
    });
    if (localRes.ok) {
      if (wantVideo) {
        const data = await localRes.json();
        return {
          audioDataUrl: data.audioBase64 ? `data:audio/wav;base64,${data.audioBase64}` : null,
          videoDataUrl: data.videoBase64 ? `data:video/mp4;base64,${data.videoBase64}` : null,
          renderMs: data.renderMs,
        };
      } else {
        const arrayBuf = await localRes.arrayBuffer();
        const base64 = Buffer.from(arrayBuf).toString('base64');
        return {
          audioDataUrl: `data:audio/wav;base64,${base64}`,
          videoDataUrl: null,
        };
      }
    }
  } catch (e) {
    console.error('[M5 GPU Server Error]', e);
  }

  // 2. FALLBACK: OpenAI Steerable Neural Voice
  const openAiKey = process.env.OPENAI_API_KEY;
  if (openAiKey) {
    try {
      const ttsRes = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini-tts',
          voice: 'coral',
          input: text,
          instructions:
            'Speak like a warm, genuine, fast-paced real human dispatcher in Miami on a live call.',
          response_format: 'mp3',
        }),
      });
      if (ttsRes.ok) {
        const arrayBuf = await ttsRes.arrayBuffer();
        const base64 = Buffer.from(arrayBuf).toString('base64');
        return {
          audioDataUrl: `data:audio/mp3;base64,${base64}`,
          videoDataUrl: null,
        };
      }
    } catch (e) {
      console.error('[TTS Fallback Error]', e);
    }
  }

  return { audioDataUrl: null, videoDataUrl: null };
}

export async function POST(req: Request) {
  try {
    const {
      businessName,
      personaName,
      avatarId,
      grokVoice,
      wantVideo,
      customImageBase64,
      messages,
      audioBase64,
      webcamFrameBase64,
      livePickup,
    } = await req.json();
    const company = businessName?.trim() || 'Sunny Bliss Plumbing & AC';
    const agentName = personaName?.split(' ')[0] || 'Sarah';

    let updatedMessages = [...(messages || [])];
    let userTranscript = '';

    if (audioBase64) {
      userTranscript = await transcribeUserAudio(audioBase64);
      if (!userTranscript) {
        return NextResponse.json({
          transcript: '',
          reply: '',
        });
      }
      updatedMessages.push({ role: 'user', content: userTranscript });
    } else if (livePickup) {
      updatedMessages.push({
        role: 'user',
        content: `[Live call just connected. Greet the caller warmly as ${agentName} from ${company} in 1 short sentence under 14 words.]`,
      });
    }

    const systemPrompt = `You are ${agentName}, a real human dispatcher on a live face-to-face video & voice call for "${company}" in South Florida.
CRITICAL RULES FOR REALTIME CONVERSATION:
1. Keep every single response ULTRA-SHORT (1 sentence, 8 to 20 words max) so latency is instant and natural like a real face-to-face call.
2. Sound 100% spontaneous, warm, and human—use natural fillers like "Yeah, I hear you—", "Oh gosh, okay,", "Gotcha, what's going on?", "Sure thing, what's your address?".
3. If visual camera context is provided (Tavus Raven-0 Vision Mode), naturally acknowledge what you see the caller doing or holding up on camera!
4. Never use markdown, bullet points, or emojis. Speak pure conversational English.`;

    const groqKey = process.env.GROK_API_KEY || process.env.GROQ_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    let replyText = '';

    // TAVUS RAVEN-0 VISUAL PERCEPTION MODE: If caller's live webcam frame is attached, use multimodal vision!
    if (webcamFrameBase64 && openRouterKey) {
      const lastUserMsg = updatedMessages[updatedMessages.length - 1]?.content || 'Hello!';
      const priorHistory = updatedMessages.slice(0, -1);
      try {
        const visionRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'openai/gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              ...priorHistory,
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `Caller said: "${lastUserMsg}" (You can also see their live webcam feed attached—if they are showing something or reacting visually, mention it naturally in 1 short sentence!)`,
                  },
                  {
                    type: 'image_url',
                    image_url: { url: webcamFrameBase64 },
                  },
                ],
              },
            ],
            max_tokens: 60,
          }),
        });
        if (visionRes.ok) {
          const vData = await visionRes.json();
          replyText = vData.choices?.[0]?.message?.content?.trim() || '';
        }
      } catch (e) {
        console.error('[Tavus Vision Error]', e);
      }
    }

    // ULTRA-FAST 400ms GROQ LPU ('openai/gpt-oss-20b')
    if (!replyText && groqKey && groqKey.startsWith('gsk_')) {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          reasoning_effort: 'low',
          messages: [
            { role: 'system', content: systemPrompt },
            ...updatedMessages,
          ],
          temperature: 0.7,
          max_tokens: 250,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        replyText = data.choices?.[0]?.message?.content?.trim() || '';
      }
    }

    // OpenRouter fallback
    if (!replyText && openRouterKey) {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...updatedMessages,
          ],
          max_tokens: 60,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        replyText = data.choices?.[0]?.message?.content?.trim() || '';
      }
    }

    const { audioDataUrl, videoDataUrl, renderMs } = replyText
      ? await synthesizeHumanAudioAndVideo(
          replyText,
          avatarId || 'sarah-webcam',
          Boolean(wantVideo),
          customImageBase64,
          grokVoice
        )
      : { audioDataUrl: null, videoDataUrl: null, renderMs: 0 };

    return NextResponse.json({
      transcript: userTranscript,
      reply: replyText,
      audioDataUrl,
      videoDataUrl,
      renderMs,
      engine: wantVideo
        ? 'Wav2Lip-GAN + Kokoro-82M • Apple M5 CoreML GPU (65+ FPS)'
        : 'Real-Time Full-Duplex • Apple M5 GPU + Groq LPU',
    });
  } catch (error: any) {
    console.error('[VOICE DEMO ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
