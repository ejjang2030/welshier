export interface UserData {
  uid: string;
  email: string;
  userId: string;
  name: string;
  imageUrl: string;
  introduction: string;
  isPrivate: boolean;
  userIdUpdatedAt?: Date | string;
}

export interface Follower {
  id: string;
}
