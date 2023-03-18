import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: "org-9B3idoDjnyrZLEcsWgr8wa9F",
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
openai.listEngines();
