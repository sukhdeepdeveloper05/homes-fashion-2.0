"use server";

import axiosInstance from "@/services/Axios";

export async function signIn(formData) {
  try {
    return await axiosInstance.post("auth/login", formData);
  } catch (error) {
    if (
      error?.status === 401 &&
      error.request.path !== "/auth/login" &&
      formData.userType === "admin"
    ) {
      redirect("/admin/logout");
    }

    throw new Error(
      error?.data?.message || error?.message || "Something went wrong"
    );
  }
}

export async function requestOtp(formData) {
  try {
    return await axiosInstance.post("/auth/request-otp", formData);
  } catch (error) {
    throw new Error(
      error?.data?.message || error?.message || "Something went wrong"
    );
  }
}
