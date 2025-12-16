import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private static instance: CryptoService;

  private readonly algorithm = 'aes-256-cbc';
  private readonly key = crypto
    .createHash('sha256')
    .update(process.env.CRYPTO_KEY || '')
    .digest();

  private constructor() {}

  static getInstance(): CryptoService {
    if (!CryptoService.instance) {
      CryptoService.instance = new CryptoService();
    }
    return CryptoService.instance;
  }

  encrypt(value: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  decrypt(value: string) {
    if (!value || !value.includes(':')) {
      return null;
    }
    const [ivHex, data] = value.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(data, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString('utf8');
  }

  digest(value: string) {
    return crypto.createHash('sha256').update(value).digest('hex');
  }
}
