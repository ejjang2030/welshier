import ActivityItem from "components/notifications/ActivityItem";
import AuthContext from "context/AuthContext";
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  where,
  documentId,
  updateDoc,
} from "firebase/firestore";
import {db} from "firebaseApp";
import {useCallback, useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Activity} from "types/notifications";

const NotificationPage = () => {
  const {t} = useTranslation();
  const {user} = useContext(AuthContext);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (user) {
      const activitiesRef = doc(db, "activities", user.uid);
      const collectionRef = collection(activitiesRef, "activities");
      const activitiesQuery = query(
        collectionRef,
        orderBy("createdAt", "desc")
      );
      onSnapshot(activitiesQuery, snapshot => {
        setActivities([]);
        snapshot.docs.forEach(doc => {
          setActivities(prev =>
            prev ? [...prev, {...doc.data(), id: doc.id} as Activity] : []
          );
        });
      });
    }
  }, [user]);

  const updateIsRead = useCallback(
    async (activityId: string) => {
      if (user) {
        const postRef = doc(db, "activities", user!.uid);
        const collectionRef = doc(postRef, "activities", activityId);
        await updateDoc(collectionRef, {
          isRead: true,
        });
      }
    },
    [user]
  );

  return (
    <div className='activities'>
      <div className='activities__appbar'>
        <div className='activities__appbar-text'>
          <span>{t("activities")}</span>
        </div>
      </div>
      {activities &&
        activities.length > 0 &&
        activities.map((activity, index) => {
          return (
            <ActivityItem
              key={index}
              activity={activity}
              onClick={() => updateIsRead(activity.id!)}
            />
          );
        })}
    </div>
  );
};

export default NotificationPage;
