export default class ArticleComment {
  constructor(
    public commentId: number,
    public parentId: number,
    public comment: string,
    public date: number,
    public likeCount: number,
    public dislikeCount: number,
    public replyCount: number,
    public userId: string,
    public displayName: string,
    public avatar: string
  ) {}
}
