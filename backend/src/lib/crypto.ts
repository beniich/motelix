import crypto from 'node:crypto';
import { env } from '../config/env.js';

const ALG = 'aes-256-gcm';
const KEY = crypto.createHash('sha256').update(env.JWT_SECRET).digest();

export function encryptJson(data: any): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALG, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

export function decryptJson(encrypted: string): any {
  const buffer = Buffer.from(encrypted, 'base64');
  const iv = buffer.subarray(0, 12);
  const authTag = buffer.subarray(12, 28);
  const data = buffer.subarray(28);
  const decipher = crypto.createDecipheriv(ALG, KEY, iv);
  decipher.setAuthTag(authTag);
  return JSON.parse(Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8'));
}
