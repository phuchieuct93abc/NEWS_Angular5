import { OAuth2Client } from 'google-auth-library';
import * as admin from 'firebase-admin';

const client = new OAuth2Client('17159897246-6hfdpdr301isae78t0l7u6v99sklbsef.apps.googleusercontent.com');
export const verifyGoogleToken = async (token: string): Promise<{ email?: string }> => {
  if (token == undefined) {
    return {};
  }
  try {
    return await admin.auth().verifyIdToken(token);
  } catch (error) {
    console.error('wrong google id');
  }
  return {};
};
