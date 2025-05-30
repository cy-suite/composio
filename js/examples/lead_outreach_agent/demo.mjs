import { ChatOpenAI } from "@langchain/openai";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import { pull } from "langchain/hub";
import dotenv from 'dotenv';
import { LangchainToolSet } from "composio-core";

dotenv.config();



const llm = new ChatOpenAI({
    model: "gpt-4-turbo",
    apiKey: process.env.OPENAI_API_KEY,
});

const toolset = new LangchainToolSet({
    apiKey: process.env.COMPOSIO_API_KEY,
});

const tools = await toolset.getTools({
    actions: ["HUBSPOT_LIST_CONTACTS_PAGE", "GMAIL_CREATE_EMAIL_DRAFT"]
});

const prompt = await pull("hwchase17/openai-functions-agent");


const agent = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt,
});

const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: false, 
});
const result = await agentExecutor.invoke({
    input: `Draft an email for each lead in my Hubspot contacts page introducing yourself and asking them if they're interested in integrating AI Agents in their workflow.`
});
console.log('🎉Output from agent: ', result.output);
