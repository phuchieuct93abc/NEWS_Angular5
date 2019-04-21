export interface Diffbot {
    request: Request;
    objects?: (ObjectsEntity)[] | null;
}

export interface Request {
    pageUrl: string;
    api: string;
    version: number;
    resolvedPageUrl: string;
}

export interface ObjectsEntity {
    date: string;
    images?: (ImagesEntity)[] | null;
    author: string;
    estimatedDate: string;
    publisherRegion: string;
    icon: string;
    diffbotUri: string;
    siteName: string;
    type: string;
    title: string;
    tags?: (TagsEntity)[] | null;
    publisherCountry: string;
    humanLanguage: string;
    authorUrl: string;
    pageUrl: string;
    html: string;
    text: string;
    resolvedPageUrl: string;
    authors?: (AuthorsEntity)[] | null;
}

export interface ImagesEntity {
    naturalHeight: number;
    diffbotUri: string;
    url: string;
    naturalWidth: number;
    primary?: boolean | null;
    width?: number | null;
    height?: number | null;
}

export interface TagsEntity {
    score: number;
    count: number;
    label: string;
    uri: string;
    rdfTypes?: (string)[] | null;
}

export interface AuthorsEntity {
    name: string;
    link: string;
}
