"use client";

import { getData } from "@/lib/api/get";
import { createData } from "@/lib/api/create";
import { updateData } from "@/lib/api/update";
import { deleteData } from "@/lib/api/delete";
import { uploadMedia } from "@/lib/api/upload";
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

export function useListQuery(
  key,
  url,
  params = {},
  requiresAdmin,
  queryOptions = {}
) {
  return useQuery({
    retry: false,
    queryKey: [key, params],
    queryFn: async () => await getData(url, params, requiresAdmin),
    meta: {
      errorMessage: `Failed to fetch ${key}`,
    },
    select: (data) => ({
      [key]: data.data,
      pagination: data.pagination,
    }),
    ...queryOptions,
  });
}

export function useInfiniteListQuery(
  key,
  url,
  params = {},
  requiresAdmin,
  queryOptions = {}
) {
  return useInfiniteQuery({
    queryKey: [key, params],
    queryFn: async ({ pageParam = 1 }) =>
      await getData(url, { ...params, page: pageParam }, requiresAdmin),
    meta: {
      errorMessage: `Failed to fetch ${key}`,
    },
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,
    select: (data) => {
      const allItems = data.pages.flatMap((page) => page.data || []);
      const lastPage = data.pages[data.pages.length - 1];
      return {
        [key]: allItems,
        pagination: lastPage?.pagination || {},
      };
    },
    ...queryOptions,
  });
}

export function useDetailsQuery(
  key = "",
  url = "",
  params = {},
  requiresAdmin,
  queryOptions = {}
) {
  return useQuery({
    queryKey: [`${key}Details`, params[`${key}Id`]],
    queryFn: async () => await getData(url, { ...params }, requiresAdmin),
    meta: {
      errorMessage: `Failed to fetch ${key}`,
    },
    select: (data) => ({
      details: data.data,
    }),
    ...queryOptions,
  });
}

// ------------------ Mutations ------------------

export function useCreateMutation(key, url, params, mutationOptions = {}) {
  return useMutation({
    mutationKey: [`create${key}`],
    mutationFn: async ({ values }) =>
      await createData(url, values, { ...params }, true),
    onSuccess: () => {
      toast.success(`${key} created successfully`);
      invalidate(`${key}s`);
    },
    onError: (error) => {
      toast.error(error?.message || `Failed to create ${key}`);
    },
    ...mutationOptions,
  });
}

export function useUpdateMutation(key, url, params = {}, mutationOptions = {}) {
  return useMutation({
    mutationKey: [`update${key}`],
    mutationFn: async ({ id, values }) =>
      await updateData(`${url}/${id}`, { id, ...params }, values, true),
    onSuccess: (_, { id, values }) => {
      toast.success(`${key} updated successfully`);
      invalidate(`${key}s`);

      queryClient.setQueryData([`${key}Details`, id], (oldData) => ({
        ...oldData,
        data: {
          ...oldData?.data,
          ...values,
        },
      }));
    },
    onError: (error) => {
      toast.error(error?.message || `Failed to update ${key}`);
    },
    ...mutationOptions,
  });
}

export function useDeleteMutation(key = "", mutationOptions = {}) {
  return useMutation({
    mutationKey: [`delete${key}`],
    mutationFn: async (deleteId) =>
      await deleteData(`${key}s/${deleteId}`, { id: deleteId }),
    onSuccess: () => {
      toast.success(`${key} deleted successfully`);
      invalidate(`${key}s`);
    },
    onError: (error) => {
      toast.error(error?.message || `Failed to delete ${key}`);
    },
    ...mutationOptions,
  });
}

export function useUploadMutation(mutationOptions) {
  return useMutation({
    mutationKey: [`upload`],
    mutationFn: async (media) => await uploadMedia(media, null, true),
    onError: (error) => {
      toast.error(error?.message || `Upload Failed`);
    },
    ...mutationOptions,
  });
}
