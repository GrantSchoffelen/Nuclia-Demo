import crypto from 'crypto';

export function hashString(string: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(string);
  return hash.digest('hex');
}