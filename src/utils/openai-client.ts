import { createAzure } from "@ai-sdk/azure";
import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";

const azure = createAzure({
	resourceName: process.env.AZURE_OPENAI_RESOURCE_NAME, // Azure resource name
	apiKey: process.env.AZURE_OPENAI_API_KEY, // Azure API key
});

export interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
}

// system prompt for software developer
const SYSTEM_PROMPT = `You are a helpful assistant for a software developer.
You can use the following tools to help the user:
`;

export const genAIResponse = createServerFn({ method: "POST", response: "raw" })
	.validator(
		(d: {
			messages: Array<Message>;
			systemPrompt?: { value: string; enabled: boolean };
		}) => d,
	)
	.handler(async ({ data }) => {
		const messages = data.messages
			.filter(
				(msg) =>
					msg.content.trim() !== "" &&
					!msg.content.startsWith("Sorry, I encountered an error"),
			)
			.map((msg) => ({
				role: msg.role,
				content: msg.content.trim(),
			}));

		const modelName = process.env.AZURE_OPENAI_MODEL_NAME;
		if (!modelName) throw new Error("AZURE_OPENAI_MODEL_NAME environment variable is required");
		
		try {
			const streamResponse = streamText({
				model: azure(modelName),
				messages,
				system: SYSTEM_PROMPT,
				maxSteps: 10,
			});

			return streamResponse.toDataStreamResponse();
		} catch (error) {
			console.error("Error in genAIResponse:", error);
			const errorMessage =
				error instanceof Error && error.message.includes("rate limit")
					? "Rate limit exceeded. Please try again in a moment."
					: error instanceof Error
						? error.message
						: "Failed to get AI response";

			return new Response(JSON.stringify({ error: errorMessage }), {
				headers: { "Content-Type": "application/json" },
			});
		}
	});

// export async function generateTextVector(text: string): Promise<number[]> {
//   const apiKey = getEnvVar('AZURE_OPENAI_API_KEY');
//   const endpoint = getEnvVar('AZURE_OPENAI_TEXT_EMBEDDING_MODEL_ENDPOINT');
//   const modelName = getEnvVar('AZURE_OPENAI_TEXT_EMBEDDING_MODEL_NAME');
//   const deployment = getEnvVar('AZURE_OPENAI_TEXT_EMBEDDING_MODEL_DEPLOYMENT_NAME');
//   const apiVersion = getEnvVar('AZURE_OPENAI_TEXT_EMBEDDING_MODEL_API_VERSION');

//   const clientOptions: AzureClientOptions = { endpoint, apiKey, deployment, apiVersion }

//   const azureOpenAIClient = new AzureOpenAI(clientOptions);

//   const response = await azureOpenAIClient.embeddings.create({
//     input: text,
//     model: modelName
//   });

//   if (!response.data || response.data.length === 0) {
//     throw new Error("No embedding data returned from API");
//   }
// // console.log(response.data[0].embedding)
//   return response.data[0].embedding;
// }
