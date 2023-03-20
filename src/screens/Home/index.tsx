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
  const [recipes, setRecipes] = useState<any>(null);
  const [recipesLoading, setRecipesLoading] = useState(false);
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

  const handleFetchRecipes = async () => {
    setRecipesLoading(true);

    try {
      const res = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Give me an array of 2 recipes in JSON format only with the following ingredients:
        ${result && result.map((item) => (
          `- ${item.label}`
        ))}
        
        I need the properties Name, Ingredients and Instructions in JSON format for each recipe`,
        max_tokens: 1100,
        top_p: 1,
        temperature: 0.7,
      });

      setRecipesLoading(false);

      const recipesData = formatDataFromAPI(res?.data);
      setRecipes(recipesData);
    } catch (e) {
      setRecipesLoading(false);
      console.log("error fetching recipes: ", e);
    }
  };

  useEffect(() => {
    handleFetchIngredients();
  }, []);
  console.log("recipes: ", recipes);
  console.log("recipesLoading: ", recipesLoading);
  console.log("ingredientsLoading: ", ingredientsLoading);
  console.log("ingredients: ", ingredients);
  console.log("result: ", result);

  const disableFetchRecipesButton =
    recipesLoading || ingredientsLoading || !ingredients.length;
  console.log("disableFetchReceipesButton: ", disableFetchRecipesButton);

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
              onClick={handleFetchRecipes}
              isDisabled={disableFetchRecipesButton}
              isLoading={recipesLoading}
            >
              Fetch recipes
            </Button>
            {recipes && !recipesLoading ? (
              <Box mt={10}>
                <Heading>List:</Heading>
                <Box>
                  {recipes?.map((rec: any) => (
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
            ) : recipesLoading ? (
              <Text>Loading recipes...</Text>
            ) : null}
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
