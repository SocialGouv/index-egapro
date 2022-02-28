import { fetcher, FetcherReturn } from "@/utils/fetcher"
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
  var searchParams = new URLSearchParams()

  if (params) {
    if (params.year) searchParams.set("year", params.year)
    if (params.region) searchParams.set("region", params.region)
    if (params.departement) searchParams.set("departement", params.departement)
    if (params.naf) searchParams.set("section_naf", params.naf)
  }

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
