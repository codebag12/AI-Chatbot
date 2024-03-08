import OpenAI, { OpenAIError } from "openai";

const openai = new OpenAI();

async function withRetries(func, retries = 0, initialInterval = 1000) {
  try {
    return await func();
  } catch (error) {
    if (retries >= 3 || !(error instanceof OpenAIError) || error.code !== 'insufficient_quota') {
      throw error; // Re-throw for non-retryable errors
    }

    const waitTime = Math.pow(2, retries) * initialInterval;
    console.log(`Retrying after ${waitTime}ms due to insufficient quota...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return withRetries(func, retries + 1);
  }
}

async function main() {
  await withRetries(async () => {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "gpt-3.5-turbo",
    });
    console.log(completion.choices[0]);
  });
}

main();
