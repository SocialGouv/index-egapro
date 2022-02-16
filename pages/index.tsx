import React, { ReactElement } from "react"
import { Alert, AlertIcon, Box, Heading } from "@chakra-ui/react"
import { Form, Field } from "react-final-form"

import ButtonAction from "@/components/ds/ButtonAction"
import InputGroup from "@/components/ds/InputGroup"
import { SinglePageLayout } from "@/components/ds/SinglePageLayout"
import { useSearch } from "@/hooks/useSearch"

type CompanyType = {
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

type CompaniesType = {
  data: CompanyType[]
  count: number
}

function Company({ company }: { company: CompanyType }) {
  return (
    <Box p={4}>
      <Heading>{company.entreprise?.raison_sociale}</Heading>
      <Box>{company.entreprise?.siren}</Box>
      <Box>{company.entreprise?.région}</Box>
      <Box>{company.entreprise?.département}</Box>
      <Box>{company.entreprise?.code_naf}</Box>
      <Box>{company.entreprise?.effectif.tranche}</Box>
      <Box>{Object.keys(company.notes)?.length}</Box>
    </Box>
  )
}

function DisplayCompanies({ companies, error }: { companies: CompaniesType; error: any }) {
  if (error)
    return (
      <Alert status="error" mt={4}>
        <AlertIcon />
        Il y a eu une erreur lors de la recherche.
      </Alert>
    )

  return (
    <>
      <Box>{companies?.count} résultats</Box>
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
        {({ handleSubmit, pristine, invalid }) => (
          <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
            <Heading as="h1" size="md">
              Rechercher l'index de l'égalité professionnelle d'une entreprise de plus de 250 salariés
            </Heading>
            <Field name="search">
              {({ input }) => (
                <Box mt={4}>
                  <InputGroup
                    {...input}
                    label=""
                    fieldName={input.name}
                    placeholder="Saisissez le nom ou le SIREN d'une entreprise"
                  />
                </Box>
              )}
            </Field>
            <ButtonAction mt={4} label="Rechercher" type="submit" disabled={pristine || invalid} />
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
