import React, { ReactElement } from "react"
import { Box, Center, Heading, Input, Text, VStack } from "@chakra-ui/react"
import { HiDownload } from "react-icons/hi"
import { useRouter } from "next/router"
import Head from "next/head"

import ButtonAction from "@/components/ds/ButtonAction"
import { SinglePageLayout } from "@/components/ds/SinglePageLayout"
import { LinkButton } from "@/components/ds/LinkButton"
import { AverageIndicator } from "@/components/AverageIndicator"

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

function FormSearchSiren() {
  const router = useRouter()
  const formRef = React.useRef(null)

  function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    const data = new FormData(formRef.current || undefined)

    const { query } = Object.fromEntries(data)

    router.push("/recherche" + (query ? `?query=${query}` : ""))
  }

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: "center" }} ref={formRef} noValidate>
      <Heading as="h1" size="md" mb="8" mt={["0", "16"]}>
        Rechercher l'index de l'égalité professionnelle d'une entreprise de plus de 250 salariés
      </Heading>
      <Box mt={4} maxW="container.md" mx="auto">
        <Input placeholder="Saisissez le nom ou le SIREN d'une entreprise" size="lg" name="query" type="text" />
      </Box>
      <ButtonAction mt={8} label="Rechercher" type="submit" />
    </form>
  )
}

function DownloadCsvFileZone() {
  const [dateCsv, setDateCsv] = React.useState("")

  React.useEffect(() => {
    async function runEffect() {
      setDateCsv(await getDateCsv())
    }
    runEffect()
  }, [])

  return (
    <>
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
    </>
  )
}

export default function HomePage() {
  return (
    <VStack spacing={8}>
      <Head>
        <title>Index Egapro</title>
      </Head>

      <FormSearchSiren />

      <AverageIndicator />

      <DownloadCsvFileZone />
    </VStack>
  )
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <SinglePageLayout>{page}</SinglePageLayout>
}
