import type { AgentContext, AgentRequest, AgentResponse } from "@agentuity/sdk";
import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

const RequestSchema = z.object({
	person: z.any(),
	prompt: z.string(),
	summary: z.object({
		prospect_fit: z.string(),
		key_focus_points: z.array(z.string()),
		pain_points: z.array(z.string()),
	}),
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
						location: "Austin, Texas, United States",
						company: "Cyan",
						role: "CTO",
					},
					prompt: `You are writing the first email in an outreach sequence to CTO-level executives at qualified prospect companies to introduce them to Agentuity.

## Common CTO Pain Points to Address

- Infrastructure complexity slowing AI development
- Managing multiple AI frameworks and tools
- Scaling AI operations without massive DevOps overhead
- Time-to-market pressure for AI features
- Team productivity bottlenecks
- Technical debt from custom AI infrastructure
- Integration challenges between different AI systems

Remember: Write like you're genuinely trying to help solve their problem, not sell them something. Customize based on their specific role and location.

## Geographic Customization

- If the person is in the South Florida metro area (Palm Beach, Miami, etc), in addition to the demo call-to-action, also offer to meet in-person
- If the person is in the Austin metro area, offer to have them meet with co-founder Jeff

If offering to meet 'in person', make sure to use that phrase and note that the person is in the same city as the co-founder (Rick for South Florida, Jeff for Austin).`,
					summary: {
						prospect_fit:
							"Cyan operates at the intersection of behavioral health and technology, leveraging AI-powered electronic health record solutions that automate clinical documentation and enhance workflows. Their focus on AI initiatives, such as utilizing large language models for generating clinical notes, indicates a solid commitment to advancing their technological capabilities. Additionally, as a SaaS company that provides sophisticated tools for healthcare providers, they would benefit from Agentuity’s simplified deployment infrastructure and cross-framework compatibility for multiple AI agents, further enhancing their service offerings and client interactions.",
						key_focus_points: [
							"Streamline AI agent deployment with a single command, reducing the need for complex infrastructure management.",
							"Facilitate seamless communication between different AI frameworks, enhancing your AI initiatives like clinical note generation.",
							"Quickly scale your AI capabilities with a comprehensive toolkit designed for multi-channel deployment and management.",
						],
						pain_points: [
							"Reduce the complexity and time-consuming nature of managing multiple AI frameworks like your AI Clinical Documentation and AI Assist initiatives.",
							"Eliminate infrastructure barriers that hinder rapid deployment of new AI-powered health solutions.",
							"Address framework compatibility issues that can slow down the integration and scalability of new AI features across your platform.",
						],
					},
				},
				contentType: "application/json",
			},
			{
				data: {
					person: {
						name: {
							first: "John",
							last: "Smith",
						},
						location: "Bellevue, Washington, United States",
						company: "Outreach",
						role: "CTO",
					},
					prompt: `You are writing the first email in an outreach sequence to CTO-level executives at qualified prospect companies to introduce them to Agentuity.

## Common CTO Pain Points to Address

- Infrastructure complexity slowing AI development
- Managing multiple AI frameworks and tools
- Scaling AI operations without massive DevOps overhead
- Time-to-market pressure for AI features
- Team productivity bottlenecks
- Technical debt from custom AI infrastructure
- Integration challenges between different AI systems

Remember: Write like you're genuinely trying to help solve their problem, not sell them something. Customize based on their specific role and location.

## Geographic Customization

- If the person is in the South Florida metro area (Palm Beach, Miami, etc), in addition to the demo call-to-action, also offer to meet in-person
- If the person is in the Austin metro area, offer to have them meet with co-founder Jeff

If offering to meet 'in person', make sure to use that phrase and note that the person is in the same city as the co-founder (Rick for South Florida, Jeff for Austin).`,
					summary: {
						prospect_fit:
							"Outreach is at the forefront of integrating AI into their sales execution platform, showcasing advanced AI capabilities such as AI-powered workflows that enhance productivity and decision-making. Their features like Smart Deal Assist and AI Sales Forecasting illustrate a strong focus on leveraging AI for efficiency and predictive analytics, aligning perfectly with Agentuity's mission of simplifying AI agent deployment. By providing tools that automate repetitive tasks and optimize sales interactions, Outreach not only highlights their commitment to AI-driven technology but also indicates a scalability potential that fits well within Agentuity's ideal prospect criteria.",
						key_focus_points: [
							"Streamline deployment of AI agents to enhance your sales workflows without the need for complex infrastructure.",
							"Enable seamless cross-framework collaboration for AI-powered tools like Smart Deal Assist and AI Sales Forecasting.",
							"Achieve rapid scaling of AI initiatives, enhancing predictive analytics and operational efficiency without additional DevOps resources.",
						],
						pain_points: [
							"Eliminate the complexity of integrating AI capabilities into existing sales platforms without rebuilding the infrastructure.",
							"Avoid the delays in AI deployment and scaling due to complex cloud configurations.",
							"Facilitate the unification of AI tools and frameworks, preventing bottlenecks that hinder sales productivity enhancements.",
						],
					},
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
		const { person, prompt } = data;

		const result = await generateObject({
			model: groq("llama-3.3-70b-versatile"),
			schema: z.object({
				subject: z
					.string()
					.max(30)
					.transform((s) => s.toLowerCase()),
				opening: z.string(),
				value_prop: z.string(),
				cta: z.string(),
				ps: z.string(),
			}),
			prompt: `You are an expert email copywriter specializing in conversational B2B outreach. Your task is to write genuine, non-salesy emails that introduce Agentuity (an AI agent deployment platform) to prospects.

${prompt}

# Core Writing Principles

- Write like a real person - conversational and genuine, not corporate
- No jargon or buzzwords - explain things simply and directly
- No weird analogies - keep it straightforward
- Be honest about what Agentuity does - don't oversell or use marketing speak
- Make it feel personal - like you actually researched their company
- Keep subject lines casual - all lowercase, short, internal-message style
- Focus on genuine value - what will actually help them
- Vary your language to avoid spam detection - switch up common words and phrases
- Personalize using available data - reference their title, role summary, or company description
- Geographic customization: Add in-person meeting offers for South Florida (general) or Austin (with co-founder Jeff)
- Count words carefully - around 125 words total

## Subject Line

- Keep it short: 3-5 words maximum
- Use all lowercase letters
- Sound like internal communication, not marketing
- Reference their specific problem: "ai deployment issues," "framework headaches"
- Avoid: capitals, exclamation points, sales language, buzzwords

## Opening Personalization

- Sound genuine and conversational, like you actually looked at their work
- Reference their company and what they're building
- Acknowledge their likely challenges without being presumptuous
- Keep it natural - no corporate speak or jargon

## Value Proposition

- Explain what Agentuity actually does in simple terms
- Connect directly to their specific problem
- No buzzwords or marketing language - just honest explanation
- Focus on practical benefits they'll actually care about
- Skip the jargon - talk like a human

## Call-to-Action

- Always specify time commitment (15 minutes)
- Make it about them, not you ("show you how" vs "tell you about")
- Offer flexibility ("call" or "quick chat")
- Remove friction with easy response options
- Add geographic customization based on their location

## PS (Postscript)

- Add urgency: "Limited beta access," "New capability"
- Provide social proof: "Helping 50+ AI companies"
- Tease specific benefit: "Deploy in minutes, not weeks"
- Create curiosity: "See the 3-minute demo video on our website"

# About Agentuity

A cloud platform that lets companies deploy AI agents with one command instead of complex infrastructure setup. It connects different AI frameworks (CrewAI, LangChain, custom tools) so teams can use what they prefer without integration headaches.

# Target Person

${JSON.stringify(person)}

# Summary

${JSON.stringify(data.summary)}`,
		});

		return resp.json(result.object);
	} catch (error) {
		ctx.logger.error("Error running agent:", error);

		return resp.text("Sorry, there was an error processing your request.");
	}
}
