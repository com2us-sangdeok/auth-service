import {
  CredentialOptions,
  CredentialsV1Interface,
} from './credentials.v1.interface';
import { JWT } from 'google-auth-library';

export class CredentialsGcpV1Impl implements CredentialsV1Interface {
  private options: CredentialOptions;

  constructor(options: CredentialOptions) {
    this.options = options;
  }

  async verifyCredentials(): Promise<void> {
    const scopes = ['https://www.googleapis.com/auth/cloud-platform'];

    const jwtClient = new JWT({
      email: this.options.accessKeyId,
      key: this.options.accessKeySecret,
      scopes,
    });
    try {
      await jwtClient.authorize();
    } catch (e) {
      throw e;
    }
  }
}
