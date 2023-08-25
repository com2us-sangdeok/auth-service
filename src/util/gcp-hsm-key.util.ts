import { Key, SimplePublicKey } from '@xpla/xpla.js';
import { GcpHsmSignerUtil } from './gcp-hsm-signer.util';
import { keccak256 } from '@ethersproject/keccak256';

export class GcpHsmKeyUtil extends Key {
  constructor(private signer: GcpHsmSignerUtil, publicKey: Uint8Array) {
    super(new SimplePublicKey(Buffer.from(publicKey).toString('base64')));
  }

  public async sign(payload: Buffer): Promise<Buffer> {
    const digest = Buffer.from(keccak256(payload).substring(2), 'hex');

    return this.signer.sign(digest);
  }
}
