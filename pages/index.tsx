import React, { ReactElement } from "react"
import { Box, Center, Heading, Input, Text, useColorModeValue, VStack } from "@chakra-ui/react"
import { HiDownload } from "react-icons/hi"
import { useRouter } from "next/router"

import ButtonAction from "@/components/ds/ButtonAction"
import { SinglePageLayout } from "@/components/ds/SinglePageLayout"
import { LinkButton } from "@/components/ds/LinkButton"
import { useStats } from "@/models/useStats"

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
  const stats = useStats()
  const [dateCsv, setDateCsv] = React.useState("")

  React.useEffect(() => {
    async function runEffect() {
      setDateCsv(await getDateCsv())
    }
    runEffect()
  }, [])

  const getAverage = () => (!stats ? "" : stats.data?.avg?.toFixed(0))

  function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    const data = new FormData(formRef.current || undefined)

    const { query } = Object.fromEntries(data)

    router.push("/recherche" + (query ? `?query=${query}` : ""))
  }

  return (
    <VStack spacing={16}>
      <form onSubmit={handleSubmit} style={{ textAlign: "center" }} ref={formRef} noValidate>
        <Heading as="h1" size="md" mb="8">
          Rechercher l'index de l'égalité professionnelle d'une entreprise de plus de 250 salariés
        </Heading>
        <Box mt={4} maxW="container.md" mx="auto">
          <Input placeholder="Saisissez le nom ou le SIREN d'une entreprise" size="md" name="query" type="text" />
        </Box>
        <ButtonAction mt={4} label="Rechercher" type="submit" />
      </form>

      <Center bgColor={bgColor} w="100vw" py={16}>
        <Box textAlign="center">
          <Text fontFamily="cabin" fontSize="6xl">
            {getAverage()}
          </Text>
          <Text fontFamily="cabin" fontSize="2xl" fontWeight="bold" casing="capitalize">
            Index moyen 2021
          </Text>
          <ButtonAction mt={8} label="Voir les entreprises" type="submit" onClick={() => router.push("/recherche")} />
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
