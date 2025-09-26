export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

export const STATUS_BADGES = {
  ACTIVE: "text-[#0CAF60] data-[hover=true]:bg-[#E7F7EF] bg-[#E7F7EF]",
  DRAFT: "text-[#E03137] data-[hover=true]:bg-[#FFEDEC] bg-[#FFEDEC]",

  IN_STOCK: "text-[#0CAF60] data-[hover=true]:bg-[#E7F7EF] bg-[#E7F7EF]",
  OUT_OF_STOCK: "text-[#E03137] data-[hover=true]:bg-[#FFEDEC] bg-[#FFEDEC]",

  PAID: "text-[#0CAF60] data-[hover=true]:bg-[#E7F7EF] bg-[#E7F7EF]",
  FAILED: "text-[#E03137] data-[hover=true]:bg-[#FFEDEC] bg-[#FFEDEC]",

  FULFILLED: "text-[#0CAF60] data-[hover=true]:bg-[#E7F7EF] bg-[#E7F7EF]",
  UN_FULFILLED: "text-[#E03137] data-[hover=true]:bg-[#FFEDEC] bg-[#FFEDEC]",

  PENDING: "text-[#E6BB20] data-[hover=true]:bg-[#FFF6D3] bg-[#FFF6D3]",
  COMPLETED: "text-[#0CAF60] data-[hover=true]:bg-[#E7F7EF] bg-[#E7F7EF]",
  CONFIRMED: "text-[#007bff] data-[hover=true]:bg-[#007bff] bg-[#e9f4ff]",
  CANCELLED: "text-[#E03137] data-[hover=true]:bg-[#FFEDEC] bg-[#FFEDEC]",
};

export const PRODUCT_STATUSES = [
  { value: "active", label: "Active", key: "ACTIVE" },
  { value: "draft", label: "Draft", key: "DRAFT" },
];

export const PYAMENT_STATUSES = [
  { value: "paid", label: "Paid", key: "PAID" },
  { value: "pending", label: "Pending", key: "PENDING" },
  { value: "failed", label: "Failed", key: "FAILED" },
];

export const ORDER_STATUSES = [
  { value: "pending", label: "Pending", key: "PENDING" },
  { value: "fulfilled", label: "Fulfilled", key: "FULFILLED" },
  { value: "unfulfilled", label: "Unfulfilled", key: "UN_FULFILLED" },
  { value: "scheduled", label: "Scheduled", key: "SCHEDULED" },
  { value: "on hold", label: "On Hold", key: "ON_HOLD" },
];
export const BOOKING_STATUSES = [
  { value: "pending", label: "Pending", key: "PENDING" },
  { value: "confirmed", label: "Confirmed", key: "CONFIRMED" },
  { value: "completed", label: "Completed", key: "COMPLETED" },
  { value: "cancelled", label: "Cancelled", key: "CANCELLED" },
];

export const DELIVERY_STATUSES = [
  { value: "pending", label: "Pending", key: "PENDING" },
  { value: "delivered", label: "Delivered", key: "DELIVERED" },
  {
    value: "out for delivery",
    label: "Out for Delivery",
    key: "OUT_FOR_DELIVERY",
  },
  { value: "delayed", label: "Delayed", key: "DELAYED" },
  { value: "failed", label: "Failed", key: "FAILED" },
];

export const GENDER_OPTIONS = [
  { value: "male", label: "Male", key: "MALE" },
  { value: "female", label: "Female", key: "FEMALE" },
];

export const PRODUCT_AVAILABILITIES = [
  { value: true, label: "In Stock", key: "IN_STOCK" },
  { value: false, label: "Out of Stock", key: "OUT_OF_STOCK" },
];
