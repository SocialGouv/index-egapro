import useSWR from "swr"

import type { FetcherReturn } from "@/utils/fetcher"
import { fetcher } from "@/utils/fetcher"

export type CompanyType = {
  entreprise: {
    raison_sociale: string
    siren: string
    région: string
    département: string
    code_naf: string
    ues: { nom: string; entreprises: { raison_sociale: string; siren: string }[] }
    effectif: { tranche: string }
  }
  notes: Record<number, number>
  label: string
}

export type CompaniesType = {
  data: CompanyType[]
  count: number
}

export function useSearch(search?: string): FetcherReturn & { companies: CompaniesType } {
  const { data, error, mutate } = useSWR(search ? `/search?q=${search}` : null, fetcher)

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
