import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Box,
  Text,
  Heading,
  List,
  ListItem,
} from "@chakra-ui/react";

import { openai } from "../../services/openai/config";

import Header from "../../components/Header";
import Autocomplete, { Option } from "../../components/Autocomplete";

const formatDataFromAPI = (data: any) => {
  if (!data) return null;

  const text = data?.choices?.[0]?.text.replace(/^./, "") || "";
  const parsedObject = JSON.parse(text);

  return parsedObject;
};

const formatIngredientOptions = (ingredients: string[]) => {
  const uniqueIngredients = ingredients.filter((x) => x);
  return uniqueIngredients.map((ingredient) => ({
    value: ingredient,
    label: ingredient,
  }));
};

const Home: React.FC = () => {
  const [receipes, setReceipes] = useState<any>(null);
  const [receipesLoading, setReceipesLoading] = useState(false);
  const [ingredientsLoading, setIngredientsLoading] = useState(false);
  const [ingredients, setIngredients] = useState<Option[]>([]);
  const [result, setResult] = useState<Option[]>([]);

  const handleFetchIngredients = async () => {
    setIngredientsLoading(true);

    try {
      const res = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Give me an array of the 100 most used cocine ingredients in Argentina in JSON format`,
        max_tokens: 3300,
        top_p: 1,
        temperature: 0.7,
      });

      setIngredientsLoading(false);

      const formattedIngredients = formatDataFromAPI(res?.data);
      const formatOptions = formatIngredientOptions(formattedIngredients);
      setIngredients(formatOptions);
    } catch (e) {
      setIngredientsLoading(false);
      console.log("error fetching ingredients: ", e);
    }
  };

  const handleFetchReceipes = async () => {
    setReceipesLoading(true);

    try {
      const res = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Give me an array of 2 recipes in JSON format only with the following ingredients:
        - 2 Eggs
        - 1 carrot
        - cheese
        - cream
        
        I need the properties Name, Ingredients and Instructions in JSON format for each receipe`,
        max_tokens: 1100,
        top_p: 1,
        temperature: 0.7,
      });

      setReceipesLoading(false);

      const receipesData = formatDataFromAPI(res?.data);
      setReceipes(receipesData);
    } catch (e) {
      setReceipesLoading(false);
      console.log("error fetching receipes: ", e);
    }
  };

  useEffect(() => {
    handleFetchIngredients();
  }, []);
  console.log("receipes: ", receipes);
  console.log("receipesLoading: ", receipesLoading);
  console.log("ingredientsLoading: ", ingredientsLoading);
  console.log("ingredients: ", ingredients);
  console.log("result: ", result);

  const disableFetchReceipesButton =
    receipesLoading || ingredientsLoading || !ingredients.length;
  console.log("disableFetchReceipesButton: ", disableFetchReceipesButton);

  return (
    <>
      <Flex flexDir="column">
        <Header />
        <Flex py={4} justifyContent="center">
          <Box maxW="1200px" w="full" flex={1} py={10}>
            <Box py={10}>
              {ingredients.length ? (
                <Autocomplete
                  result={result}
                  setResult={setResult}
                  options={ingredients}
                />
              ) : ingredientsLoading ? (
                <Text>Loading ingredients...</Text>
              ) : (
                <Button onClick={handleFetchIngredients}>
                  Fetch ingredients
                </Button>
              )}
            </Box>
            <Button
              onClick={handleFetchReceipes}
              isDisabled={disableFetchReceipesButton}
              isLoading={receipesLoading}
            >
              Fetch receipes
            </Button>
            {receipes && !receipesLoading ? (
              <Box mt={10}>
                <Heading>List:</Heading>
                <Box>
                  {receipes?.map((rec: any) => (
                    <Box
                      mt={10}
                      bgColor="#e8cff980"
                      px={4}
                      py={6}
                      borderRadius={8}
                    >
                      <Heading size="md">{rec["Name"]}</Heading>
                      <Heading size="sm" pt={5}>
                        Ingredients:
                      </Heading>
                      <List>
                        {rec["Ingredients"].map((ing: any) => (
                          <ListItem pl={4}>
                            <Text>{ing}</Text>
                          </ListItem>
                        ))}
                      </List>
                      <Heading size="sm" pt={5}>
                        Instructions:
                      </Heading>
                      <List>
                        {rec["Instructions"].map((ins: any) => (
                          <ListItem pl={4}>
                            <Text>{ins}</Text>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : receipesLoading ? (
              <Text>Loading receipes...</Text>
            ) : null}
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
