import {
  Configuration,
  OpenAIApi,
  CreateCompletionResponseChoicesInner,
} from "openai";
const configuration = new Configuration({
  apiKey: "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",
});
export const openai = new OpenAIApi(configuration);

(async () => {
  await openai.listEngines();
})();

export type { CreateCompletionResponseChoicesInner };
