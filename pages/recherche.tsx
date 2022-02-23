import React, { ReactElement } from "react"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  ListItem,
  OrderedList,
  Select,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons"
import { HiOutlineLocationMarker, HiOutlineOfficeBuilding } from "react-icons/hi"

import ButtonAction from "@/components/ds/ButtonAction"
import { SinglePageLayout } from "@/components/ds/SinglePageLayout"
import type { CompaniesType, CompanyType, SearchCompanyParams } from "@/models/useSearch"
import { useSearch } from "@/models/useSearch"
import { filterDepartements, useConfig } from "@/models/useConfig"
import { capitalize } from "@/utils/string"

function useAdressLabel({ departement, region }: { departement?: string; region?: string }) {
  const { data } = useConfig()

  if (!data) return ""

  const { DEPARTEMENTS, REGIONS } = data

  let result = ""
  if (departement) {
    result = DEPARTEMENTS[departement]
  }
  if (region) {
    result += ", " + REGIONS[region]
  }
  return result
}
const workforceLabels: Record<string, string[]> = {
  "50:250": ["50 à 250", "salariés"],
  "251:999": ["251 à 999", "salariés"],
  "1000:": ["1000", "salariés ou plus"],
}

function UES() {
  return (
    <Tooltip label="Unité Économique et Sociale" aria-label="Unité Économique et Sociale">
      <Tag size="md" key="md" variant="subtle" colorScheme="cyan">
        <TagLeftIcon boxSize="18px" as={HiOutlineOfficeBuilding} />
        <TagLabel>UES</TagLabel>
      </Tag>
    </Tooltip>
  )
}

