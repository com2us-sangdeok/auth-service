import { CloudServiceType } from './CloudType';

export interface CredentialsV1Interface {
  verifyCredentials(): void;
}

export interface CredentialOptions {
  cloudType: CloudServiceType;
  accessKeyId: string;
  accessKeySecret: string;
  location?: string;
}
