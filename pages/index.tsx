import React, { ReactElement } from "react"
import {
  Box,
  Center,
  Heading,
  HStack,
  Input,
  Select,
  Spinner,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { HiDownload } from "react-icons/hi"
import { useRouter } from "next/router"
import Head from "next/head"

import ButtonAction from "@/components/ds/ButtonAction"
import { SinglePageLayout } from "@/components/ds/SinglePageLayout"
import { LinkButton } from "@/components/ds/LinkButton"
import { makeUrlSearchParam, StatsParams, useStats } from "@/models/useStats"
import { filterDepartements, useConfig } from "@/models/useConfig"
import { capitalize } from "@/utils/string"

async function getDateCsv(): Promise<string> {
  try {
    const responseCsv = await fetch("/index-egalite-fh.csv", { method: "HEAD" })
    const date = responseCsv?.headers?.get("last-modified")

    if (date) {
      const lastModified = new Date(date)
      return `${lastModified.getDate()}/${lastModified.getMonth() + 1}/${lastModified.getFullYear()}`
    }
  } catch (error) {
    console.error("Error on fetch HEAD /index-egalite-fh.csv", error)
  }
  return ""
}

export default function HomePage() {
  const router = useRouter()
  const formRef = React.useRef(null)
  const bgColor = useColorModeValue("blue.100", "blue.800")

  const { config } = useConfig()
  const [dateCsv, setDateCsv] = React.useState("")
  const { REGIONS_TRIES = [], SECTIONS_NAF_TRIES = [], PUBLIC_YEARS_TRIES = [], LAST_PUBLIC_YEAR = "" } = config ?? {}
  const [filters, setFilters] = React.useState<StatsParams>({})
  const [departements, setDepartements] = React.useState<ReturnType<typeof filterDepartements>>([])
  const { stats, isLoading } = useStats(filters)

  const urlSearchParams = makeUrlSearchParam(filters)

  React.useEffect(() => {
    setFilters({ year: LAST_PUBLIC_YEAR })
  }, [LAST_PUBLIC_YEAR])

  React.useEffect(() => {
    // inital load of departments.
    setDepartements(filterDepartements(config))
  }, [config]) // config change only at start.

  React.useEffect(() => {
    async function runEffect() {
      setDateCsv(await getDateCsv())
    }
    runEffect()
  }, [])

  const getAverage = () => (!stats ? "" : stats?.avg?.toFixed(0))

  function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    const data = new FormData(formRef.current || undefined)

    const { query } = Object.fromEntries(data)

    router.push("/recherche" + (query ? `?query=${query}` : ""))
  }

  function handleChange(event: React.SyntheticEvent) {
    const { name, value } = event.currentTarget as HTMLInputElement

    let departement = getValue("departement")

    if (name === "region") {
      setDepartements(filterDepartements(config, value))
      departement = ""
    }
    setFilters({ ...filters, departement, [name]: value })
  }

  const getValue = (name: keyof StatsParams) => filters[name] || ""

  return (
    <VStack spacing={8}>
      <Head>
        <title>Index Egapro</title>
      </Head>
      <form onSubmit={handleSubmit} style={{ textAlign: "center" }} ref={formRef} noValidate>
        <Heading as="h1" size="md" mb="8" mt="16">
          Rechercher l'index de l'égalité professionnelle d'une entreprise de plus de 250 salariés
        </Heading>
        <Box mt={4} maxW="container.md" mx="auto">
          <Input placeholder="Saisissez le nom ou le SIREN d'une entreprise" size="lg" name="query" type="text" />
        </Box>
        <ButtonAction mt={8} label="Rechercher" type="submit" />
      </form>

      <Center bgColor={bgColor} w="100vw" py={16}>
        <Box textAlign="center">
          <Text fontFamily="cabin" fontSize="6xl" height="90px">
            {isLoading ? (
              <Spinner />
            ) : (
              getAverage() || (
                <Box as="abbr">
                  <Tooltip label="Il n'y pas assez de données pour les critères demandés">
                    <Text>NC</Text>
                  </Tooltip>
                </Box>
              )
            )}
          </Text>
          <Text fontFamily="cabin" fontSize="2xl" fontWeight="bold" casing="capitalize">
            Index moyen {config?.LAST_PUBLIC_YEAR}
          </Text>

          <HStack mt={8} px={32}>
            <Select
              placeholder="Année"
              size="sm"
              name="year"
              onChange={handleChange}
              value={getValue("year")}
              aria-label="filtre sur l'année"
            >
              {PUBLIC_YEARS_TRIES.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
            </Select>
            <Select
              placeholder="Région"
              size="sm"
              name="region"
              onChange={handleChange}
              value={getValue("region")}
              aria-label="filtre sur la région"
            >
              {REGIONS_TRIES.map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Select>
            <Select
              placeholder="Département"
              size="sm"
              name="departement"
              onChange={handleChange}
              value={getValue("departement")}
              aria-label="filtre sur le département"
            >
              {departements.map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Select>
            <Select
              placeholder="Secteur d'activité"
              size="sm"
              name="naf"
              onChange={handleChange}
              value={getValue("naf")}
              aria-label="filtre sur le secteur d'activité"
            >
              {SECTIONS_NAF_TRIES.map(([key, value]) => (
                <option key={key} value={key}>
                  {capitalize(value)}
                </option>
              ))}
            </Select>
          </HStack>

          <ButtonAction
            mt={8}
            label="Voir les entreprises"
            type="submit"
            onClick={() => router.push(`/recherche${urlSearchParams ? `?${urlSearchParams}` : ""}`)}
          />
        </Box>
      </Center>
      {dateCsv && (
        <Center>
          <Box textAlign="center" py={8}>
            <Text fontSize="lg">Vous souhaitez consulter les données de toutes les entreprises ?</Text>
            <Text fontSize="lg">
              Téléchargez le fichier recensant toutes les notes de l’Index pour les entreprises de plus de 250 salariés
              au {dateCsv} au format tableur (.csv) :
            </Text>

            <LinkButton leftIcon={<HiDownload />} href="/index-egalite-fh.csv">
              Télécharger
            </LinkButton>
          </Box>
        </Center>
      )}
    </VStack>
  )
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <SinglePageLayout>{page}</SinglePageLayout>
}
