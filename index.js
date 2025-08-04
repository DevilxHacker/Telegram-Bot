import 'dotenv/config';
import { InferenceClient } from "@huggingface/inference";
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const client = new InferenceClient(process.env.AI);

// In-memory store for user chat history
const chatHistories = {};

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  // Initialize conversation history
  if (!chatHistories[chatId]) {
    chatHistories[chatId] = [
      { role: "system", content: "You are a helpful assistant." }
    ];
  }

  // Append user's message
  chatHistories[chatId].push({
    role: "user",
    content: msg.text,
  });

  try {
    // Send full conversation to model
    const chatCompletion = await client.chatCompletion({
      model: "deepseek-ai/DeepSeek-V3-0324",
      messages: chatHistories[chatId],
    });

    const reply = chatCompletion.choices[0].message.content;

    // Append bot's reply
    chatHistories[chatId].push({
      role: "assistant",
      content: reply,
    });

    await bot.sendMessage(chatId, reply);
  } catch (err) {
    console.error("Error:", err.message);
    await bot.sendMessage(chatId, "Error: " + err.message);
  }
});
