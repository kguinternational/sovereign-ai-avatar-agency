export interface FreeGPUNode {
  id: string;
  name: string;
  provider: string;
  hardware: string;
  vram: string;
  type: 'local_sovereign' | 'free_cloud_lpu' | 'free_cloud_gpu' | 'free_aggregator';
  endpoint: string;
  cost: string;
  requiresCard: boolean;
  topModels: string[];
  capabilities: ('llm' | 'vision' | 'asr' | 'tts' | 'lipsync')[];
  latencyMs: number;
  online?: boolean;
  liveModelCount?: number;
}

export const FREE_GPU_FLEET: FreeGPUNode[] = [
  {
    id: 'apple-m5-neural-enclave',
    name: 'Apple M5 Hugging Face Voice & Lip-Sync Enclave',
    provider: 'Local Apple M5 Silicon (:8099)',
    hardware: 'Apple M5 10-Core GPU + 16-Core Neural Engine + VideoToolbox',
    vram: '24 GB Unified Memory',
    type: 'local_sovereign',
    endpoint: 'http://127.0.0.1:8099',
    cost: '$0.00 / forever',
    requiresCard: false,
    topModels: [
      'mlx-community/whisper-base.en-mlx',
      'onnx-community/Kokoro-82M-v1.0-ONNX',
      'bluefoxcreation/Wav2lip-Onnx (wav2lip_gan.onnx)',
    ],
    capabilities: ['asr', 'tts', 'lipsync'],
    latencyMs: 90,
  },
  {
    id: 'apple-m5-exo-cluster',
    name: 'Apple M5 EXO Distributed MLX GPU Cluster',
    provider: 'Local EXO Metal Cluster (:52415)',
    hardware: 'Apple Silicon Metal 4 Distributed Tensor Pool',
    vram: '24 GB Unified Memory',
    type: 'local_sovereign',
    endpoint: 'http://127.0.0.1:52415/v1',
    cost: '$0.00 / forever',
    requiresCard: false,
    topModels: [
      'mlx-community/Llama-3.3-70B-Instruct-4bit',
      'mlx-community/Qwen3-Coder-480B-A35B-Instruct-4bit',
      'mlx-community/Qwen3.5-122B-A10B-4bit',
      'mlx-community/MiniMax-M2.7-4bit',
      'mlx-community/Qwen3-VL-4B-Instruct-4bit',
    ],
    capabilities: ['llm', 'vision'],
    latencyMs: 320,
  },
  {
    id: 'apple-m5-ollama-metal',
    name: 'Apple M5 Ollama Local Metal GPU',
    provider: 'Local Ollama GGUF/Metal (:11434)',
    hardware: 'Apple M5 Metal 4 Shader Acceleration',
    vram: '24 GB Unified Memory',
    type: 'local_sovereign',
    endpoint: 'http://127.0.0.1:11434/v1',
    cost: '$0.00 / forever',
    requiresCard: false,
    topModels: ['llama3.2:latest', 'qwen2.5:7b', 'qwen2.5-coder:7b'],
    capabilities: ['llm'],
    latencyMs: 380,
  },
  {
    id: 'groq-lpu-cloud',
    name: 'Groq Cloud LPU Ultra-Fast Inference Cluster',
    provider: 'Groq Custom LPU (14,400 Req/Day Free)',
    hardware: 'Groq Language Processing Unit (500+ tok/s)',
    vram: '230 MB On-Chip SRAM Cluster',
    type: 'free_cloud_lpu',
    endpoint: 'https://api.groq.com/openai/v1',
    cost: '$0.00 Free Tier',
    requiresCard: false,
    topModels: [
      'qwen/qwen3.8-27b',
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b',
      'whisper-large-v3-turbo',
      'canopylabs/orpheus-v1-english',
    ],
    capabilities: ['llm', 'asr', 'tts'],
    latencyMs: 445,
  },
  {
    id: 'ovhcloud-nvidia-h100',
    name: 'OVHcloud AI Keyless NVIDIA H100/A100 Cluster',
    provider: 'OVHcloud AI Endpoints (Keyless $0)',
    hardware: 'NVIDIA H100 SXM5 80GB + TensorRT-LLM',
    vram: '80 GB HBM3 per Node',
    type: 'free_cloud_gpu',
    endpoint: 'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1',
    cost: '$0.00 Keyless Free',
    requiresCard: false,
    topModels: [
      'Qwen2.5-VL-72B-Instruct',
      'Meta-Llama-3_3-70B-Instruct',
      'Mistral-Small-3.2-24B-Instruct-2506',
      'Qwen3.5-397B-A17B',
      'gpt-oss-120b',
      'whisper-large-v3-turbo',
    ],
    capabilities: ['llm', 'vision', 'asr', 'tts'],
    latencyMs: 674,
  },
  {
    id: 'openrouter-free-enterprise',
    name: 'OpenRouter Free Enterprise GPU Mesh',
    provider: 'OpenRouter (:free Zero-Cost Pool)',
    hardware: 'Multi-Cloud NVIDIA H100 / B200 Cluster',
    vram: '80 GB – 192 GB HBM3e',
    type: 'free_cloud_gpu',
    endpoint: 'https://openrouter.ai/api/v1',
    cost: '$0.00 (:free routes)',
    requiresCard: false,
    topModels: [
      'nvidia/nemotron-3-ultra-550b-a55b:free',
      'nvidia/nemotron-3.5-super-vl:free',
      'google/gemma-4-31b-it:free',
      'google/gemma-4-26b-a4b-it:free',
      'xingchen-agi/xing4.0-29b-a4b:free',
    ],
    capabilities: ['llm', 'vision'],
    latencyMs: 514,
  },
  {
    id: 'llm7-free-gateway',
    name: 'LLM7.io Keyless Enterprise & Open-Source GPU Pool',
    provider: 'LLM7 Keyless Gateway (66 Free Models)',
    hardware: 'Distributed Enterprise GPU Cluster',
    vram: 'Shared H100 / A100 Pool',
    type: 'free_aggregator',
    endpoint: 'https://api.llm7.io/v1',
    cost: '$0.00 Keyless Free',
    requiresCard: false,
    topModels: [
      'DeepSeek-V4.1-Flash',
      'DeepSeek-V4-Flash-0731',
      'GLM-5.3-Flash',
      'Voxtral-Small-24B-2507',
      'L3-8B-Lunaris-v1-Turbo',
    ],
    capabilities: ['llm'],
    latencyMs: 790,
  },
  {
    id: 'kilo-free-gateway',
    name: 'Kilo AI Keyless Multi-Model GPU Gateway',
    provider: 'Kilo AI Gateway (401 Models • 200 req/hr Free)',
    hardware: 'Global Serverless GPU Edge Mesh',
    vram: 'Shared Enterprise VRAM',
    type: 'free_aggregator',
    endpoint: 'https://api.kilo.ai/api/gateway/v1',
    cost: '$0.00 Keyless Free',
    requiresCard: false,
    topModels: [
      'meta-llama/llama-3.3-70b-instruct:free',
      'deepseek/deepseek-r1:free',
      'qwen/qwen3-coder:free',
    ],
    capabilities: ['llm'],
    latencyMs: 820,
  },
  {
    id: 'freellmapi-34-provider-hub',
    name: 'FreeLLMAPI 34-Provider Sovereign Aggregator',
    provider: 'NVIDIA NIM + Cerebras CS-3 + Cloudflare + HuggingFace + Kaggle T4',
    hardware: '34 Free Providers • 635 Model Endpoints • 7.4B Free Tokens/Mo',
    vram: 'Combined Multi-Cluster H100 / CS-3 Wafer-Scale / T4x2',
    type: 'free_aggregator',
    endpoint: 'https://integrate.api.nvidia.com/v1',
    cost: '$0.00 (7.4B Free Tokens/Mo)',
    requiresCard: false,
    topModels: [
      'meta/llama-3.3-70b-instruct',
      'deepseek-ai/deepseek-r1',
      'nvidia/esm2-650m',
      'cerebras/llama-3.3-70b (1800 tok/s)',
      'cloudflare/@cf/meta/llama-3.3-70b-instruct-fp8-fast',
    ],
    capabilities: ['llm', 'vision', 'asr', 'tts'],
    latencyMs: 480,
  },
];

