export const DEFAULT_ANTHROPIC_MODEL = "claude-haiku-5-5";
export const DEFAULT_MAX_TOKENS = 512;

export function getAnthropicModel(): string {
  return process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_ANTHROPIC_MODEL;
}

export function getAnthropicMaxTokens(): number {
  const raw = process.env.ANTHROPIC_MAX_TOKENS;
  const n = raw ? parseInt(raw, 10) : DEFAULT_MAX_TOKENS;
  return Number.isFinite(n) && n > 0 ? Math.min(n, 1024) : DEFAULT_MAX_TOKENS;
}
