import axios from "@/services/Axios";

export async function updateData(url, params, data, requiresAdmin = true) {
  try {
    return await axios.patch(url, data, { params, meta: { requiresAdmin } });
  } catch (error) {
    throw new Error(
      error.message ?? error.data.message ?? "Something went wrong"
    );
  }
}
