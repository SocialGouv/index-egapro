import useSWR from "swr"

import type { FetcherReturn } from "@/utils/fetcher"
import { fetcher } from "@/utils/fetcher"

export function useSearch(search?: string): FetcherReturn & { companies: any } {
  const { data, error, mutate } = useSWR(`/search?q=${search}`, fetcher)

  const isLoading = !data && !error
  const isError = Boolean(error)

  return {
    companies: data,
    error,
    isLoading,
    isError,
    mutate,
  }
}
