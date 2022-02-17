import React, { ReactElement } from "react"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Heading,
  Icon,
  ListItem,
  OrderedList,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { Form, Field } from "react-final-form"

import ButtonAction from "@/components/ds/ButtonAction"
import InputGroup from "@/components/ds/InputGroup"
import { SinglePageLayout } from "@/components/ds/SinglePageLayout"
import type { CompaniesType, CompanyType } from "@/models/useSearch"
import { useSearch } from "@/models/useSearch"

import { HiOutlineLocationMarker, HiOutlineOfficeBuilding } from "react-icons/hi"
import { useConfig } from "@/models/useConfig"
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons"

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
    <Tag size="md" key="md" variant="subtle" colorScheme="cyan">
      <TagLeftIcon boxSize="18px" as={HiOutlineOfficeBuilding} />
      <TagLabel>UES</TagLabel>
    </Tag>
  )
}

function Company({ company }: { company: CompanyType }) {
  const { isOpen, onToggle } = useDisclosure()

  const years = Object.keys(company.notes)
    .map((elt) => Number(elt))
    .sort()
    .reverse()

  return (
    <Flex direction="column" mt={6}>
      <Flex>
        <Box as="header" w={"30%"} pr={4}>
          <Flex alignItems="flex-start" justifyContent="space-between">
            <Heading as="h2" size="md">
              {company.label}
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
        <Box as="section" textAlign="center" w="20%" borderLeft="1px solid gray" pr={2}>
          <Text fontSize="lg" fontWeight="bold">
            {company?.entreprise?.effectif?.tranche && workforceLabels[company?.entreprise?.effectif?.tranche][0]}
          </Text>
          <Text fontSize="lg">
            {company?.entreprise?.effectif?.tranche && workforceLabels[company?.entreprise?.effectif?.tranche][1]}
          </Text>
        </Box>
        {years.map((year) => (
          <Box key={year} w="15%" as="section" pr={2} textAlign="center" borderLeft="1px solid gray">
            <Text fontSize="lg" fontWeight="bold">
              {company.notes[year]}
            </Text>
            <Text fontSize="lg">{`Index ${year}`}</Text>
            <Text fontSize="xs">{`(données ${year - 1})`}</Text>
          </Box>
        ))}
      </Flex>
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
        colorScheme="yellow"
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
      <Box my={4}>10 sur {companies?.count} résultats</Box>
      {companies?.data?.map((company) => (
        <Company company={company} key={company.entreprise?.siren} />
      ))}
    </>
  )
}

export default function HomePage() {
  const [search, setSearch] = React.useState()
  const { companies, error } = useSearch(search)

  console.log("companies", companies)

  function handleSubmit({ search }: any) {
    setSearch(search)
  }
  return (
    <>
      <Form onSubmit={handleSubmit}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
            <Heading as="h1" size="md">
              Rechercher l'index de l'égalité professionnelle d'une entreprise de plus de 250 salariés
            </Heading>
            <Field name="search">
              {({ input }) => (
                <Box mt={4} maxW="container.md" mx="auto">
                  <InputGroup
                    {...input}
                    label=""
                    fieldName={input.name}
                    placeholder="Saisissez le nom ou le SIREN d'une entreprise"
                  />
                </Box>
              )}
            </Field>
            <ButtonAction mt={4} label="Rechercher" type="submit" />
          </form>
        )}
      </Form>

      <DisplayCompanies companies={companies} error={error} />
    </>
  )
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <SinglePageLayout>{page}</SinglePageLayout>
}
