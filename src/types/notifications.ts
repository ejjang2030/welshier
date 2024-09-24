export type ActivityType = "followed" | "recommendation" | "liked" | "alert";

export interface ActivityData {
  id?: string;
  activityType: ActivityType;
  uid?: string;
  postId?: string;
  isRead: boolean;
  createdAt: string;
  message?: string;
}

// export interface Activity {
//   activityType: ActivityType;
//   uid?: string; // post의 id 또는 팔로우 한 사람의 uid
//   postId?: string;
// }

export type Activity = Exclude<ActivityData, "createdAt" | "isRead">;