export interface EquipmentSpecialistRouteResult {
  replyText: string;
  gpuNodeId: string;
  gpuName: string;
  modelUsed: string;
  latencyMs: number;
}

/**
 * Equipment Specialist Agent: Automatically selects and executes across the best
 * free open-source and enterprise GPU models with automatic multi-cluster failover.
 */
export async function runEquipmentSpecialistInference(params: {
  systemPrompt: string;
  messages: { role: string; content: any }[];
  webcamFrameBase64?: string | null;
  preferredGpuId?: string;
}): Promise<EquipmentSpecialistRouteResult> {
  const { systemPrompt, messages, webcamFrameBase64, preferredGpuId } = params;
  const groqKey = process.env.GROK_API_KEY || process.env.GROQ_API_KEY || '';
  const openRouterKey = process.env.OPENROUTER_API_KEY || '';
  const nvidiaKey = process.env.NVIDIA_API_KEY || '';

  // =========================================================================
  // 1. MULTIMODAL CAMERA VISION (TAVUS RAVEN-0 VISUAL PERCEPTION)
  // Uses Free OVHcloud NVIDIA H100 Qwen2.5-VL-72B-Instruct (674ms, $0 Keyless!)
  // with automatic failover to OpenRouter Free NVIDIA Nemotron-3.5-Super-VL!
  // =========================================================================
  if (webcamFrameBase64) {
    const lastUserMsg = messages[messages.length - 1]?.content || 'Hello!';
    const priorHistory = messages.slice(0, -1);
    const visionMessages = [
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
    ];

    // Vision Priority 1: OVHcloud NVIDIA H100 Keyless Free GPU (Qwen2.5-VL-72B-Instruct)
    try {
      const t0 = Date.now();
      const ovhVisionRes = await fetch(
        'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/chat/completions',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
          body: JSON.stringify({
            model: 'Qwen2.5-VL-72B-Instruct',
            messages: visionMessages,
            max_tokens: 90,
            temperature: 0.6,
          }),
          signal: AbortSignal.timeout(7500),
        }
      );
      if (ovhVisionRes.ok) {
        const vData = await ovhVisionRes.json();
        const text = vData.choices?.[0]?.message?.content?.trim() || '';
        if (text) {
          return {
            replyText: text,
            gpuNodeId: 'ovhcloud-nvidia-h100',
            gpuName: 'OVHcloud NVIDIA H100 80GB (Free Keyless)',
            modelUsed: 'Qwen2.5-VL-72B-Instruct',
            latencyMs: Date.now() - t0,
          };
        }
      }
    } catch (e) {
      console.warn('[EquipmentSpecialist Vision OVH H100 Fallback]', e);
    }

    // Vision Priority 2: OpenRouter Free NVIDIA Nemotron-3.5-Super-VL
    if (openRouterKey) {
      try {
        const t0 = Date.now();
        const orVisionRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'nvidia/nemotron-3.5-super-vl:free',
            messages: visionMessages,
            max_tokens: 120,
          }),
          signal: AbortSignal.timeout(7500),
        });
        if (orVisionRes.ok) {
          const vData = await orVisionRes.json();
          const text = vData.choices?.[0]?.message?.content?.trim() || '';
          if (text) {
            return {
              replyText: text,
              gpuNodeId: 'openrouter-free-enterprise',
              gpuName: 'OpenRouter NVIDIA H100 (:free)',
              modelUsed: 'nvidia/nemotron-3.5-super-vl:free',
              latencyMs: Date.now() - t0,
            };
          }
        }
      } catch (e) {
        console.warn('[EquipmentSpecialist Vision OpenRouter Fallback]', e);
      }
    }
  }

  // =========================================================================
  // 2. ORDERED FREE GPU SWARM CANDIDATES (Honors preferredGpuId if selected)
  // =========================================================================
  type Candidate = {
    gpuNodeId: string;
    gpuName: string;
    url: string;
    model: string;
    headers: Record<string, string>;
    extraBody?: Record<string, any>;
    timeoutMs: number;
  };

  const candidates: Candidate[] = [];

  if (groqKey && groqKey.startsWith('gsk_')) {
    candidates.push(
      {
        gpuNodeId: 'groq-lpu-cloud',
        gpuName: 'Groq Cloud LPU (Free Tier)',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'qwen/qwen3.8-27b',
        headers: { Authorization: `Bearer ${groqKey}` },
        timeoutMs: 4500,
      },
      {
        gpuNodeId: 'groq-lpu-cloud',
        gpuName: 'Groq Cloud LPU (Free Tier)',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'openai/gpt-oss-120b',
        headers: { Authorization: `Bearer ${groqKey}` },
        extraBody: { reasoning_effort: 'low', max_tokens: 250 },
        timeoutMs: 5000,
      },
      {
        gpuNodeId: 'groq-lpu-cloud',
        gpuName: 'Groq Cloud LPU (Free Tier)',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'openai/gpt-oss-20b',
        headers: { Authorization: `Bearer ${groqKey}` },
        extraBody: { reasoning_effort: 'low', max_tokens: 250 },
        timeoutMs: 4500,
      }
    );
  }

  // OVHcloud Keyless Free NVIDIA H100 Models
  candidates.push(
    {
      gpuNodeId: 'ovhcloud-nvidia-h100',
      gpuName: 'OVHcloud NVIDIA H100 80GB (Keyless Free)',
      url: 'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/chat/completions',
      model: 'Mistral-Small-3.2-24B-Instruct-2506',
      headers: {},
      timeoutMs: 5500,
    },
    {
      gpuNodeId: 'ovhcloud-nvidia-h100',
      gpuName: 'OVHcloud NVIDIA H100 80GB (Keyless Free)',
      url: 'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/chat/completions',
      model: 'Meta-Llama-3_3-70B-Instruct',
      headers: {},
      timeoutMs: 6500,
    }
  );

  // NVIDIA NIM Direct H100 (if key present)
  if (nvidiaKey) {
    candidates.push({
      gpuNodeId: 'freellmapi-34-provider-hub',
      gpuName: 'NVIDIA Build NIM H100 SXM5',
      url: 'https://integrate.api.nvidia.com/v1/chat/completions',
      model: 'meta/llama-3.3-70b-instruct',
      headers: { Authorization: `Bearer ${nvidiaKey}` },
      timeoutMs: 6000,
    });
  }

  // OpenRouter Free Enterprise Models (:free)
  if (openRouterKey) {
    candidates.push({
      gpuNodeId: 'openrouter-free-enterprise',
      gpuName: 'OpenRouter Enterprise GPU (:free)',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
      headers: { Authorization: `Bearer ${openRouterKey}` },
      extraBody: { max_tokens: 250 },
      timeoutMs: 6500,
    });
  }

  // Local Apple M5 EXO Cluster (:52415) & Ollama (:11434)
  candidates.push(
    {
      gpuNodeId: 'apple-m5-exo-cluster',
      gpuName: 'Apple M5 EXO MLX GPU Cluster (:52415)',
      url: 'http://127.0.0.1:52415/v1/chat/completions',
      model: 'mlx-community/Meta-Llama-3.1-8B-Instruct-4bit',
      headers: { Authorization: 'Bearer exo' },
      timeoutMs: 5000,
    },
    {
      gpuNodeId: 'apple-m5-ollama-metal',
      gpuName: 'Apple M5 Ollama Metal GPU (:11434)',
      url: 'http://127.0.0.1:11434/v1/chat/completions',
      model: 'llama3.2:latest',
      headers: {},
      timeoutMs: 6000,
    }
  );

  // If user or UI selected a specific GPU cluster, move its candidates to the front
  if (preferredGpuId && preferredGpuId !== 'auto-best') {
    candidates.sort((a, b) => {
      if (a.gpuNodeId === preferredGpuId && b.gpuNodeId !== preferredGpuId) return -1;
      if (b.gpuNodeId === preferredGpuId && a.gpuNodeId !== preferredGpuId) return 1;
      return 0;
    });
  }

  const fullMessages = [{ role: 'system', content: systemPrompt }, ...messages];

  for (const cand of candidates) {
    try {
      const t0 = Date.now();
      const res = await fetch(cand.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 SovereignEquipmentSpecialist/1.0',
          ...cand.headers,
        },
        body: JSON.stringify({
          model: cand.model,
          messages: fullMessages,
          temperature: 0.7,
          max_tokens: 110,
          ...(cand.extraBody || {}),
        }),
        signal: AbortSignal.timeout(cand.timeoutMs),
      });

      if (res.ok) {
        const data = await res.json();
        let reply = (data.choices?.[0]?.message?.content || '').trim();
        // Strip any <think>...</think> blocks if a reasoning model emitted them
        reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        if (reply) {
          return {
            replyText: reply,
            gpuNodeId: cand.gpuNodeId,
            gpuName: cand.gpuName,
            modelUsed: cand.model,
            latencyMs: Date.now() - t0,
          };
        }
      }
    } catch (e) {
      // Automatically fail over to the next free GPU node
    }
  }

  return {
    replyText: "Yeah, I hear you loud and clear—what's your address so we can get a tech out to you right away?",
    gpuNodeId: 'apple-m5-neural-enclave',
    gpuName: 'Apple M5 Sovereign Enclave Fallback',
    modelUsed: 'sovereign-instant-dispatcher',
    latencyMs: 5,
  };
}
