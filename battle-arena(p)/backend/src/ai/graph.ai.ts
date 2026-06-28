import {END, ReducedValue, START, StateGraph, StateSchema, type GraphNode} from "@langchain/langgraph"
import {cohereModel,geminiModel,mistralModel} from "./model.ai.js"
import z from "zod"
import { createAgent, HumanMessage, providerStrategy } from "langchain"
const state =new StateSchema({
    problem:z.string().default(""),
    solution_1:z.string().default(""),
    solution_2:z.string().default(""),
    judge:z.object({
        solution_1_score:z.number().default(0),
        solution_2_score:z.number().default(0),
        solution_1_reason:z.string().default(""),
        solution_2_reason:z.string().default("")
    })
})


const solutionNode: GraphNode<typeof state> = async (state) => {
    const [cohereResponse, mistralresponse] = await Promise.all([
        cohereModel.invoke(state.problem),
        mistralModel.invoke(state.problem)
    ])

    // console.log("cohere content type:", typeof cohereResponse.content, cohereResponse.content)
    // console.log("mistral content type:", typeof mistralresponse.content, mistralresponse.content)

    return {
        solution_1: cohereResponse.content,
        solution_2: mistralresponse.content
    }
}



const judgeNode: GraphNode<typeof state> = async (state) => {
    const [problem, solution_1, solution_2] = [state.problem, state.solution_1, state.solution_2]

    const judgeAgent = createAgent({
        model: geminiModel,
        responseFormat: providerStrategy(z.object({
            solution_1_score: z.number().max(10).min(0),
            solution_2_score: z.number().max(10).min(0),
            solution_1_reason: z.string().default(""),
            solution_2_reason: z.string().default("")
        })),
        systemPrompt: `you are a judge evaluating two responses to the problem: ${problem}
        by getting two different solutions from two different models: ${solution_1} and ${solution_2}.
        you have to be very fair and objective about your work, evaluate both solutions equally and give the proper judgement
        with proper reasoning why one solution is better than the other, with a proper explanation.
        `
    })

    const judgeResponse = await judgeAgent.invoke({
        messages: [
            new HumanMessage(
                `You are a judge evaluating two responses to the problem: ${problem}
                by getting two different solutions from two different models: ${solution_1} and ${solution_2}.
                you have to be very fair and objective about your work, evaluate both solutions equally and give the proper judgement
                with proper reasoning why one solution is better than the other, with a proper explanation.
                `
            )
        ]
    })

    const {
        solution_1_score,
        solution_2_score,
        solution_1_reason,
        solution_2_reason
    } = judgeResponse.structuredResponse

    return {
        judge: {
            solution_1_score,
            solution_2_score,
            solution_1_reason,
            solution_2_reason
        }
    }
}

const graph = new StateGraph(state)
.addNode("solution", solutionNode)
.addNode("judge_node", judgeNode)
.addEdge(START, "solution")
.addEdge("solution", "judge_node")
.addEdge("judge_node", END)
.compile()



export default async function runGraph(problem:string){


    const result = await graph.invoke({

        problem:problem
    })

    return {
        result 
    }
}