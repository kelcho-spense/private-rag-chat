import "../../index.css";
import {
	ErrorComponent,
	type ErrorComponentProps,
	createFileRoute,
} from "@tanstack/react-router";
import {
	type TChatHistoryItem,
	getChatHistoryItem,
} from "../../store/chat.store";
import { Messages } from "./index";

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

	return (
		<div className="relative flex h-[calc(100vh-32px)] bg-gray-900">
			<Messages messages={chatItem.chatData} />
		</div>
	);
}
