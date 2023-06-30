# Magic 8 Ball Telegram Bot

This is a Telegram bot that acts as a Magic 8 Ball, providing answers to user's questions. The bot allows users to ask questions directly or get answers through a button click.

## Installation

1. Clone the repository using Git:

```sh
git clone https://github.com/SilverJROM/8BallApp.git
```

2. Navigate to the project directory:

```sh
cd 8BallApp
```

3. Install the dependencies using npm:

```sh
npm install
```

4. Create a `.env` file in the project directory and add your Telegram bot token. Example:

```sh
BOT_TOKEN=your_bot_token_here
```

5. Create an `answers.json` file in the project directory and add your desired answers. Example:

```json
{
    "yes": {
        "response": ["Yes, definitely.", "It is certain.", "Without a doubt."]
    },
    "no": {
        "response": ["No way!", "Outlook not so good.", "Very doubtful."]
    },
    "sarcastic": {
        "response": ["Oh, absolutely!", "Of course... not.", "You must be kidding."]
    },
    "witty": {
        "response": ["Try again later.", "Ask a simpler question.", "You already know the answer."]
    }
}
```

## Usage

Start the bot by running the following command:

```sh
node app.js
```

Open your Telegram app and search for your bot by its username.

Start a conversation with the bot and use the available commands:

```sh
/start - Start the bot and get a list of available commands.
/guide - Get a guide on how to use the app.
/help - See all available commands.
/q + [question] - Ask a question to the app.
/8ball - Get an answer through a button click.
```
