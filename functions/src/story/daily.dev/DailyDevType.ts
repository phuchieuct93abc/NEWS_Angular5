export interface DailyDevStory {
  data: Data;
}

export interface Data {
  page: Page;
}

export interface Page {
  pageInfo: PageInfo;
  edges: Edge[];
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

export interface Edge {
  node: Node;
}

export interface Node {
  id: string;
  title: string;
  createdAt: string;
  image: string;
  readTime: number;
  source: Source;
  permalink: string;
  numComments: number;
  numUpvotes: number;
  commentsPermalink: string;
  scout?: Scout;
  author?: Author;
  trending: any;
  tags: string[];
}

export interface Source {
  id: string;
  name: string;
  image: string;
}

export interface Scout {
  id: string;
  name: string;
  image: string;
  username: string;
}

export interface Author {
  id: string;
  name: string;
  image: string;
  username: string;
  permalink: string;
}
