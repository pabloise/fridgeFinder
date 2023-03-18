import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

const Header: React.FC = () => {
  return (
    <Flex py={4} justifyContent="center" bgColor="purple">
      <Box maxW="1200px" w="full">
        <Text fontSize="xl" fontWeight="bold" color="white">
          Fridge Finder
        </Text>
      </Box>
    </Flex>
  );
};

export default Header;
