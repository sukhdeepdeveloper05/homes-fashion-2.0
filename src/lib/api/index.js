"use server";

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

export async function createData(url, data, params, requiresAdmin = true) {
  try {
    return await axios.post(url, data, { params, meta: { requiresAdmin } });
  } catch (error) {
    throw new Error(
      error.message ?? error.data.message ?? "Something went wrong"
    );
  }
}

export async function updateData(url, params, data, requiresAdmin = true) {
  try {
    return await axios.patch(url, data, { params, meta: { requiresAdmin } });
  } catch (error) {
    throw new Error(
      error.message ?? error.data.message ?? "Something went wrong"
    );
  }
}

export async function deleteData(url, params, requiresAdmin = true) {
  try {
    return await axios.delete(url, { params, meta: { requiresAdmin } });
  } catch (error) {
    throw new Error(
      error.message ?? error.data.message ?? "Something went wrong"
    );
  }
}

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
