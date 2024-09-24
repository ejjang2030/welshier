import {Activity} from "types/notifications";
import FollowedActivityItem from "./FollowedActivityItem";
import PostBoxActivityItem from "./PostBoxActivityItem";
import LikedActivityItem from "./LikedActivityItem";
import AlertActivityItem from "./AlertActivityItem";

export interface ActivityItemProps {
  key: number;
  activity: Activity;
  onClick: any;
}

const ActivityItem = ({key, activity, onClick}: ActivityItemProps) => {
  return (
    <div className='notification-item'>
      {activity.activityType === "followed" && (
        <FollowedActivityItem
          key={key}
          uid={activity.uid!}
          isRead={activity.isRead}
          onClick={onClick}
        />
      )}
      {activity.activityType === "recommendation" && (
        <PostBoxActivityItem
          key={key}
          postId={activity.postId!}
          isRead={activity.isRead!}
          onClick={onClick}
        />
      )}
      {activity.activityType === "liked" && (
        <LikedActivityItem
          key={key}
          uid={activity.uid!}
          postId={activity.postId!}
          isRead={activity.isRead!}
          onClick={onClick}
        />
      )}
      {activity.activityType === "alert" && (
        <AlertActivityItem
          key={key}
          postId={activity.postId!}
          message={activity.message!}
          isRead={activity.isRead!}
          onClick={onClick}
        />
      )}
    </div>
  );
};

export default ActivityItem;
