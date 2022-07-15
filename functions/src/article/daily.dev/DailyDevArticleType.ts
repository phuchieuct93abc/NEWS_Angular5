export interface DailyDevArticleType {
  request: Request;
  objects: Object[];
}

export interface Request {
  pageUrl: string;
  api: string;
  version: number;
}

export interface Object {
  images: Image[];
  publisherRegion: string;
  icon: string;
  diffbotUri: string;
  siteName: string;
  type: string;
  title: string;
  publisherCountry: string;
  humanLanguage: string;
  pageUrl: string;
  html: string;
  categories: Category[];
  text: string;
}

export interface Image {
  naturalHeight: number;
  width: number;
  diffbotUri: string;
  url: string;
  naturalWidth: number;
  primary?: boolean;
  height: number;
}

export interface Category {
  score: number;
  name: string;
  id: string;
}
