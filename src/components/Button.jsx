import { Button, HStack } from "@chakra-ui/react"
import { RiArrowRightLine, RiMailLine } from "react-icons/ri"


export const Buttons = () => {
  return (
    <HStack>
      {/* <Button colorPalette="teal" variant="solid">
        <RiMailLine /> Email
      </Button> */}
      <Button colorPalette="teal" variant="outline">
        Sign Up <RiArrowRightLine />
      </Button>
    </HStack>
  )
}
