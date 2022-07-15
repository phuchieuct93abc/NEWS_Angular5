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
  date: string;
  sentiment: number;
  images: Image[];
  author: string;
  estimatedDate: string;
  publisherRegion: string;
  icon: string;
  diffbotUri: string;
  siteName: string;
  discussion: Discussion;
  type: string;
  title: string;
  tags: Tag2[];
  publisherCountry: string;
  humanLanguage: string;
  authorUrl: string;
  pageUrl: string;
  html: string;
  categories: Category[];
  text: string;
  resolvedPageUrl: string;
}

export interface Image {
  naturalHeight: number;
  width: number;
  diffbotUri: string;
  url: string;
  naturalWidth: number;
  primary?: boolean;
  height: number;
  title?: string;
}

export interface Discussion {
  numPages: number;
  confidence: number;
  diffbotUri: string;
  pageUrl: string;
  numPosts: number;
  type: string;
  title: string;
  posts: Post[];
  tags: Tag[];
  participants: number;
}

export interface Post {
  date: string;
  sentiment: number;
  humanLanguage: string;
  author: string;
  authorUrl: string;
  diffbotUri: string;
  html: string;
  pageUrl: string;
  id: number;
  text: string;
  type: string;
}

export interface Tag {
  score: number;
  count: number;
  label: string;
  uri: string;
  rdfTypes: string[];
}

export interface Tag2 {
  score: number;
  sentiment: number;
  count: number;
  label: string;
  uri: string;
  rdfTypes: string[];
}

export interface Category {
  score: number;
  name: string;
  id: string;
}
