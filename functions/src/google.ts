import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client('17159897246-6hfdpdr301isae78t0l7u6v99sklbsef.apps.googleusercontent.com');
export const verifyGoogleToken = async (token: string): Promise<{ email?: string }> => {
  if (token == undefined) {
    return {};
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '17159897246-6hfdpdr301isae78t0l7u6v99sklbsef.apps.googleusercontent.com', // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload;
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    return userid;
  } catch (error) {
    console.error('wrong google id');
  }
  return {};
};
