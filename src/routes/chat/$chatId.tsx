import {
	ErrorComponent,
	type ErrorComponentProps,
	createFileRoute,
} from "@tanstack/react-router";
import {
	type TChatHistoryItem,
	getChatHistoryItem,
} from "../../store/chat.store";

export const Route = createFileRoute("/chat/$chatId")({
	loader: async ({ params: { chatId } }) => getChatHistoryItem(Number(chatId)),
	notFoundComponent: () => {
		return <p>Post not found</p>;
	},
	component: ChatComponent,
  errorComponent: ChatErrorComponent,
});

export function ChatErrorComponent({ error }: ErrorComponentProps) {
	return <ErrorComponent error={error} />;
}

function ChatComponent() {
	const chatItem = Route.useLoaderData();

	return <div>{JSON.stringify(chatItem)}</div>;
}
