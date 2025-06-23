import type { AgentContext, AgentRequest, AgentResponse } from "@agentuity/sdk";
import { groq } from "@ai-sdk/groq";
import { generateText, streamText } from "ai";

export const welcome = () => {
	return {
		welcome:
			"Welcome to the Vercel AI SDK with Groq and Llama! I can help you build AI-powered applications using Vercel's AI SDK with Groq powered models.",
		prompts: [
			{
				data: '{"name":{"first":"Matthew","last":"Congrove"},"title":"Co-Founder","company":{"name":"Agentuity","description":"The cloud platform purpose-built for deploying, managing, and scaling AI agents.\\n\\nWe\'re witnessing a fundamental shift in software: from human-driven, AI-assisted applications to AI-driven, fully autonomous agents. These agents need to self-learn, self-replicate, and self-heal at scale. They require different computing paradigms, different deployment models, and different infrastructure than what exists today.\\n\\nTraditional clouds force AI agents into a box designed for web apps and mobile backends. It\'s like trying to run a modern electric vehicle on infrastructure built for steam engines. We believe the next generation of breakthrough AI applications will be built on infrastructure specifically designed for autonomous agents."},"role":{"title":"Co-Founder","summary":"Co-founded this company with a mission to create an AI agent cloud platform. Aside from engineering work, I\'m responsible for product, design, marketing, and operations."},"location":"Austin, Texas, United States"}',
				contentType: "application/json",
			},
		],
	};
};

const emailMessageTemplate = `
Hi {{name.first}},

Found out {{company.name}} is building AI agents. Are you frustrated by forcing them onto legacy systems? It's like trying to squeeze a elephant through a keyhole.

We developed the first cloud where agents, not humans, are the primary users. Single command deployment. No access control puzzles, no security group complications, no system headaches.

Companies are shipping agents in record time. Works with your favorite frameworks like CrewAI, LangChain, and Vercel AI SDK.

Can I show you a brief demo? I would love your feedback.

Best,
Rick Blalock
Founder, Agentuity
`;

export default async function Agent(
	req: AgentRequest,
	resp: AgentResponse,
	ctx: AgentContext,
) {
	try {
		const userData = await req.data.text();

		const result = await generateText({
			model: groq("llama-3.3-70b-versatile"),
			prompt: `You are an SDR. You are given a JSON object containing information about a person. You are to generate a customized version of an email message to the person. You should keep the message as close to the template as possible, but switch up words so we don't get flagged as spam and tweak or add a bit to the message if there's an opportunity to use the person's title, role summary, or company description.

      If the person is in the south Florida metro area (Palm Beach, Miami, etc), in addition to the demo call-to-action, also offer to meet in-person. If the person is in the Austin metro area, offer to have them meet with co-founder Jeff.

      Here is the user JSON object:

      ${userData}

      Here is the email message template. Keep the signature as-is, including the newlines.

      ${emailMessageTemplate}

      Return the email message as plain text. Do not include any other text in your response.
      `,
		});

		return resp.text(result.text);
	} catch (error) {
		ctx.logger.error("Error running agent:", error);

		return resp.text("Sorry, there was an error processing your request.");
	}
}
