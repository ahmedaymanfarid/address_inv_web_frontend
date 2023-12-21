import { components } from "@/interfaces/db_interfaces";
import dayjs, { Dayjs } from "dayjs";

export const formatNumber = (num?: number): string | void => {
  if (!num || isNaN(num)) return "+";
  const absNum = Math.abs(num);
  let formattedNum: string;

  if (absNum >= 1e6) {
    // Convert to millions (M)
    formattedNum = (num / 1e6).toFixed(1);
  } else if (absNum >= 1e3) {
    // Convert to thousands (K)
    formattedNum = (num / 1e3).toFixed(1);
  } else {
    // Use the number as is
    formattedNum = num.toString();
  }

  // Remove decimal points if they are not necessary
  formattedNum = formattedNum.endsWith(".0")
    ? formattedNum.slice(0, -2)
    : formattedNum;

  // Append 'M' or 'K' accordingly
  if (absNum >= 1e6) {
    formattedNum += "M";
  } else if (absNum >= 1e3) {
    formattedNum += "K";
  }

  return formattedNum;
};

export const formatBudgetRange = (
  budgetRange: components["schemas"]["RangeInt"]
): string | undefined => {
  if (!budgetRange) return undefined;
  const { min, max } = budgetRange;

  if (!max) {
    return `${formatNumber(min)}+`;
  } else {
    return `${formatNumber(min)}-${formatNumber(max)}`;
  }
};

export const formatDeliveryRange = (
  deliveryRange: components["schemas"]["RangeInt"]
): string => {
  const { min, max } = deliveryRange;

  if (deliveryRange.min === 0) {
    return `RTM`;
  } else {
    return `${min} years`;
  }
};

export const formatReadableDate = (date: Dayjs | null): string => {
  if (date === null) return "";
  const today = dayjs();

  if (date.isSame(today, "day")) {
    return "today";
  } else {
    const formatString = date.year() === today.year() ? "MMM D" : "MMM D, YYYY";
    return date.format(formatString);
  }
};
