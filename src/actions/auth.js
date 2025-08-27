"use server";

import axiosInstance from "@/services/Axios";

export async function adminSignIn(formData) {
  try {
    const response = await axiosInstance.post("auth/login", formData);
    return response;
  } catch (error) {
    if (error?.status === 401 && error.request.path !== "/auth/login") {
      redirect("/admin/logout");
    }

    return {
      error: {
        message:
          error?.data?.message || error?.message || "Something went wrong",
      },
    };
  }
}
