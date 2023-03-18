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
