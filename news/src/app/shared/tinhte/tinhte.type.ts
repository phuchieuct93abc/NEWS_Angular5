export interface TinhTeStories {
  threads: Thread[];
  threads_total: number;
  list: List;
  links: Links5;
}

export interface TinhTeArticle {
  thread: Thread;
}
export interface Thread {
  content_type: string;
  content_id: number;
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
  thread_tags: any;
  links: Links3;
  permissions: Permissions3;
  user_is_followed: boolean;
  user_thread_count: number;
  user_follower_count: number;
  user_like_count: number;
  fp_permissions: FpPermissions2;
  rating_total?: number;
  rating_count?: number;
  creator_has_verified_badge: boolean;
  thread_image: ThreadImage;
  thread_thumbnail: ThreadThumbnail;
  thread_is_bookmark: boolean;
  is_draft: boolean;
  forum: Forum;
  list_item: ListItem;
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
  attachments?: Attachment[];
  links: Links2;
  permissions: Permissions2;
  poster_rank: PosterRank;
  user_is_followed: boolean;
  fp_permissions: FpPermissions;
  poster_has_verified_badge: boolean;
  post_reaction_total: number;
  post_reactions: PostReactions;
  post_visitor_reaction_id: number;
  stickers: any[];
}

export interface LikeUser {
  user_id: number;
  username: string;
  reaction_id: number;
}

export interface Attachment {
  attachment_id: number;
  attachment_download_count: number;
  filename: string;
  links: Links;
  attachment_width: number;
  attachment_height: number;
  attachment_is_video: boolean;
  post_id: number;
  permissions: Permissions;
  attachment_is_inserted: boolean;
  video_ratio: number;
}

export interface Links {
  permalink: string;
  data: string;
  thumbnail: string;
  post: string;
}

export interface Permissions {
  view: boolean;
  delete: boolean;
}

export interface Links2 {
  permalink: string;
  detail: string;
  thread: string;
  poster: string;
  likes: string;
  report: string;
  attachments: string;
  poster_avatar: string;
}

export interface Permissions2 {
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

export interface FpPermissions {
  delete: boolean;
}

export interface PostReactions {
  '1': number;
  '2': number;
  '6': number;
  '3': number;
  '4': number;
  '5': number;
}

export interface ThreadPrefix {
  prefix_id: number;
  prefix_title: string;
}

export interface Links3 {
  permalink: string;
  detail: string;
  followers: string;
  forum: string;
  posts: string;
  first_poster: string;
  first_poster_avatar: string;
  first_post: string;
  last_poster?: string;
  last_post: string;
  image: string;
}

export interface Permissions3 {
  view: boolean;
  delete: boolean;
  follow: boolean;
  post: boolean;
  upload_attachment: boolean;
  edit_prefix: boolean;
  edit_tags: boolean;
  edit_title: boolean;
  tinhtemods_redirect: boolean;
  reply_bans: boolean;
  edit_image: boolean;
}

export interface FpPermissions2 {
  stick: boolean;
  unstick: boolean;
  delete: boolean;
}

export interface ThreadImage {
  link: string;
  width: number;
  height: number;
  display_mode?: string;
}

export interface ThreadThumbnail {
  link: string;
  width: number;
  height: number;
}

export interface Forum {
  forum_id: number;
  forum_title: string;
  forum_description: string;
  forum_thread_count: number;
  forum_post_count: number;
  forum_prefixes: ForumPrefix[];
  thread_default_prefix_id: number;
  thread_prefix_is_required: boolean;
  links: Links4;
  permissions: Permissions4;
  forum_is_followed: boolean;
  forum_thumbnail_url: string;
}

export interface ForumPrefix {
  group_title: string;
  group_prefixes: GroupPrefix[];
}

export interface GroupPrefix {
  prefix_id: number;
  prefix_title: string;
}

export interface Links4 {
  permalink: string;
  detail: string;
  'sub-categories': string;
  'sub-forums': string;
  threads: string;
  followers: string;
}

export interface Permissions4 {
  view: boolean;
  edit: boolean;
  delete: boolean;
  create_thread: boolean;
  upload_attachment: boolean;
  tag_thread: boolean;
  follow: boolean;
}

export interface ListItem {
  item_id: number;
  item_title: string;
  item_date: number;
  user_id: number;
}

export interface List {
  list_id: number;
  list_name: string;
  list_description: string;
  list_item_count: number;
}

export interface Links5 {
  pages: number;
  page: number;
  next: string;
}
