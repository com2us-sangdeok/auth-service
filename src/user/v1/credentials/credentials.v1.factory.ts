import {
  CredentialOptions,
  CredentialsV1Interface,
} from './credentials.v1.interface';
import { CredentialsAwsV1Impl } from './credentials-aws.v1.impl';
import { CredentialsGcpV1Impl } from './credentials-gcp.v1.impl';

export class CredentialsV1Factory {
  public create(options: CredentialOptions): CredentialsV1Interface {
    switch (options.cloudType) {
      case 'gcp':
        return new CredentialsGcpV1Impl(options);
      case 'aws':
        return new CredentialsAwsV1Impl(options);

      default:
    }
  }
}
