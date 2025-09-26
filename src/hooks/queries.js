"use client";

import {
  getData,
  createData,
  updateData,
  deleteData,
  uploadMedia,
} from "@/lib/api";
import { queryClient } from "@/services/Providers";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// ------------------ Helpers ------------------

export function invalidateQueries(key) {
  queryClient.invalidateQueries({
    predicate: (query) => query.queryKey.includes(key),
  });
}

// ------------------ Queries ------------------

export function useListQuery({
  handle,
  queryKey = [handle],
  url,
  params = {},
  requiresAuth = false,
  queryOptions = {},
}) {
  return useQuery({
    queryKey,
    queryFn: async () => await getData({ url, params, requiresAuth }),
    meta: {
      errorMessage: `Failed to fetch ${handle}`,
    },
    select: (data) => ({
      [handle]: data.data,
      pagination: data.pagination,
    }),
    ...queryOptions,
  });
}

export function useInfiniteListQuery({
  handle,
  queryKey = [handle],
  url,
  params = {},
  requiresAuth = false,
  queryOptions = {},
}) {
  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = params?.page || 1 }) =>
      await getData({
        url,
        params: { ...params, page: pageParam },
        requiresAuth,
      }),
    meta: {
      errorMessage: `Failed to fetch ${handle}`,
    },
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,
    select: (data) => {
      const allItems = data.pages.flatMap((page) => page.data || []);
      const lastPage = data.pages[data.pages.length - 1];
      return {
        [handle]: allItems,
        pagination: lastPage?.pagination || {},
      };
    },
    ...queryOptions,
  });
}

export function useDetailsQuery({
  handle,
  queryKey = [handle],
  url,
  params = {},
  requiresAuth = false,
  queryOptions = {},
}) {
  return useQuery({
    queryKey,
    queryFn: async () =>
      await getData({ url: `${url}/${params.id}`, params, requiresAuth }),
    meta: {
      errorMessage: `Failed to fetch ${handle}`,
    },
    select: (data) => ({
      details: data.data,
    }),
    ...queryOptions,
  });
}

// ------------------ Mutations ------------------

export function useCreateMutation({
  handle,
  url,
  params = {},
  mutationOptions = {},
  hasBinary = false,
}) {
  return useMutation({
    mutationKey: [`create${handle}`],
    mutationFn: async ({ values }) =>
      await createData({ url, data: values, params, hasBinary }),
    onSuccess: () => {
      toast.success(`${handle} created successfully`);
      invalidateQueries(`${handle}s`);
    },
    onError: (error) => {
      toast.error(error?.message || `Failed to create ${handle}`);
    },
    ...mutationOptions,
  });
}

export function useUpdateMutation({
  handle,
  url,
  params = {},
  mutationOptions = {},
  invalidate = true,
  hasBinary = false,
}) {
  return useMutation({
    mutationKey: [`update${handle}`],
    mutationFn: async ({ id, values }) =>
      await updateData({
        url: `${url}${id ? `/${id}` : ""}`,
        params: { id, ...params },
        data: values,
        hasBinary,
      }),
    onSuccess: (_, { id, values }) => {
      toast.success(`${handle} updated successfully`);
      invalidate && invalidateQueries(`${handle}s`);

      queryClient.setQueryData([`${handle}Details`, id], (oldData) => ({
        ...oldData,
        data: {
          ...oldData?.data,
          ...values,
        },
      }));
    },
    onError: (error) => {
      toast.error(error?.message || `Failed to update ${handle}`);
    },
    ...mutationOptions,
  });
}

export function useDeleteMutation({ handle, url, mutationOptions = {} }) {
  return useMutation({
    mutationKey: [`delete${handle}`],
    mutationFn: async ({id, body, ...params}) =>
      await deleteData({
        url: id ? `${url}/${id}` : url,
        params: { id, ...params },
        data: body,
        requiresAuth: true,
      }),
    onSuccess: () => {
      toast.success(`${handle} deleted successfully`);
      invalidateQueries(`${handle}s`);
    },
    onError: (error) => {
      toast.error(error?.message || `Failed to delete ${handle}`);
    },
    ...mutationOptions,
  });
}

export function useUploadMutation({ mutationOptions = {} } = {}) {
  return useMutation({
    mutationKey: [`upload`],
    mutationFn: async (media) =>
      await uploadMedia({ media, requiresAuth: true }),
    onError: (error) => {
      toast.error(error?.message || `Upload Failed`);
    },
    ...mutationOptions,
  });
}

export function useLoginMutation({ mutationOptions = {} } = {}) {
  return useMutation({
    mutationKey: [`login`],
    mutationFn: async (data) => await createData({ url: "/auth/login", data }),
    onError: (error) => {
      toast.error(error?.message || `Login Failed`);
    },
    ...mutationOptions,
  });
}
