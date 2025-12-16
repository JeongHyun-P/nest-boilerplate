import { ValueTransformer } from 'typeorm';
import { CryptoService } from './crypto.service';

export class EncryptTransformer implements ValueTransformer {
  private cryptoService = CryptoService.getInstance();

  to(value: string) {
    if (!value) {
      return value;
    }
    return this.cryptoService.encrypt(value);
  }

  from(value: string) {
    if (!value) {
      return value;
    }
    return this.cryptoService.decrypt(value);
  }
}
