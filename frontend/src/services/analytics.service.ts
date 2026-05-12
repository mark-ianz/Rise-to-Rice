import { axiosError } from "@/helper/errorHandler";
import { MaterialAnalytics, UserAnalytics } from "@/types/analytics";
import { Time } from "@/types/time";
import axios from "axios";

export async function get_total_weight(
  time: Time,
  user_id?: number | undefined | null
) {
  try {
    const result = await axios.get<MaterialAnalytics[]>(
      `/api/analytics/total_weight/${time}/` + (user_id ? user_id : "")
    );
    return result.data;
  } catch (error) {
    axiosError(error);
  }
}

export async function get_user_analytics(
  time: Time,
  user_id: number | undefined | null
) {
  try {
    const result = await axios.get<UserAnalytics>(
      `/api/analytics/user/${time}/${user_id}`
    );
    return result.data;
  } catch (error) {
    axiosError(error);
  }
}
