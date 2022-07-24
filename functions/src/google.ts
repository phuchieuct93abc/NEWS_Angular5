import * as admin from 'firebase-admin';

export const verifyGoogleToken = async (token: string): Promise<{ email?: string }> => {
  if (token == undefined) {
    return {};
  }
  try {
    return await admin.auth().verifyIdToken(token);
  } catch (error) {
    console.error('wrong google id', error);
  }
  return {};
};
