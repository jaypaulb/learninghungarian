/**
 * Provider-agnostic AI adapter (spec: Claude default, hybrid cost model).
 * Backends:
 *  - anthropic       — activates when ANTHROPIC_API_KEY is set (best quality)
 *  - openai-compat   — any OpenAI-compatible /v1/chat endpoint (Ollama on HAL;
 *                      free, self-hosted default)
 *  - mock            — deterministic, for tests
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
  provider: string;
}

const TIMEOUT_MS = 60_000;

export function resolveProvider(): 'anthropic' | 'openai-compat' | 'mock' {
  const forced = process.env.AI_PROVIDER;
  if (forced === 'anthropic' || forced === 'openai-compat' || forced === 'mock') return forced;
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.AI_BASE_URL) return 'openai-compat';
  return 'mock';
}

export async function chat(messages: ChatMessage[], opts?: { maxTokens?: number }): Promise<ChatResult> {
  const provider = resolveProvider();
  const maxTokens = opts?.maxTokens ?? 700;

  if (provider === 'mock') {
    const last = messages[messages.length - 1]?.content ?? '';
    return {
      text: `MOCK_TUTOR_REPLY: ${last.slice(0, 60)}`,
      inputTokens: Math.ceil(last.length / 4),
      outputTokens: 20,
      provider
    };
  }

  if (provider === 'anthropic') {
    const system = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n');
    const rest = messages.filter((m) => m.role !== 'system');
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'claude-sonnet-5',
        max_tokens: maxTokens,
        system,
        messages: rest
      })
    });
    if (!res.ok) throw new Error(`anthropic HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    return {
      text: data.content?.map((c: { text?: string }) => c.text ?? '').join('') ?? '',
      inputTokens: data.usage?.input_tokens ?? 0,
      outputTokens: data.usage?.output_tokens ?? 0,
      provider
    };
  }

  // openai-compat (Ollama)
  const base = process.env.AI_BASE_URL!; // e.g. http://ollama:11434/v1
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: process.env.AI_MODEL || 'qwen2.5:7b-instruct',
      max_tokens: maxTokens,
      messages
    })
  });
  if (!res.ok) throw new Error(`openai-compat HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return {
    text: data.choices?.[0]?.message?.content ?? '',
    inputTokens: data.usage?.prompt_tokens ?? 0,
    outputTokens: data.usage?.completion_tokens ?? 0,
    provider
  };
}
