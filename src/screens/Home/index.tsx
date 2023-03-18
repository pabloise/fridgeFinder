import { Button, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { openai } from "../../services/openai/config";

const formatRecipes = (data: any) => {
  if (!data) return null;

  const text = data?.choices?.[0]?.text.replace(/^./, "") || "";
  const parsedObject = JSON.parse(text);

  return parsedObject;
};

const Home: React.FC = () => {
  const [chatGPTRes, setChatGPTRes] = useState<any>(null);

  const handleFetchIngredients = async () => {
    // const res = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: `Give me a list of the 400 most used cocine ingredients in Argentina in JSON format`,
    //   max_tokens: 3000,
    //   top_p: 1,
    //   temperature: 0.7,
    // });
    // const text = res?.data?.choices?.[0]?.text || "";
    // console.log("ing: ", JSON.parse(text));
    // setChatGPTRes(res.data.choices[0].text);
  };

  const handleFetchReceipe = async () => {
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

    const receipesData = formatRecipes(res?.data);

    setChatGPTRes(receipesData);
  };

  useEffect(() => {
    handleFetchIngredients();
  }, []);
  console.log("recipes: ", chatGPTRes);

  return (
    <>
      <Flex flexDir="column">
        <Header />
        <Flex flex={1} px={8} py={10}>
          <Button onClick={handleFetchReceipe}>Fetch receipe</Button>
          {/* <Text whiteSpace="pre-line">{chatGPTRes}</Text> */}
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
