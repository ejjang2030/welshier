import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export const getTimeElapsed = (updatedTime: Date | string) => {
  return dayjs(updatedTime).fromNow();
};

export const formatDate = (createdAt: Date) => {
  return dayjs(createdAt).format("YYYY. MM. DD");
};
