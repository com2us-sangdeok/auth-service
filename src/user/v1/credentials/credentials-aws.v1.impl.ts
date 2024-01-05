import {
  CredentialOptions,
  CredentialsV1Interface,
} from './credentials.v1.interface';
import * as AWS from 'aws-sdk';

export class CredentialsAwsV1Impl implements CredentialsV1Interface {
  private options: CredentialOptions;

  constructor(options: CredentialOptions) {
    this.options = options;
  }

  async verifyCredentials(): Promise<void> {
    const credentials = new AWS.Credentials({
      accessKeyId: this.options.accessKeyId,
      secretAccessKey: this.options.accessKeySecret,
    });
    const sts = new AWS.STS({ credentials });

    await sts
      .getCallerIdentity({})
      .promise()
      .catch((err) => {
        throw err;
      });
  }
}
