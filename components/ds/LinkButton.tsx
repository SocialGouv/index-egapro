import React from "react"
import { Flex, LinkBox, LinkOverlay, Spacer } from "@chakra-ui/react"

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
          justify="center"
          align="center"
          border="1px solid"
          width="fit-content"
          px={3}
          py={2}
          borderRadius="lg"
          margin="auto"
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
