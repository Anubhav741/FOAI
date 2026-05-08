import axios from 'axios';

const HF_API = 'https://router.huggingface.co/v1/chat/completions';
const API_KEY = import.meta.env.VITE_HF_API_KEY;

/**
 * Send a message to DeepSeek-V4-Pro via HuggingFace Router and get a response
 * Uses OpenAI-compatible chat completions format
 * @param {string} userMessage
 * @returns {Promise<string>} bot response text
 */
export async function sendChatMessage(userMessage) {
  if (!userMessage || !userMessage.trim()) {
    throw new Error('Message cannot be empty');
  }

  if (!API_KEY) {
    console.error('VITE_HF_API_KEY is not set in .env');
    throw new Error('Hugging Face API key is missing. Please check your .env file.');
  }

  try {
    const response = await axios.post(
      HF_API,
      {
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant that specializes in AI, space exploration, science, and news. Answer concisely and clearly. Use markdown formatting when helpful.',
          },
          {
            role: 'user',
            content: userMessage.trim(),
          },
        ],
        model: 'deepseek-ai/DeepSeek-V4-Pro:novita',
        max_tokens: 512,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60s timeout
      }
    );

    const data = response.data;
    console.log('DeepSeek API response received');

    // OpenAI-compatible format: { choices: [{ message: { content } }] }
    if (data?.choices && data.choices.length > 0 && data.choices[0]?.message?.content) {
      return data.choices[0].message.content.trim();
    }

    // Fallback checks
    if (data?.error) {
      console.error('DeepSeek model error:', data.error);
      throw new Error(data.error);
    }

    console.error('Unexpected response format:', JSON.stringify(data).slice(0, 300));
    throw new Error('Unexpected response format from AI model');
  } catch (err) {
    // Handle model loading (503)
    if (err?.response?.status === 503) {
      const estimatedTime = err?.response?.data?.estimated_time;
      const msg = estimatedTime
        ? `Model is loading, estimated wait: ${Math.ceil(estimatedTime)}s`
        : 'Model is loading, please try again in about 30 seconds...';
      console.warn('Model loading:', msg);
      throw new Error(msg);
    }
    // Handle rate limit
    if (err?.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }
    // Handle auth error
    if (err?.response?.status === 401) {
      throw new Error('Invalid API key. Please check your VITE_HF_API_KEY.');
    }
    console.error('Chatbot API error:', err?.response?.data || err.message);
    throw err;
  }
}
