import dayjs, {ManipulateType} from "dayjs";
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

export const getTimeDiff = (
  startDate: Date,
  endDate: Date,
  timeUnit: ManipulateType
) => {
  const startTime = dayjs(startDate);
  const endTime = dayjs(endDate);
  return endTime.diff(startTime, timeUnit);
};

export const isWithinTimePeriod = (
  time: Date | string | undefined,
  amount: number,
  unit: ManipulateType
) => {
  if (time) {
    const updatedDate = dayjs(time);
    const today = dayjs();
    const targetDate = updatedDate.add(amount, unit);
    return (
      today.isAfter(updatedDate) && today.isBefore(targetDate.add(1, "day"))
    );
  }
};

export const getAfterTime = (
  time: Date | string | undefined,
  amount: number,
  unit: ManipulateType
) => {
  const updatedDate = dayjs(time);
  return updatedDate.add(amount, unit);
};
