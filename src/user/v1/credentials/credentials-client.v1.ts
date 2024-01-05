import {
  CredentialOptions,
  CredentialsV1Interface,
} from './credentials.v1.interface';
import { CredentialsV1Factory } from './credentials.v1.factory';

export class CredentialsClientV1 {
  options: CredentialOptions;
  client: CredentialsV1Interface;

  constructor(options: CredentialOptions) {
    this.options = options;
    this.client = new CredentialsV1Factory().create(options);
  }
}
