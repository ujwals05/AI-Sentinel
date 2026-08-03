import {
    StateGraph,
    START,
    END,
} from "@langchain/langgraph";


import { EvaluationState } from "./evaluation.state.js";

import {
    qualityNode,
    safetyNode,
    trustNode,
    aggregationNode,
} from "./evaluation.nodes.js";


const graph = new StateGraph(
    EvaluationState
)

    // -------------------------
    // Judge Nodes
    // -------------------------

    .addNode(
        "qualityJudge",
        qualityNode
    )

    .addNode(
        "safetyJudge",
        safetyNode
    )

    .addNode(
        "trustJudge",
        trustNode
    )

    // -------------------------
    // Aggregation Node
    // -------------------------

    .addNode(
        "aggregate",
        aggregationNode
    )

    // -------------------------
    // Start -> Judges
    // -------------------------

    .addEdge(
        START,
        "qualityJudge"
    )

    .addEdge(
        START,
        "safetyJudge"
    )

    .addEdge(
        START,
        "trustJudge"
    )

    // -------------------------
    // Judges -> Aggregation
    // -------------------------

    .addEdge(
        "qualityJudge",
        "aggregate"
    )

    .addEdge(
        "safetyJudge",
        "aggregate"
    )

    .addEdge(
        "trustJudge",
        "aggregate"
    )

    // -------------------------
    // Aggregation -> End
    // -------------------------

    .addEdge(
        "aggregate",
        END
    );


export const evaluationGraph =
    graph.compile();