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

This agent takes an HTTP request from Clay containing profile data about a person and generates a customized version of an email template, returning the email body to Clay for use in later workflows.

## 🌈 Clay Configuration

After making any desired changes to the agent code (such as customizing the email template and prompt instructions), deploy your agent to Agentuity (`agentuity deploy`). Navigate to the agent's detail page in Agentuity and create a new `API` IO; you can remove the pre-existing `Webhook` IO. It is _highly_ recommended to add authorization to the API endpoint.

Create a new `HTTP API` enrichment in Clay after you've enriched both the company and person. Edit the HTTP API enrichment and set the `Method` to `POST`, the `Endpoint` to the URL of your agent's API IO, add the `Headers` for `Content-Type` and (if applicable) `Authorization` (also from the API IO), and begin populating the `Body`.

The `Body` should be a JSON object with variables (which can be added via the `/` command), for example:

```
{
    "name": {Full Name},
    "company": {
        "name": {Company Name},
        "description": {Company Description}
    }
}
```

The more data you pass to the agent from Clay, the better the returned email body content will be. Your JSON structure should be clearly organized and have descriptive names for keys so the agent understands the data you're passing without the need for a schema.

Finally, after the `HTTP API` enrichment column, add a new `Text` column and edit it. In the content area, type `/HTTP API` and save. You can also edit the column name to be more descriptive.

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
