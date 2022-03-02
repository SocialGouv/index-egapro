import * as React from "react"
import {
  CloseButton,
  HStack,
  Icon,
  Square,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { FiInfo } from "react-icons/fi"

export const Banner = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const bgColor = useColorModeValue("yellow.100", "yellow.400")

  React.useEffect(() => {
    console.log("dans useEffect")
    // First case : on mount, the variable in localStorage is undefined.
    if (localStorage.getItem("banner.dontShow") === null || localStorage.getItem("banner.dontShow") === "false")
      onOpen()
    // Second case : the variable in localStorage exists and the user opted to don't show the banner.
    if (localStorage.getItem("banner.dontShow") === "true") onClose()
  }, [onClose, onOpen])

  if (!isOpen) return null

  function handleClose() {
    localStorage.setItem("banner.dontShow", "true")
    onClose()
  }

  return (
    <HStack
      justify="space-between"
      border="1px solid"
      borderColor="yellow.300"
      px="2"
      mt="4"
      borderRadius="lg"
      bgColor={bgColor}
      textColor={"gray.800"}
    >
      <HStack spacing="2" align="center">
        {!isMobile && (
          <Square size="12" borderRadius="md">
            <Icon as={FiInfo} boxSize="6" />
          </Square>
        )}
        <Text fontWeight="medium" textColor="gray.800">
          Les informations entreprise (ou de l'UES) ainsi que la tranche d'effectif, correspondent à la dernière
          déclaration.
        </Text>
      </HStack>
      <CloseButton aria-label="Fermer le panneau d'information" onClick={handleClose} />
    </HStack>
  )
}
