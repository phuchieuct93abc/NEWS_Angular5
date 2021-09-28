import { BodyElementParser } from './BodyElementParser';

interface TextParserI {
  content: string;

  type: 'text';
}
export class TextParser extends BodyElementParser<TextParserI> {
  parser(): string {
    return `<p>${this.body.content}<p>`;
  }
}
