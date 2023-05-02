import Article from './src/model/Article';

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
const client = new textToSpeech.TextToSpeechClient();
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const sanitize = (text: string): string => {
  const dom = new JSDOM(`<!DOCTYPE html><body>${text}</body>`);
  dom.window.document.querySelector('a')?.remove();
  dom.window.document.querySelector('img')?.remove();
  dom.window.document.querySelector('script')?.remove();

  let escapedLines = dom.window.document.querySelector('body').textContent.trim();
  escapedLines = escapedLines.replace(/&/g, '&amp;');
  escapedLines = escapedLines.replace(/"/g, '&quot;');
  escapedLines = escapedLines.replace(/</g, '&lt;');
  escapedLines = escapedLines.replace(/>/g, '&gt;');
  return escapedLines;
};
export async function ttsArticle(article: Article) {
  let text = [article.header, article.description, sanitize(article.body!)].join('\n');
  text = text.replace(/\n/g, '\n<break time="1" />');
  text = `<speak>${text.substring(0, 4000)}</speak>`;

  const request = {
    input: { ssml: text },
    voice: {
      languageCode: 'vi-VN',
      name: 'vi-VN-Standard-C',
    },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await client.synthesizeSpeech(request);

  return response.audioContent;
}
