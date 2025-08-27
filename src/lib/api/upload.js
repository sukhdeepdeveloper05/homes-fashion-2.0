import axios from "@/services/Axios";

export async function uploadMedia(media, params, requiresAdmin = true) {
  try {
    const formData = new FormData();

    if (Array.isArray(media)) {
      for (const file of media) {
        formData.append("media", file);
      }
    } else {
      formData.append("media", media);
    }
    return await axios.post("/media", formData, {
      params,
      headers: { "Content-Type": "multipart/form-data" },
      meta: { requiresAdmin },
    });
  } catch (error) {
    throw new Error(
      error.message ?? error.data.message ?? "Something went wrong"
    );
  }
}
