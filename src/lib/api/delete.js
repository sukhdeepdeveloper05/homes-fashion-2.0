import axios from "@/services/Axios";

export async function deleteData(url, params, requiresAdmin = true) {
  try {
    return await axios.delete(url, { params, meta: { requiresAdmin } });
  } catch (error) {
    throw new Error(
      error.message ?? error.data.message ?? "Something went wrong"
    );
  }
}
