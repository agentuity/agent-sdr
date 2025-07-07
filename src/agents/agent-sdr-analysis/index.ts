import type { AgentContext, AgentRequest, AgentResponse } from "@agentuity/sdk";
import { groq } from "@ai-sdk/groq";
import { openai } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { z } from "zod";

const RequestSchema = z.record(z.any());

export const welcome = () => {
	return {
		welcome:
			"Hi, I'm your AI SDR that specializes in qualifying companies for Agentuity. You can send me a JSON object containing information about a company and I'll determine if they're a good prospect and tell you why.",
		prompts: [
			{
				data: {
					name: "Cyan",
					industry: "Healthcare Software",
					description: `Cyan is a healthcare technology company specializing in AI-powered electronic health record solutions for behavioral health providers. We automate clinical documentation and streamline workflows through advanced AI capabilities, including large language models that generate comprehensive clinical notes. Our SaaS platform empowers healthcare providers to focus on patient care while our intelligent systems handle the administrative burden. At Cyan, we're transforming behavioral health practice management through cutting-edge technology that enhances both provider efficiency and patient outcomes.`,
				},
				contentType: "application/json",
			},
			{
				data: {
					name: "Mom & Pop Bakery",
					industry: "Bakery",
					description: `Mom & Pop Bakery is a small bakery that makes delicious bread and pastries. M&PB is located in a small town in the Midwest.`,
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

		// Perform high-level fit analysis
		const fit = await generateText({
			model: openai.responses("gpt-4o-mini"),
			tools: {
				web_search_preview: openai.tools.webSearchPreview({
					searchContextSize: "low",
				}),
			},
			toolChoice: { type: "tool", toolName: "web_search_preview" },
			prompt: `You are analyzing companies to determine if they are good prospects for Agentuity, a cloud platform purpose-built for deploying, managing, and scaling AI agents. Agentuity enables seamless communication between AI agents built with different frameworks (CrewAI, LangChain, custom implementations) and simplifies deployment without complex infrastructure setup.

Your task is to analyze the provided company information and determine:
- Is this company a prospect, yes or no?
- If yes, why are they a good prospect?

# Prospect Criteria

## HIGH-FIT PROSPECTS (Output: Yes)
- AI/ML Companies: Building AI agents, chatbots, or automation tools
- Software Development Companies: Especially those working on AI integrations
- Enterprise Software Companies: Implementing AI-powered features
- Consulting Firms: Specializing in AI/automation implementations
- Tech Startups: Building AI-first products or services
- SaaS Companies: Adding AI capabilities to existing platforms
- Digital Agencies: Offering AI-powered solutions to clients
- Companies with AI Initiatives: Actively hiring AI engineers, data scientists, or ML engineers

## MODERATE-FIT PROSPECTS (Evaluate case-by-case)
- Large Enterprises: With dedicated AI/digital transformation teams
- Customer Service Companies: Implementing AI chatbots or automation
- E-commerce Platforms: Using AI for personalization/recommendations
- Financial Services: Implementing AI for fraud detection, risk analysis

## LOW-FIT PROSPECTS (Output: No)
- Traditional brick-and-mortar businesses without tech focus
- Companies with no AI initiatives or digital transformation plans
- Very small businesses (<10 employees) without technical capabilities
- Industries with minimal AI adoption (traditional manufacturing, retail, etc.)

# Analysis Framework

- Start with the Primary Industry to get context
- Read the LinkedIn Description carefully for AI/ML mentions or tech sophistication signals
- Consider the Company Name for obvious tech/AI indicators
- Use Company Domain context if additional clarity is needed
- If uncertain between Yes/No, err on the side of "No" - we want high-quality prospects only
- Write your reasoning as a flowing paragraph that connects the different factors rather than separate bullet points

Remember:
- Agentuity is for companies actively building or deploying AI agents
- The value proposition is simplified infrastructure and cross-framework compatibility
- Focus on companies that would benefit from deploying multiple AI agents or complex AI systems

## Step 1: Company Classification

Analyze the four input fields for these signals:
- Company Name: Look for AI, tech, or automation keywords
- Company Domain: Visit if needed to understand their offerings
- LinkedIn Description: Key source for AI/ML initiatives, technology mentions, and company focus
- Primary Industry: Assess industry AI adoption potential

## Step 2: Fit Assessment

Rate the prospect fit based on:
- Technology Readiness: Do they have AI/ML initiatives?
- Scale Potential: Are they likely to deploy multiple AI agents?
- Technical Complexity: Would they benefit from simplified deployment?
- Growth Stage: Are they scaling AI operations?

# Output

- If not a fit, RETURN "No" AND NOTHING ELSE.
- If a fit, return the reasoning and no other text; the reasoning should be concise and explain 2-3 specific reasons based on their business model, technology focus, or AI initiatives; you do not need to include "Yes". DO NOT INCLUDE URLs. RETURN ONLY ONE PARAGRAPH.

## Example Outputs

- For AI Software Company:
"This company is building AI-powered automation tools and would benefit significantly from Agentuity's simplified agent deployment infrastructure. As a technology-focused business, they're likely deploying multiple AI agents across different frameworks and would value the cross-framework compatibility. Their growing business model indicates they need scalable AI infrastructure that can evolve with their expanding operations."

- For Traditional Retail Company:
"No"

# Target Company

${JSON.stringify(data)}`,
		});

		if (fit.text.toLowerCase().trim() === "no") {
			return resp.text("");
		}

		// If prospect is a fit, determine the best messaging angle and focus points
		const analysis = await generateObject({
			model: groq("llama-3.3-70b-versatile"),
			schema: z.object({
				primary_messaging: z.string(),
				key_focus_points: z.array(z.string()).length(3),
				pain_points: z.array(z.string()).length(3),
			}),
			prompt: `You are creating personalized outreach messaging for qualified Agentuity prospects. Agentuity is a cloud platform purpose-built for deploying, managing, and scaling AI agents. It enables seamless communication between AI agents built with different frameworks (CrewAI, LangChain, custom implementations) and simplifies deployment without complex infrastructure setup.

Your task is to:
- Analyze the prospect information and create a targeted messaging strategy that includes:
- Primary Messaging Angle: The main hook/value proposition
- Key Focus Points: 2-3 specific benefits to emphasize
- Pain Points to Address: What problems Agentuity solves for them

# Instructions for Analysis
- Read the prospect qualification reason to understand their specific AI use case
- Identify their company stage (startup, growth, enterprise) from the description
- Determine their primary AI challenge based on industry and company description
- Match the messaging angle to their most likely pain point and business priority
- Keep focus points specific to their situation, not generic benefits
- Make pain points relatable to their actual business context

# Key Messaging Principles
- Lead with business outcomes, not technical features
- Address their specific industry or use case
- Emphasize speed and simplicity for startups, scalability for enterprises
- Connect Agentuity's capabilities to their growth goals
- Use language that matches their technical sophistication level
- Focus on competitive advantages they can gain

# Agentuity's Core Value Propositions

- Infrastructure Simplification
- Deploy AI agents with a single command
- No complex IAM, security groups, or load balancers to configure
- Focus on building agents, not managing infrastructure
- Framework Flexibility
- Enable seamless communication between agents built with different tools
- Break down framework barriers (CrewAI, LangChain, custom implementations)
- Avoid vendor lock-in
- Scalability & Management
- Purpose-built for scaling AI agent operations
- Comprehensive toolkit with CLI, web interface, and pre-built agent library
- Intelligent routing system for multi-channel deployment
- Speed to Market
- Rapid iteration with local dev mode
- Quick deployment and testing
- Reduce time from development to production

# Messaging Angles by Company Type

## AI/ML Startups
- Focus: Speed and simplicity to accelerate growth
- Pain Points: Complex infrastructure slowing down development, limited resources for DevOps

## Enterprise Software Companies
- Focus: Scalability and integration capabilities
- Pain Points: Managing multiple AI initiatives, framework compatibility issues

## Consulting Firms
- Focus: Client delivery efficiency and competitive advantage
- Pain Points: Long implementation times, technical complexity limiting client options

## SaaS Companies
- Focus: Seamless integration and enhanced product capabilities
- Pain Points: Adding AI without rebuilding infrastructure, maintaining performance

# Output

- Primary Messaging Angle: One clear, compelling hook tailored to their specific situation - what's the main reason they should care about Agentuity
- Key Focus Points: 3 specific benefits that align with their business model and needs, written as value statements
- Pain Points to Address: 3 current challenges they likely face that Agentuity directly solves, based on their company profile

## Example Outputs

- For AI Automation Startup:
Primary Messaging Angle: Accelerate your AI agent development by eliminating infrastructure complexity so your team can focus on building innovative automation solutions instead of managing cloud configurations.
Key Focus Points: Deploy new AI agents in minutes instead of weeks with single-command deployment. Enable your agents built with different frameworks to work together seamlessly without rebuilding your entire stack. Scale your operations without hiring additional DevOps engineers or cloud specialists.
Pain Points to Address: Stop wasting valuable development time on IAM policies and load balancer configurations. Eliminate the friction of deploying agents across different environments. Avoid the technical debt of building custom infrastructure that becomes harder to maintain as you grow.

- For Enterprise Software Company:
Primary Messaging Angle: Unify your AI initiatives across different teams and frameworks with a single platform that scales with your enterprise needs while maintaining security and compliance standards.
Key Focus Points: Enable seamless collaboration between AI agents regardless of the frameworks your different teams prefer. Provide enterprise-grade infrastructure without the complexity of traditional cloud providers. Accelerate time-to-market for AI-powered features across your product suite.
Pain Points to Address: Eliminate silos between teams using different AI frameworks and tools. Reduce the overhead of managing multiple deployment pipelines for various AI initiatives. Stop losing competitive advantage due to slow AI feature rollouts caused by infrastructure bottlenecks.

# Target Company

${JSON.stringify(data)}`,
		});

		return resp.json({
			fit: fit.text,
			...analysis.object,
		});
	} catch (error) {
		ctx.logger.error("Error running agent:", error);

		return resp.text("Sorry, there was an error processing your request.");
	}
}
