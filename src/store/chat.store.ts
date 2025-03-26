import { Store } from "@tanstack/store";

export interface TChatHistoryItem {
	chatId: number;
	chatData: {
		id: number;
		role: "user" | "assistant";
		content: string;
	}[];
}

type TChatHistoryData = TChatHistoryItem[];

const chatHistoryData: TChatHistoryData = [
	{
		chatId: 1,
		chatData: [
			{ id: 1, role: "user", content: "How does machine learning work?" },
			{
				id: 2,
				role: "assistant",
				content:
					"Machine learning algorithms build mathematical models based on sample data to make predictions or decisions.",
			},
			{ id: 3, role: "user", content: "What are neural networks?" },
			{
				id: 4,
				role: "assistant",
				content:
					"Neural networks are computing systems inspired by biological neural networks in animal brains.",
			},
		],
	},
	{
		chatId: 2,
		chatData: [
			{
				id: 1,
				role: "user",
				content: "What are the best practices for React performance?",
			},
			{
				id: 2,
				role: "assistant",
				content:
					"React performance can be improved by using memo, useCallback, virtualization for long lists, and proper key usage.",
			},
			{ id: 3, role: "user", content: "How do CSS-in-JS libraries work?" },
			{
				id: 4,
				role: "assistant",
				content:
					"CSS-in-JS libraries generate unique class names and inject styles directly into the DOM, offering component-scoped styling.",
			},
		],
	},
	{
		chatId: 3,
		chatData: [
			{ id: 1, role: "user", content: "What is data normalization?" },
			{
				id: 2,
				role: "assistant",
				content:
					"Data normalization is the process of scaling values to a standard range, typically between 0 and 1, to improve model performance.",
			},
			{
				id: 3,
				role: "user",
				content: "Explain the difference between SQL and NoSQL.",
			},
			{
				id: 4,
				role: "assistant",
				content:
					"SQL databases are relational with structured schemas, while NoSQL databases are non-relational with flexible schemas for unstructured data.",
			},
		],
	},
	{
		chatId: 4,
		chatData: [
			{
				id: 1,
				role: "user",
				content: "React Native vs Flutter: which should I learn?",
			},
			{
				id: 2,
				role: "assistant",
				content:
					"React Native uses JavaScript and has better integration with native modules, while Flutter uses Dart and offers consistent UI across platforms.",
			},
			{
				id: 3,
				role: "user",
				content: "How do you handle state management in mobile apps?",
			},
			{
				id: 4,
				role: "assistant",
				content:
					"Mobile apps use various state management solutions like Redux, MobX, or built-in solutions such as Context API for React Native or Provider for Flutter.",
			},
		],
	},
];

export const chatHistoryStore = new Store<TChatHistoryItem[]>(chatHistoryData);

// filter method to return a chatHistoryItem with the chatId
export const getChatHistoryItem = (chatId: number) => {
	const allItems = chatHistoryStore.state;
	return allItems.filter((item) => item.chatId === chatId)[0];
};

// add a new chatData to a chatHistoryItem
export const addChatHistoryData = (
	chatId: number,
	chatDataItem: { id: number; role: "user" | "assistant"; content: string },
) => {
	const allItems = chatHistoryStore.state;
	const updatedItems = allItems.map((item) => {
		if (item.chatId === chatId) {
			return {
				...item,
				chatData: [...item.chatData, chatDataItem]
			};
		}
		return item;
	});
	chatHistoryStore.setState(() => updatedItems);
};

// function to add chatHistoryItem to the chatHistoryStore
export const addChatHistoryItem = (chatData: TChatHistoryItem) => {
	chatHistoryStore.setState((state) => {
		return [...state, chatData];
	});
};
