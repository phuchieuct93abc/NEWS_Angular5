// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
const client = new textToSpeech.TextToSpeechClient();
export async function tts(text:string) {
  // Construct the request
  const request = {
    input: {ssml: text},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: 'vi', ssmlGender: 'FEMALE'},
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);

return response.audioContent;
}
