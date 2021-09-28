import { BodyElementParser } from './BodyElementParser';

interface VideoParserI {
  type: 'video';
  content: string;
  width: number;
  height: number;
  originUrl: string;
  poster: string;
}

export class VideoParser extends BodyElementParser<VideoParserI> {
  parser(): string {
    return `<app-video 
                    poster='${this.body.poster.replace('http://', 'https://')}' 
                    origin-url='${this.body.originUrl.replace('http://', 'https://')}' 
                    url='${this.body.content.replace('http://', 'https://')}' 
                    width='${this.body.width}' 
                    height='${this.body.height}'>
                </app-video>`;
  }
}
