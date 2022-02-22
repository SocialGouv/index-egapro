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

export type SearchCompanyParams = {
  query?: string
  region?: string
  departement?: string
  naf?: string
}

function getKey(search?: SearchCompanyParams) {
  return function (pageIndex: number): ReturnType<SWRInfiniteKeyLoader> {
    if (!search) return null

    var searchParams = new URLSearchParams()

    if (search.query) searchParams.set("q", search.query)
    if (search.region) searchParams.set("region", search.region)
    if (search.departement) searchParams.set("departement", search.departement)
    if (search.naf) searchParams.set("section_naf", search.naf)
    if (pageIndex > 0) searchParams.set("offset", String(pageIndex * 10))

    return "/search?" + searchParams.toString()
  }
}

export function useSearch(search?: SearchCompanyParams): FetcherInfiniteReturn & { companies: CompaniesType } {
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
