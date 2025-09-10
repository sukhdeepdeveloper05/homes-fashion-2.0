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

export function invalidate(key) {
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
    queryFn: async () => await getData(url, params, requiresAuth),
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
    queryFn: async ({ pageParam = 1 }) =>
      await getData(url, { ...params, page: pageParam }, requiresAuth),
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
      await getData(`${url}/${params.id}`, params, requiresAuth),
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
}) {
  return useMutation({
    mutationKey: [`create${handle}`],
    mutationFn: async ({ values }) =>
      await createData(url, values, { ...params }, true),
    onSuccess: () => {
      toast.success(`${handle} created successfully`);
      invalidate(`${handle}s`);
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
}) {
  return useMutation({
    mutationKey: [`update${handle}`],
    mutationFn: async ({ id, values }) =>
      await updateData(`${url}/${id}`, { id, ...params }, values, true),
    onSuccess: (_, { id, values }) => {
      toast.success(`${handle} updated successfully`);
      invalidate(`${handle}s`);

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
    mutationFn: async (id) => await deleteData(`${url}/${id}`, { id }, true),
    onSuccess: () => {
      toast.success(`${handle} deleted successfully`);
      invalidate(`${handle}s`);
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
    mutationFn: async (media) => await uploadMedia(media, null, true),
    onError: (error) => {
      toast.error(error?.message || `Upload Failed`);
    },
    ...mutationOptions,
  });
}

export function useLoginMutation({ mutationOptions = {} } = {}) {
  return useMutation({
    mutationKey: [`login`],
    mutationFn: async (data) => await createData("/auth/login", data),
    onError: (error) => {
      toast.error(error?.message || `Login Failed`);
    },
    ...mutationOptions,
  });
}
