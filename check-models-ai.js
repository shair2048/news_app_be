import axios from "axios";
import { GEMINI_API_KEY } from "./configs/env.js";

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;

  try {
    console.log("Retrieving the model list...");
    const response = await axios.get(url);

    const models = response.data.models;

    const geminiModels = models.filter((m) => m.name.includes("gemini"));

    console.log("--- Gemini models ---");
    geminiModels.forEach((model) => {
      console.log(`Model name: ${model.name}`);
      console.log(`Suported generation methods: ${model.supportedGenerationMethods}`);
      console.log("--------------------------------");
    });
  } catch (error) {
    console.error("Lỗi:", error.response ? error.response.data : error.message);
  }
}

listModels();