function Company({ company }: { company: CompanyType }) {
  const { isOpen, onToggle } = useDisclosure()
  const [yearSelected, setYearSelected] = React.useState<number>()
  const highlightColor = useColorModeValue("blue.100", "blue.800")
  const linkColor = useColorModeValue("primary.600", "primary.100")

  const years = Object.keys(company.notes)
    .map((elt) => Number(elt))
    .sort()
    .reverse()

  function selectOrToggle(year: number) {
    if (yearSelected === year) {
      setYearSelected(undefined)
    } else {
      setYearSelected(year)
    }
  }

  return (
    <Flex direction="column" mt={6}>
      <Flex>
        <Box as="header" w="30%" pr={4}>
          <Flex alignItems="flex-start" justifyContent="space-between">
            <Heading as="h2" size="md">
              {company.entreprise.ues?.nom || company.label}
            </Heading>
            {company.entreprise.ues && (
              <Box ml={2}>
                <UES />
              </Box>
            )}
          </Flex>
          <Box mt={3}>{company.entreprise.siren}</Box>
          <Flex my={2} alignItems="center" justifyContent="start">
            <Icon as={HiOutlineLocationMarker} mr={2} />
            {useAdressLabel({ departement: company.entreprise.département, region: company.entreprise.région })}
          </Flex>
        </Box>
        <Flex
          as="section"
          textAlign="center"
          w="20%"
          borderLeft="1px solid gray"
          pr={2}
          align="center"
          justify="center"
        >
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              {company?.entreprise?.effectif?.tranche && workforceLabels[company?.entreprise?.effectif?.tranche][0]}
            </Text>
            <Text fontSize="lg">
              {company?.entreprise?.effectif?.tranche && workforceLabels[company?.entreprise?.effectif?.tranche][1]}
            </Text>
          </Box>
        </Flex>
        {years.map((year) => (
          <Flex
            key={year}
            w="15%"
            as="section"
            pr={2}
            textAlign="center"
            borderLeft="1px solid gray"
            onClick={() => selectOrToggle(year)}
            bgColor={yearSelected === year ? highlightColor : "transparent"}
            borderTop={yearSelected === year ? "1px solid gray" : "1px solid transparent"}
            borderRight={yearSelected === year ? "1px solid gray" : "1px solid transparent"}
            marginRight="-1px"
            zIndex="20"
            justify="center"
            align="center"
          >
            <Box>
              <Text fontSize="lg" fontWeight="bold">
                {company.notes[year] === null ? (
                  <Tooltip label="Index non calculable" aria-label="Index non calculable">
                    NC
                  </Tooltip>
                ) : (
                  company.notes[year]
                )}
              </Text>
              <Text fontSize="lg">{`Index ${year + 1}`}</Text>
              <Text fontSize="xs">{`(données ${year})`}</Text>
              <Text fontSize="xs" textDecoration="underline" color={linkColor}>
                Voir le détail
              </Text>
            </Box>
          </Flex>
        ))}
      </Flex>
      {yearSelected && (
        <Flex marginTop="-1px" zIndex="10">
          <Box w="30%" pr={4}></Box>

          <Flex
            px="2"
            bgColor={highlightColor}
            p={2}
            textAlign="center"
            borderTop="1px solid gray"
            justify="center"
            align="center"
            w="14%"
          >
            <Box>
              <Text fontSize="sm">Écart rémunérations</Text>
              <Text fontSize="md" fontWeight="bold">
                {company.notes_remunerations[yearSelected] ?? "NC"}
              </Text>
            </Box>
          </Flex>
          <Flex
            borderLeft="1px solid gray"
            px="2"
            bgColor={highlightColor}
            p={2}
            textAlign="center"
            borderTop="1px solid gray"
            justify="center"
            align="center"
            w="14%"
          >
            <Box>
              <Text fontSize="sm">Écart taux d'augmentation</Text>
              <Text fontSize="md" fontWeight="bold">
                {company.notes_augmentations[yearSelected] ?? "NC"}
              </Text>
            </Box>
          </Flex>
          <Flex
            borderLeft="1px solid gray"
            px="2"
            bgColor={highlightColor}
            p={2}
            textAlign="center"
            borderTop="1px solid gray"
            justify="center"
            align="center"
            w="14%"
          >
            <Box>
              <Text fontSize="sm">Écart taux promotion</Text>
              <Text fontSize="md" fontWeight="bold">
                {company.notes_promotions[yearSelected] ?? "NC"}
              </Text>
            </Box>
          </Flex>
          <Flex
            borderLeft="1px solid gray"
            px="2"
            bgColor={highlightColor}
            p={2}
            textAlign="center"
            borderTop="1px solid gray"
            justify="center"
            align="center"
            w="14%"
          >
            <Box>
              <Text fontSize="sm">Retour congé maternité</Text>
              <Text fontSize="md" fontWeight="bold">
                {company.notes_conges_maternite[yearSelected] ?? "NC"}
              </Text>
            </Box>
          </Flex>
          <Flex
            borderLeft="1px solid gray"
            px="2"
            bgColor={highlightColor}
            p={2}
            textAlign="center"
            borderTop="1px solid gray"
            justify="center"
            align="center"
            w="14%"
          >
            <Box>
              <Text fontSize="sm">Hautes rémunérations</Text>
              <Text fontSize="md" fontWeight="bold">
                {company.notes_hautes_rémunérations[yearSelected] ?? "NC"}
              </Text>
            </Box>
          </Flex>
        </Flex>
      )}
      {company.entreprise.ues && (
        <Box onClick={onToggle}>
          {isOpen ? <Icon as={ChevronDownIcon} /> : <Icon as={ChevronRightIcon} />}
          <Text as="span" decoration="underline" ml="1">
            Voir les entreprises composant l'UES
          </Text>
          {isOpen && (
            <OrderedList mt={1}>
              {company.entreprise.ues.entreprises?.map((element) => (
                <ListItem key={element.siren} fontSize="sm" ml={4}>
                  {element.raison_sociale + " (" + element.siren + ")"}
                </ListItem>
              ))}
            </OrderedList>
          )}
        </Box>
      )}
    </Flex>
  )
}

