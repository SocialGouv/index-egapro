import useSWRImmutable from "swr/immutable"

import type { FetcherReturnImmutable } from "@/utils/fetcher"
import { fetcher } from "@/utils/fetcher"
import React from "react"

export type ConfigTypeApi = {
  YEARS: number[]
  EFFECTIFS: Record<string, string>
  DEPARTEMENTS: Record<string, string>
  REGIONS: Record<string, string>
  REGIONS_TO_DEPARTEMENTS: Record<string, string[]>
  NAF: Record<string, string>
  SECTIONS_NAF: Record<string, string>
  READONLY: boolean
}

export type ConfigTypeFormatted = ConfigTypeApi & {
  DEPARTEMENTS_TRIES: [string, string][]
  REGIONS_TRIES: [string, string][]
  SECTIONS_NAF_TRIES: [string, string][]
}

type SelectItemsType = [string, string][]

/**
 * Return all departments found in config API endpoint, possibly filtered by region.
 *
 * @param config The config return by useConfig
 * @param region The region id
 */
export function filterDepartements(config: ConfigTypeFormatted | null, region?: string): SelectItemsType {
  if (!config) return []

  const { DEPARTEMENTS_TRIES, REGIONS_TO_DEPARTEMENTS } = config

  return !region
    ? DEPARTEMENTS_TRIES
    : // eslint-disable-next-line no-unused-vars
      DEPARTEMENTS_TRIES.filter(([key, _]) => REGIONS_TO_DEPARTEMENTS[region].includes(key))
}

export function useConfig(): FetcherReturnImmutable & { data: ConfigTypeFormatted | null } {
  const { data, error } = useSWRImmutable<ConfigTypeApi>("/config", fetcher)

  const isLoading = !data && !error
  const isError = Boolean(error)

  const { REGIONS, DEPARTEMENTS, SECTIONS_NAF }: Partial<ConfigTypeApi> = data || {}

  // Dénormalisation des données avec tri.
  const addon = {
    DEPARTEMENTS_TRIES: !DEPARTEMENTS ? [] : Object.entries(DEPARTEMENTS).sort((a, b) => a[1].localeCompare(b[1])),
    REGIONS_TRIES: !REGIONS ? [] : Object.entries(REGIONS).sort((a, b) => a[1].localeCompare(b[1])),
    SECTIONS_NAF_TRIES: !SECTIONS_NAF ? [] : Object.entries(SECTIONS_NAF).sort((a, b) => a[1].localeCompare(b[1])),
  }

  // We want to ensure that the data is always the same object on every render, once there is a value.
  const newData = React.useMemo(
    () => (!data ? null : { ...data, ...addon }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  )

  return {
    data: newData,
    error,
    isLoading,
    isError,
  }
}
