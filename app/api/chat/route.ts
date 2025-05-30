import { NextRequest, NextResponse } from 'next/server';
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    const MODEL_NAME = 'llama3-70b-8192';
    const chat = new ChatGroq({
        apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    model: MODEL_NAME,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      new SystemMessage(
        'You are a helpful assistant that helps freelancers find tasks and manage their work. Always provide concise answers and ask for which field you want the assistant first but only one time  then give accurate suggestion  .',
      ),
      new HumanMessage(message),
    ]);

    const chain = prompt.pipe(chat);

    const response = await chain.invoke({
      message: message,
    });

    return NextResponse.json({ response: response.content });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}