function DisplayCompanies({ companies, error }: { companies: CompaniesType; error: any }) {
  if (error) {
    return (
      <Alert status="error" mt={4}>
        <AlertIcon />
        Il y a eu une erreur lors de la recherche.
      </Alert>
    )
  }

  if (!companies) {
    return null
  }

  if (companies?.count === 0) {
    return (
      <Alert
        status="info"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
        mt={4}
        colorScheme="cyan"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Aucune entreprise trouvée
        </AlertTitle>
        <AlertDescription maxWidth="sm">Veuillez modifier vos paramètres de recherche.</AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      {!companies?.count ? null : (
        <Box my={4}>
          {companies?.data?.length} {companies?.count > 10 ? `sur ${companies?.count}` : ""} résultat
          {companies?.count > 1 ? "s" : ""}
        </Box>
      )}
      {companies?.data?.map((company) => (
        <Company company={company} key={company.entreprise?.siren} />
      ))}
    </>
  )
}

/**
 * Inputs in URLSearchParams can be string or array of string. We need to have a consistent type as a string.
 */
function normalizeInputs(parsedUrlQuery: ParsedUrlQuery) {
  const { query, region, departement, naf } = parsedUrlQuery

  return {
    ...(query && { query: Array.isArray(query) ? query[0] : query }),
    ...(region && { region: Array.isArray(region) ? region[0] : region }),
    ...(departement && { departement: Array.isArray(departement) ? departement[0] : departement }),
    ...(naf && { naf: Array.isArray(naf) ? naf[0] : naf }),
  }
}

export default function HomePage() {
  const { data: config } = useConfig()
  const { REGIONS_TRIES = [], SECTIONS_NAF_TRIES = [] } = config ?? {}

  const router = useRouter()
  const inputs = normalizeInputs(router.query)
  const [departements, setDepartements] = React.useState<ReturnType<typeof filterDepartements>>([])
  const [search, setSearch] = React.useState<SearchCompanyParams>(inputs)

  // We destructure so we can benefit to have the same reference for all strings properties event if the inputs object change over time.
  const { query, region, departement, naf } = inputs

  React.useEffect(() => {
    setSearch({ query, region, departement, naf })
    setDepartements(filterDepartements(config, region))
    // we don't need config to run the useEffect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, region, departement, naf])

  const { companies, error, size, setSize } = useSearch(inputs)

  function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault()

    router.replace({ pathname: "/recherche", query: search })
  }

  function reset() {
    setSearch({})
  }

  function handleChange(event: React.SyntheticEvent) {
    const { name, value } = event.currentTarget as HTMLInputElement

    let departement = getValue("departement")

    if (name === "region") {
      setDepartements(filterDepartements(config, value))
      departement = ""
    }
    setSearch({ ...search, departement, [name]: value })
  }

  const getValue = (name: keyof SearchCompanyParams) => search[name] || ""

  return (
    <>
      <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
        <Heading as="h1" size="md" mb="8">
          Rechercher l'index de l'égalité professionnelle d'une entreprise de plus de 250 salariés
        </Heading>
        <Box mt={4} maxW="container.md" mx="auto">
          <Input
            placeholder="Saisissez le nom ou le SIREN d'une entreprise"
            size="md"
            name="query"
            type="text"
            onChange={handleChange}
            value={getValue("query")}
          />
          <HStack mt="2">
            <Text fontSize="sm" mx="3">
              Filtres
            </Text>
            <Select placeholder="Région" size="sm" name="region" onChange={handleChange} value={getValue("region")}>
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
            >
              {SECTIONS_NAF_TRIES.map(([key, value]) => (
                <option key={key} value={key}>
                  {capitalize(value)}
                </option>
              ))}
            </Select>
          </HStack>
        </Box>
        <ButtonAction mt={4} label="Rechercher" type="submit" />
        <ButtonAction mt={4} label="Réinitialiser" variant="ghost" onClick={reset} ml="2" />
      </form>

      <DisplayCompanies companies={companies} error={error} />

      {companies?.data?.length < companies?.count && (
        <Box textAlign="center" mt="8">
          <ButtonAction variant="outline" label="Voir les résultats suivants" onClick={() => setSize(size + 1)} />
        </Box>
      )}
    </>
  )
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <SinglePageLayout>{page}</SinglePageLayout>
}
