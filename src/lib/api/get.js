import axios from "@/services/Axios";

export async function getData(url = "", params = {}, requiresAdmin = false) {
  try {
    return await axios.get(url, { params, meta: { requiresAdmin } });
  } catch (error) {
    throw new Error(
      error.message ?? error.data.message ?? "Something went wrong"
    );
  }
}
