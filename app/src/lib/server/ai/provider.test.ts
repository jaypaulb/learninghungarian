import { describe, it, expect, afterEach } from 'vitest';
import { chat, resolveProvider } from './provider';

const saved = { ...process.env };
afterEach(() => {
  process.env.AI_PROVIDER = saved.AI_PROVIDER;
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.AI_BASE_URL;
});

describe('resolveProvider', () => {
  it('prefers explicit AI_PROVIDER', () => {
    process.env.AI_PROVIDER = 'mock';
    process.env.ANTHROPIC_API_KEY = 'sk-x';
    expect(resolveProvider()).toBe('mock');
  });
  it('anthropic when key present', () => {
    delete process.env.AI_PROVIDER;
    process.env.ANTHROPIC_API_KEY = 'sk-x';
    expect(resolveProvider()).toBe('anthropic');
  });
  it('openai-compat when base url present', () => {
    delete process.env.AI_PROVIDER;
    process.env.AI_BASE_URL = 'http://ollama:11434/v1';
    expect(resolveProvider()).toBe('openai-compat');
  });
  it('mock otherwise', () => {
    delete process.env.AI_PROVIDER;
    expect(resolveProvider()).toBe('mock');
  });
});

describe('chat (mock)', () => {
  it('returns deterministic reply with token counts', async () => {
    process.env.AI_PROVIDER = 'mock';
    const r = await chat([{ role: 'user', content: 'Szia!' }]);
    expect(r.text).toContain('MOCK_TUTOR_REPLY');
    expect(r.provider).toBe('mock');
    expect(r.outputTokens).toBeGreaterThan(0);
  });
});
