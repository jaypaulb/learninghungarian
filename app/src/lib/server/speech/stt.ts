/**
 * Speech-to-text adapter. Real backend: whisper-asr-webservice on HAL
 * (faster-whisper, CPU). Mock: deterministic, for tests — returns the
 * expected text supplied via the X-Mock-Transcript convention.
 */
export interface SttResult {
  transcript: string;
  provider: string;
}

export function resolveSttProvider(): 'whisper' | 'mock' {
  if (process.env.STT_PROVIDER === 'mock') return 'mock';
  if (process.env.STT_BASE_URL) return 'whisper';
  return 'mock';
}

export async function transcribe(audio: Blob, mockTranscript?: string): Promise<SttResult> {
  const provider = resolveSttProvider();
  if (provider === 'mock') {
    return { transcript: mockTranscript ?? 'MOCK_TRANSCRIPT', provider };
  }
  const base = process.env.STT_BASE_URL!; // e.g. http://whisper:9000
  const form = new FormData();
  form.append('audio_file', audio, 'speech.webm');
  const res = await fetch(`${base}/asr?output=json&language=hu&task=transcribe`, {
    method: 'POST',
    signal: AbortSignal.timeout(60_000),
    body: form
  });
  if (!res.ok) throw new Error(`whisper HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return { transcript: (data.text ?? '').trim(), provider };
}
