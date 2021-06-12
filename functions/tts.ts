import Article from "../model/Article";

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
const client = new textToSpeech.TextToSpeechClient();
export async function ttsArticle(article: Article) {
  const text = [article.header,article.description , article.body].join('<break time="2s"/>');

  let escapedLines = text;
  escapedLines = escapedLines.replace(/&/g, '&amp;');
  escapedLines = escapedLines.replace(/"/g, '&quot;');
  escapedLines = escapedLines.replace(/</g, '&lt;');
  escapedLines = escapedLines.replace(/>/g, '&gt;');

  // Convert plaintext to SSML
  // Tag SSML so that there is a 2 second pause between each address
  const expandedNewline = escapedLines.replace(/\n/g, '\n<break time="2s"/>');
  const ssml = '<speak>' + expandedNewline.substring(0,5000)  + '</speak>';
    // Construct the request
  const request = {
    input: {ssml: ssml},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: 'vi', ssmlGender: 'FEMALE'},
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);

return response.audioContent;
}
