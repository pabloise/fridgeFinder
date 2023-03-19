import React from "react";
import { Box } from "@chakra-ui/react";
import {
  Autocomplete as SimpleAutocomplete,
  Option,
} from "chakra-ui-simple-autocomplete";
export type { Option } from "chakra-ui-simple-autocomplete";

type Props = {
  options: Option[];
  result: Option[];
  setResult: (res: Option[]) => void;
};

const Autocomplete: React.FC<Props> = ({ options, result, setResult }) => {
  return (
    <Box maxW="md">
      <SimpleAutocomplete
        options={options}
        result={result}
        setResult={(options: Option[]) => setResult(options)}
        placeholder="Search ingredients"
      />
    </Box>
  );
};

export default Autocomplete;
