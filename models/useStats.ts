import { fetcher, FetcherReturn } from "@/utils/fetcher"
import { makeUrlSearchParam } from "@/utils/url"
import useSWR from "swr"

type StatsType = {
  avg: number
  count: number
  max: number
  min: number
}

export type StatsParams = {
  region?: string
  departement?: string
  naf?: string
  year?: string
}

export function useStats(params?: StatsParams): FetcherReturn & { stats: StatsType | null } {
  const searchParams = makeUrlSearchParam(params)
  const key = "/stats?" + searchParams.toString()

  const { data, error, mutate } = useSWR(key, fetcher)

  const isLoading = !data && !error
  const isError = Boolean(error)

  return {
    stats: data,
    error,
    isLoading,
    isError,
    mutate,
  }
}
