export interface Post {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  userId?: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any;
  hashtags?: string[];
  parentPostId?: string;
  viewCount?: number;
}
