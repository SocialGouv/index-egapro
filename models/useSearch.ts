import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite"

import type { FetcherInfiniteReturn } from "@/utils/fetcher"
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

function getKey(search?: string) {
  return function (pageIndex: number): ReturnType<SWRInfiniteKeyLoader> {
    if (!search) return null
    return `/search?q=${search}&offset=${pageIndex * 10}`
  }
}

export function useSearch(search?: string): FetcherInfiniteReturn & { companies: CompaniesType } {
  const { data: companies, error, size, setSize } = useSWRInfinite(getKey(search), fetcher)

  const isLoading = !companies && !error
  const isError = Boolean(error)

  let newData: CompanyType[] = []

  if (companies && companies.length > 0) {
    for (const company of companies) {
      newData = [...newData, ...company.data]
    }
  }

  const flattenCompanies = {
    count: companies?.[0].count,
    data: newData,
  }

  return {
    companies: flattenCompanies,
    error,
    isLoading,
    isError,
    size,
    setSize,
  }
}
