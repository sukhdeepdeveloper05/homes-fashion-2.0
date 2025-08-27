import axios from "@/services/Axios";

export async function createData(url, data, params, requiresAdmin = true) {
  try {
    return await axios.post(url, data, { params, meta: { requiresAdmin } });
  } catch (error) {
    throw new Error(
      error.message ?? error.data.message ?? "Something went wrong"
    );
  }
}
