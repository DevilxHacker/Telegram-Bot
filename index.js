import 'dotenv/config';
import { InferenceClient } from "@huggingface/inference";
import TelegramBot from 'node-telegram-bot-api';

console.log("Telegram Bot Token:", process.env.TOKEN);

// Create Hugging Face inference client
const client = new InferenceClient(process.env.AI);

// Create Telegram bot
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

// Handle messages
bot.on('message', async (msg) => {
  try {
    const chatCompletion = await client.chatCompletion({
      model: "deepseek-ai/DeepSeek-V3-0324",
      messages: [
        {
          role: "user",
          content: msg.text,
        },
      ],
    });

    const text = chatCompletion.choices[0].message.content;
    await bot.sendMessage(msg.chat.id, text);
  } catch (err) {
    console.error("Error:", err.message);
    await bot.sendMessage(msg.chat.id, "Error: " + err.message);
  }
});
