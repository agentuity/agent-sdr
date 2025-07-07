import type { AgentContext, AgentRequest, AgentResponse } from "@agentuity/sdk";
import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

const RequestSchema = z.object({
	person: z.record(z.any()),
	prompt: z.string(),
	analysis: z.record(z.any()),
});

const WelcomeExamplePrompt = `You are writing the first email in an outreach sequence to CTO-level executives at qualified prospect companies to introduce them to Agentuity.

## Common CTO Pain Points to Address

- Infrastructure complexity slowing AI development
- Managing multiple AI frameworks and tools
- Scaling AI operations without massive DevOps overhead
- Time-to-market pressure for AI features
- Team productivity bottlenecks
- Technical debt from custom AI infrastructure
- Integration challenges between different AI systems

Remember: Write like you're genuinely trying to help solve their problem, not sell them something. Customize based on their specific role and location.

# Message Components

## Subject Line

- Keep it short: 3-5 words maximum
- Use all lowercase letters
- Sound like internal communication, not marketing
- Reference their specific problem or lead magnet
- Avoid: capitals, exclamation points, sales language, buzzwords

## Opening Personalization

- Add greetings and first name
- 1-2 sentences maximum
- Sound genuine and conversational
- Reference their company and what they're building
- Acknowledge likely challenges without being presumptuous
- No corporate speak or jargon
- Make it feel personal and researched

## Value Proposition

- 2-3 sentences explaining Agentuity and the free development offer
- Connect directly to their specific problems
- Position free development as solving their immediate pain point
- No buzzwords or marketing language
- Focus on practical benefits they'll care about
- Use positioning like: "Custom agent build," "Proof of concept development," "Complimentary automation build"

## Call-to-Action

- Lead with the free development offer
- Specify time commitment (15 minutes for initial chat)
- Make it about them ("build you a custom agent")
- Offer flexibility ("call" or "quick chat")
- Remove friction with easy response options
- Add geographic customization based on their location

## PS (Postscript)

- Start with "P.S."
- Reinforce the free development offer
- Add urgency: "Limited development slots," "This month only"
- Provide social proof: "Built 50+ custom agents"
- Tease specific benefit: "See your agent running in 48 hours"
- Create curiosity or remove friction: "No strings attached," "Keep the agent regardless"

## Geographic Customization

- If the person is in the South Florida metro area (Palm Beach, Miami, etc), in addition to the demo call-to-action, also offer to meet in-person
- If the person is in the Austin metro area, offer to have them meet with co-founder Jeff

If offering to meet 'in person', make sure to use that phrase and note that the person is in the same city as the co-founder (Rick for South Florida, Jeff for Austin).`;

export const welcome = () => {
	return {
		welcome:
			"Hi, I'm your AI SDR that specializes in generating personalized email templates for qualified Agentuity prospects. You can send me a JSON object containing information about a person and I'll respond with a one-of-a-kind email message for you to send the prospect.",
		prompts: [
			{
				data: {
					person: {
						first_name: "Jane",
						last_name: "Doe",
						location: "Austin, Texas, United States",
						company: "Cyan",
						role: "CTO",
					},
					prompt: WelcomeExamplePrompt,
					analysis: {
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
						first_name: "John",
						last_name: "Smith",
						location: "Bellevue, Washington, United States",
						company: "Outreach",
						role: "CTO",
					},
					prompt: WelcomeExamplePrompt,
					analysis: {
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
- Use proper casing, except for the subject line
- Be honest about what Agentuity does - don't oversell
- Make it feel personal - like you actually researched their company
- Focus on genuine value - what will actually help them
- Count words carefully - around 125 words total

# About Agentuity

A cloud platform that lets companies deploy AI agents with one command instead of complex infrastructure setup. It connects different AI frameworks (CrewAI, LangChain, custom tools) so teams can use what they prefer without integration headaches.

# Target Person

${JSON.stringify(person)}

# Analysis

${JSON.stringify(data.analysis)}`,
		});

		return resp.json(result.object);
	} catch (error) {
		ctx.logger.error("Error running agent:", error);

		return resp.text("Sorry, there was an error processing your request.");
	}
}
