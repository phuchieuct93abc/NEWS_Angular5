export interface Pokedex {
  thread: TinhteData;
}

export interface TinhteData {
  thread_id: number;
  forum_id: number;
  thread_title: string;
  thread_view_count: number;
  creator_user_id: number;
  creator_username: string;
  thread_create_date: number;
  thread_update_date: number;
  thread_is_new: boolean;
  user_is_ignored: boolean;
  thread_post_count: number;
  thread_is_published: boolean;
  thread_is_deleted: boolean;
  thread_is_sticky: boolean;
  thread_is_followed: boolean;
  first_post: FirstPost;
  thread_prefixes: ThreadPrefix[];
  thread_tags: { [key: string]: string };
  links: ThreadLinks;
  permissions: ThreadPermissions;
  rating_total: null;
  rating_count: null;
  creator_has_verified_badge: boolean;
  thread_image: ThreadImageClass;
  thread_thumbnail: ThreadImageClass;
  thread_is_bookmark: boolean;
  user_is_followed: boolean;
  fp_permissions: ThreadFPPermissions;
  is_draft: boolean;
}

export interface FirstPost {
  post_id: number;
  thread_id: number;
  poster_user_id: number;
  poster_username: string;
  post_create_date: number;
  post_body: string;
  post_body_html: string;
  post_body_plain_text: string;
  signature: string;
  signature_html: string;
  signature_plain_text: string;
  post_like_count: number;
  post_attachment_count: number;
  like_users: LikeUser[];
  user_is_ignored: boolean;
  post_is_published: boolean;
  post_is_deleted: boolean;
  post_update_date: number;
  post_is_first_post: boolean;
  post_is_liked: boolean;
  attachments: Attachment[];
  links: FirstPostLinks;
  permissions: FirstPostPermissions;
  poster_has_verified_badge: boolean;
  post_reaction_total: number;
  post_reactions: { [key: string]: number };
  post_visitor_reaction_id: number;
  stickers: any[];
  poster_rank: PosterRank;
  user_is_followed: boolean;
  fp_permissions: FirstPostFPPermissions;
}

export interface Attachment {
  attachment_id: number;
  attachment_download_count: number;
  filename: string;
  links: AttachmentLinks;
  attachment_width: number;
  attachment_height: number;
  attachment_is_video: boolean;
  post_id: number;
  permissions: AttachmentPermissions;
  attachment_is_inserted: boolean;
  video_ratio?: number;
}

export interface AttachmentLinks {
  permalink: string;
  data: string;
  thumbnail: string;
  post: string;
}

export interface AttachmentPermissions {
  view: boolean;
  delete: boolean;
}

export interface FirstPostFPPermissions {
  delete: boolean;
}

export interface LikeUser {
  user_id: number;
  username: string;
  reaction_id: number;
}

export interface FirstPostLinks {
  permalink: string;
  detail: string;
  thread: string;
  poster: string;
  likes: string;
  report: string;
  attachments: string;
  poster_avatar: string;
}

export interface FirstPostPermissions {
  view: boolean;
  edit: boolean;
  delete: boolean;
  reply: boolean;
  like: boolean;
  report: boolean;
  upload_attachment: boolean;
  vote: boolean;
}

export interface PosterRank {
  rank_level: number;
  rank_name: string;
  rank_group_id: number;
  rank_points: number;
}

export interface ThreadFPPermissions {
  stick: boolean;
  unstick: boolean;
  delete: boolean;
}

export interface ThreadLinks {
  permalink: string;
  detail: string;
  followers: string;
  forum: string;
  posts: string;
  first_poster: string;
  first_poster_avatar: string;
  first_post: string;
  last_poster: string;
  last_post: string;
  image: string;
}

export interface ThreadPermissions {
  view: boolean;
  delete: boolean;
  follow: boolean;
  post: boolean;
  upload_attachment: boolean;
  edit_prefix: boolean;
  edit_tags: boolean;
  edit_title: boolean;
  edit_image: boolean;
  tinhtemods_redirect: boolean;
}

export interface ThreadImageClass {
  link: string;
  width: number;
  height: number;
}

export interface ThreadPrefix {
  prefix_id: number;
  prefix_title: string;
}
