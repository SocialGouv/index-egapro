import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite"

import type { FetcherInfiniteReturn } from "@/utils/fetcher"
import { fetcher } from "@/utils/fetcher"
import { buildUrlParams } from "@/utils/url"

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
  notes_remunerations: Record<number, number>
  notes_augmentations: Record<number, number>
  notes_promotions: Record<number, number>
  notes_augmentations_et_promotions: Record<number, number> // Toujours utile?
  notes_conges_maternite: Record<number, number>
  notes_hautes_rémunérations: Record<number, number> // notes_hautes_r\u00e9mun\u00e9rations
  label: string
}

export type CompaniesType = {
  data: CompanyType[]
  count: number
}

export type SearchCompanyParams = {
  q?: string
  region?: string
  departement?: string
  section_naf?: string
}

function getKey(search?: SearchCompanyParams) {
  return function (pageIndex: number): ReturnType<SWRInfiniteKeyLoader> {
    if (!search) return null

    const searchParams = buildUrlParams(search)

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
