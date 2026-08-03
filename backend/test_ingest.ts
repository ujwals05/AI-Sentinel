import { prisma } from "./src/lib/prisma.js";
import { generateApiKey, getApiKeyPrefix, hashApiKey } from "./src/modules/api-keys/api-key.utils.js";
import app from "./src/app.js";

const PORT = 4001;

async function main() {
    console.log("Starting test setup...");
    
    // Start server
    const server = app.listen(PORT, () => {
        console.log(`Test server running on port ${PORT}`);
    });

    try {
        // Create user
        const user = await prisma.user.create({
            data: {
                email: `test_${Date.now()}@example.com`,
                passwordHash: "dummy",
                name: "Test User",
            }
        });

        // Create app
        const application = await prisma.application.create({
            data: {
                userId: user.id,
                name: "Test Application",
                type: "CHATBOT",
            }
        });

        // Create API key
        const rawApiKey = generateApiKey();
        const prefix = getApiKeyPrefix(rawApiKey);
        const hash = hashApiKey(rawApiKey);

        await prisma.apiKey.create({
            data: {
                applicationId: application.id,
                name: "Test Key",
                keyPrefix: prefix,
                keyHash: hash,
            }
        });

        console.log("Setup complete. Sending ingest request...");

        const ingestPayload = {
            metadata: { user: "test-user-123" },
            conversation: {
                externalId: `conv_${Date.now()}`,
                title: "Test Conversation",
                metadata: { source: "test-script" }
            },
            messages: [
                { role: "USER", content: "Hello, AI!" },
                { role: "ASSISTANT", content: "Hello! How can I help you today?" }
            ]
        };

        const response = await fetch(`http://localhost:${PORT}/api/v1/ingest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": rawApiKey,
                "Idempotency-Key": `idem_${Date.now()}`
            },
            body: JSON.stringify(ingestPayload)
        });

        const data = await response.json();
        console.log("Ingest Response:", data);

        if (!response.ok) {
            throw new Error(`Ingest failed: ${JSON.stringify(data)}`);
        }

        console.log("Waiting 10 seconds for background evaluation to complete...");
        await new Promise(resolve => setTimeout(resolve, 10000));

        // Check evaluation
        const evaluation = await prisma.evaluation.findFirst({
            where: {
                applicationId: application.id,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log("Found Evaluation:", JSON.stringify(evaluation, null, 2));

        if (!evaluation) {
            console.error("Test failed: No evaluation found");
        } else if (evaluation.status !== "COMPLETED" && evaluation.status !== "FAILED") {
            console.error("Test failed: Evaluation is not in completed or failed state");
        } else {
            console.log("Test passed!");
        }

    } catch (e) {
        console.error("Error during test:", e);
    } finally {
        server.close();
        await prisma.$disconnect();
    }
}

main();
