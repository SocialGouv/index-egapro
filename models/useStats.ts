import { fetcher, FetcherReturn } from "@/utils/fetcher"
import useSWR from "swr"

type StatsType = {
  avg: number
  count: number
  max: number
  min: number
}

export function useStats(): FetcherReturn & { data: StatsType | null } {
  const { data, error, mutate } = useSWR("/stats", fetcher)

  const isLoading = !data && !error
  const isError = Boolean(error)

  return {
    data,
    error,
    isLoading,
    isError,
    mutate,
  }
}
