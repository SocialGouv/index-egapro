import React, { ReactElement } from "react"
import { Box, Heading, Input } from "@chakra-ui/react"

import ButtonAction from "@/components/ds/ButtonAction"
import { SinglePageLayout } from "@/components/ds/SinglePageLayout"
import { useRouter } from "next/router"

export default function HomePage() {
  const router = useRouter()
  const formRef = React.useRef(null)

  function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    const data = new FormData(formRef.current || undefined)

    const { query } = Object.fromEntries(data)

    router.push("/recherche" + (query ? `?query=${query}` : ""))
  }

  return (
    <>
      <form onSubmit={handleSubmit} style={{ textAlign: "center" }} ref={formRef} noValidate>
        <Heading as="h1" size="md" mb="8">
          Rechercher l'index de l'égalité professionnelle d'une entreprise de plus de 250 salariés
        </Heading>
        <Box mt={4} maxW="container.md" mx="auto">
          <Input placeholder="Saisissez le nom ou le SIREN d'une entreprise" size="md" name="query" type="text" />
        </Box>
        <ButtonAction mt={4} label="Rechercher" type="submit" />
      </form>
    </>
  )
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <SinglePageLayout>{page}</SinglePageLayout>
}
