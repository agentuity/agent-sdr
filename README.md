<div align="center">
    <img src="https://raw.githubusercontent.com/agentuity/cli/refs/heads/main/.github/Agentuity.png" alt="Agentuity" width="100"/> <br/>
    <strong>Build Agents, Not Infrastructure</strong> <br/>
    <br/>
        <a target="_blank" href="https://app.agentuity.com/deploy" alt="Agentuity">
            <img src="https://app.agentuity.com/img/deploy.svg" /> 
        </a>
    <br />
</div>

# 🤖 SDR Agent

This agent takes data from Clay and (1) generates a company fit analysis and (2) generates a custom campaign email to send to individual prospects.

# Overview

Skip all the stuff below and watch this step-by-step walkthrough of how to deploy your own version of this agent.

<iframe width="560" height="315" src="https://www.youtube.com/embed/T4suMYbKuSo?si=myh64mpRmGGdazoa" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Customization

Edit the source code for both agents to customize the prompts for your specific use-case, then deploy your project to Agentuity (`agentuity deploy`). Open each agent in the Agentuity web app and edit the I/O: first remove the default webhooks, then add a new API input. It is _highly_ recommended to add authorization your the API endpoints.

## Analysis Agent Configuration in Clay

The fit analysis agent runs on Companies.

### Step 1: Request

Create a new `HTTP API` enrichment in Clay after you've enriched the company. Edit the HTTP API enrichment and set the `Method` to `POST`, the `Endpoint` to the URL of your `agent-sdr-analysis` agent's API I/O, add the `Headers` for `Content-Type` and (if applicable) `Authorization` (also from the API I/O), and begin populating the `Body`.

The `Body` should be a JSON object with company variables (which can be added via the `/` command), for example:

```
{
    "name": "Cyan",
    "industry": "Healthcare Software",
    "description": "Cyan is a healthcare technology company...",
    "domain": "cyanhealthcaresoftware.com",
    ...
}
```

The more data you pass to the agent from Clay, the better the returned analysis will be. Your JSON structure should be clearly organized and have descriptive names for keys so the agent understands the data you're passing without the need for a schema. The analysis agent has web browsing capabilities, so feel free to include URLs (company website, LinkedIn, etc).

For examples of the above, reference the default examples in the top part of the agent code.

### Step 2: Response

After the `HTTP API` enrichment column is created from the steps above, add 8 new `Text` columns and edit them. In the content area, type `/HTTP API` and choose your returned property (e.g. `primary_messaging`). You can also edit the column names to be more descriptive.

That's it! Pass these new columns along to the email agent in the next steps.

## Email Agent Configuration in Clay

The email agent runs on People.

### Step 1: Request

Create a new `HTTP API` enrichment in Clay after you've enriched both the company and person. Edit the HTTP API enrichment and set the `Method` to `POST`, the `Endpoint` to the URL of your `agent-sdr-email` agent's API I/O, add the `Headers` for `Content-Type` and (if applicable) `Authorization` (also from the API I/O), and begin populating the `Body`.

The `Body` should be a JSON object with variables (which can be added via the `/` command), for example:

```
{
    "person": {
        "first_name": "Jane Doe",
        "role": "CTO",
        "company": "Cyan, Inc.",
        ...
    },
    "prompt": "Be formal, but excited!...",
    "analysis": {
        "prospect_fit": "Cyan is a behavioral health and technology company that...",
        ...
    }
}
```

The more data you pass to the agent from Clay, the better the returned email body content will be. Your `person` JSON structure should be clearly organized and have descriptive names for keys so the agent understands the data you're passing without the need for a schema.

You can also set a `prompt` property which contains information specific to the email campaign you're generating. It is suggested you use Markdown, and specify exactly what your parameters are for each part of the email.

Finally, you should include `analysis`, which can contain any information you want about the company or the person you're targeting; we recommend using the included `agent-sdr-analysis` agent, but you can generate it however you wish. The data should include information like prospect fit, pain points, or key focus areas for the pitch. As with the `person` property, using descriptive key names is helpful.

For examples of the above, reference the default examples in the top part of the agent code.

### Step 2: Response

After the `HTTP API` enrichment column is created from the steps above, add 5 new `Text` columns and edit them. In the content area, type `/HTTP API` and choose your returned property (e.g. `subject`). You can also edit the column names to be more descriptive. These are the columns that you will pass to your email campaign platform.

That's it! You can now use the email content in your workflows.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Bun**: Version 1.2.4 or higher

## 🚀 Getting Started

### Authentication

Before using Agentuity, you need to authenticate:

```bash
agentuity login
```

This command will open a browser window where you can log in to your Agentuity account.

### Creating a New Agent

To create a new agent in your project:

```bash
agentuity agent new
```

Follow the interactive prompts to configure your agent.

### Development Mode

Run your project in development mode with:

```bash
agentuity dev
```

This will start your project and open a new browser window connecting your agent to the Agentuity Console in DevMode, allowing you to test and debug your agent in real-time.

## 🌐 Deployment

When you're ready to deploy your agent to the Agentuity Cloud:

```bash
agentuity deploy
```

This command will bundle your agent and deploy it to the cloud, making it accessible via the Agentuity platform.

## 📚 Project Structure

```
├── agents/             # Agent definitions and implementations
├── node_modules/       # Dependencies
├── package.json        # Project dependencies and scripts
└── agentuity.yaml      # Agentuity project configuration
```

## 🔧 Configuration

Your project configuration is stored in `agentuity.yaml`. This file defines your agents, development settings, and deployment configuration.

## 📖 Documentation

For comprehensive documentation on the Agentuity JavaScript SDK, visit:
[https://agentuity.dev/SDKs/javascript](https://agentuity.dev/SDKs/javascript)

## 🆘 Troubleshooting

If you encounter any issues:

1. Check the [documentation](https://agentuity.dev/SDKs/javascript)
2. Join our [Discord community](https://discord.gg/agentuity) for support
3. Contact the Agentuity support team

## 📝 License

This project is licensed under the terms specified in the LICENSE file.
