import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

export const COGNITO_CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
export const COGNITO_REGION = process.env.NEXT_PUBLIC_COGNITO_REGION;

let _client = null;

export function getCognitoClient() {
  if (!_client) {
    _client = new CognitoIdentityProviderClient({ region: COGNITO_REGION });
  }
  return _client;
}
