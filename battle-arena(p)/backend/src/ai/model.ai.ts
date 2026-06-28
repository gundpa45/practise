 import { ChatGoogle } from "@langchain/google";
import config from "../config/config.js"
 import { ChatMistralAI} from "@langchain/mistralai"
import { ChatCohere } from "@langchain/cohere";
 
 
 export const geminiModel= new ChatGoogle({
    model:"gemini-2.5-flash",
    apiKey:config.GEMINI_API_KEY
 })


 export const mistralModel= new ChatMistralAI({
   model:"mistral-large-latest",
   apiKey:config.MISTRAL_API_KEY
 })

 export const cohereModel=new  ChatCohere({
   model:"command-a-03-2025",
   apiKey:config.COHORE_API_KEY
 })