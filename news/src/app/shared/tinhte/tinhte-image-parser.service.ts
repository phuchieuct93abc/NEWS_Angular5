interface ImageParserI {
  content: string;
  contentOrigin: string;
  height: number;
  originUrl: string;
  type: 'image';
  width: number;
}
export class ImageParser {
  constructor(private body: ImageParserI) {}
  parser(): string {
    return `<img src='${this.body.content}' width='${this.body.width}' height='${this.body.height}'></img>`;
  }
}
