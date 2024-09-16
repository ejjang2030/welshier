import _ from "lodash";

export function getRandomElements<T>(array: T[], count: number): T[] {
  return _.sampleSize(array, count);
}
