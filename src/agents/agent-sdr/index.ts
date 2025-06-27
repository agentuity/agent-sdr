import type { AgentContext, AgentRequest, AgentResponse } from "@agentuity/sdk";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { z } from "zod";

const RequestSchema = z.object({
	person: z.any(),
	template: z.string(),
	prompt: z.string(),
});

export const welcome = () => {
	return {
		welcome:
			"Hi, I'm your AI SDR. You can send me a JSON object containing information about a person and I'll generate a customized version of an email template for you.",
		prompts: [
			{
				data: {
					person: {
						name: {
							first: "Jane",
							last: "Doe",
						},
						company: {
							name: "Cyan",
							description:
								"A comprehensive project management and team collaboration platform that helps growing businesses streamline their workflows and boost productivity.\n\nCyan combines task management, resource planning, and real-time communication in one intuitive platform. With advanced reporting and analytics, teams can track project progress, identify bottlenecks, and optimize their processes for maximum efficiency.\n\nServing over 5,000 companies worldwide, from startups to enterprise teams, Cyan has become the go-to solution for organizations looking to scale their operations without losing sight of what matters most.",
						},
						role: {
							title: "CTO",
							summary:
								"Leads the technology strategy and engineering organization at Cyan. Responsible for architecting scalable systems, building high-performing engineering teams, and driving technical innovation to support the company's rapid growth and customer success.",
						},
						location: "Amarillo, Texas, United States",
					},
					template:
						"Hi [First Name],\n\nFound out [Company Name] is building AI agents. Are you frustrated by forcing them onto legacy systems? It's like trying to squeeze an elephant through a keyhole.\n\nWe developed the first cloud where agents, not humans, are the primary users. Single command deployment. No access control puzzles, no security group complications, no system headaches.\n\nCompanies are shipping agents in record time. Works with your favorite frameworks like CrewAI, LangChain, and Vercel AI SDK.\n\nCan I show you a brief demo? I would love your feedback.\n\nBest,\nRick Blalock\nFounder, Agentuity",
					prompt:
						"If the person is in the south Florida metro area (Palm Beach, Miami, etc), in addition to the demo call-to-action, also offer to meet in-person. If the person is in the Austin metro area, offer to have them meet with co-founder Jeff. If offering to meet in person, make sure to use that phrase and note that the person is in the same city as the co-founder.",
				},
				contentType: "application/json",
			},
		],
	};
};

export default async function Agent(
	req: AgentRequest,
	resp: AgentResponse,
	ctx: AgentContext,
) {
	try {
		const data = RequestSchema.parse(await req.data.json());
		const { person, template, prompt } = data;

		const result = await generateText({
			model: groq("llama-3.3-70b-versatile"),
			prompt: `You are an SDR. You are given a JSON object containing information about a person. You are to generate a customized version of an email message to the person. You should keep the message as close to the template as possible, but (a) switch up words so we don't get flagged as spam and (b) tweak or add a bit to the message if there's an opportunity to use the person's title or role summary, or (as a fallback) the company description. Try to keep the message short, within about 50 to 75 words of the template's original wordcount.

      ${prompt}

      Here is the user JSON object:

      ${JSON.stringify(person)}

      Here is the email message template. Keep the signature as-is, including the newlines.

      ${template}

      Return the email message as plain text. Do not include any other text in your response.
      `,
		});

		return resp.text(result.text);
	} catch (error) {
		ctx.logger.error("Error running agent:", error);

		return resp.text("Sorry, there was an error processing your request.");
	}
}
