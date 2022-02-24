import { Flex, LinkBox, LinkOverlay, Spacer } from "@chakra-ui/react"
import React from "react"

type LinkButtonProps = {
  children: React.ReactNode
  href: string
  isExternal?: boolean
  leftIcon?: React.ReactNode
}

export function LinkButton({ children, href, isExternal = false, leftIcon = null, ...rest }: LinkButtonProps) {
  return (
    <LinkBox>
      <LinkOverlay href={href} isExternal={isExternal}>
        <Flex
          mr="2px"
          justify="center"
          align="center"
          border="1px solid"
          width="fit-content"
          px={3}
          py={2}
          borderRadius="md"
          margin="auto"
          mt={8}
          {...rest}
        >
          {leftIcon}
          <Spacer ml={2} />
          {children}
        </Flex>
      </LinkOverlay>
    </LinkBox>
  )
}
