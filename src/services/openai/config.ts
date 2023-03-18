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
  const res = await openai.listEngines();
})();

export type { CreateCompletionResponseChoicesInner };
