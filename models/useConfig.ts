import useSWRImmutable from "swr/immutable"

import type { FetcherReturnImmutable } from "@/utils/fetcher"
import { fetcher } from "@/utils/fetcher"

export type ConfigType = {
  YEARS: number[]
  EFFECTIFS: Record<string, string>
  DEPARTEMENTS: Record<string, string>
  REGIONS: Record<string, string>
  REGIONS_TO_DEPARTEMENTS: Record<string, string[]>
  NAF: Record<string, string>
  SECTIONS_NAF: Record<string, string>
  READONLY: boolean
}

export function useConfig(): FetcherReturnImmutable & { data?: ConfigType } {
  const { data, error } = useSWRImmutable<ConfigType>("/config", fetcher)

  const isLoading = !data && !error
  const isError = Boolean(error)

  return {
    data,
    error,
    isLoading,
    isError,
  }
}
