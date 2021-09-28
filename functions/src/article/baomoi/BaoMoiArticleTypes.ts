export interface Pokedex {
  err: number;
  msg: string;
  data: BaomoiData;
  timestamp: number;
}

export interface BaomoiData {
  id: number;
  contentId: number;
  title: string;
  description: string;
  date: number;
  url: string;
  redirectUrl: string;
  thumb: string;
  thumbL: string;
  classNames: string;
  publisher: Publisher;
  originalUrl: string;
  shareUrl: string;
  publishedDate: number;
  totalLike: number;
  status: number;
  topicIds: number[];
  isNoAd: boolean;
  tags: Tag[];
  bodys: Body[];
  speechs: Speech[];
  category: Category;
  cluster: Cluster;
  ad: Ad;
}

export interface Ad {
  zoneIds: string[];
  isNoAd: boolean;
  masthead: Masthead;
  adtimaConfig: AdtimaConfig;
}

export interface AdtimaConfig {
  contentId: string;
}

export interface Masthead {
  elId: string;
  url: string;
  params: Params;
}

export interface Params {
  zoneId: string;
  page: number;
  id: number;
}

export interface Body {
  type: Type;
  content?: string;
  contentOrigin?: string;
  width?: number;
  height?: number;
  originUrl?: string;
  subType?: string;
  zoneId?: string;
  id?: string;
  elId?: string;
}

export enum Type {
  AdBanner = 'adBanner',
  Image = 'image',
  Text = 'text',
}

export interface Category {
  id: number;
  name: string;
  url: string;
  shortUrl: string;
}

export interface Cluster {
  id: number;
  objectType: number;
  name: string;
  url: string;
  total: number;
}

export interface Publisher {
  logo: string;
  icon: string;
  url: string;
  id: number;
  shortName: string;
  objectType: number;
  name: string;
  originalUrl: string;
}

export interface Speech {
  id: number;
  name: string;
  streamingUrl: string;
}

export interface Tag {
  name: string;
  url: string;
}
