const { Telegraf, Markup } = require("telegraf")
const dotenv = require("dotenv")
const fs = require("fs")
const path = require("path")

//Load environment variables
dotenv.config()

//create new bot instance
const bot = new Telegraf(process.env.BOT_TOKEN)

//start command handler
bot.command("start", (ctx) => {
    ctx.reply(
        "Welcome to the magic 8 ball app\n\n" +
            "/guide - to see guide on app\n" +
            "/help - to see all available commands"
    )
})

//guide command handler
bot.command("guide", (ctx) => {
    ctx.reply("Note Yet!")
})

//help command handler
bot.command("help", (ctx) => {
    const availableCommands = [
        "/start - start bot",
        "/guide - guide on how to use app",
        "/help - show available commands\n",
        "/q + [question] - ask a question to the app",
        "/8ball - get an answer thru a button",
    ]

    ctx.reply(`Here are the available commands: \n${availableCommands.join("\n")}`)
})

//question handler
bot.command("q", async (ctx) => {
    const userId = ctx.from.id
    const userTracking = loadUserTracking()
    const rest = 5000 //5 secs

    //Check if the user has asked a question in the last x seconds
    if (userTracking[userId] && Date.now() - userTracking[userId] < rest) {
        const remainingTime = Math.ceil((rest - (Date.now() - userTracking[userId])) / 1000)
        ctx.reply(`I'm taking a rest in ${remainingTime} secs, ask me again later`)
    } else {
        const array = ctx.update.message.text.split("/q ")

        if (array.length === 1) {
            ctx.reply("Please ask a question after '/q ' + message")
        } else {
            const question = array[1]
            const answer = getRandomAnswer()

            ctx.reply(`Answer to your question "${question}" \n\n ${answer}`)
        }

        //Update user tracking data
        userTracking[userId] = Date.now()
        saveUserTracking(userTracking)
    }
})

bot.command("8ball", async (ctx) => {
    const userId = ctx.from.id
    const userTracking = loadUserTracking()
    const rest = 5000 //5 secs

    //Check if the user has asked a question in the last x seconds
    if (userTracking[userId] && Date.now() - userTracking[userId] < rest) {
        const remainingTime = Math.ceil((rest - (Date.now() - userTracking[userId])) / 1000)
        ctx.reply(`I'm taking a rest in ${remainingTime} secs, ask me again later`)
    } else {
        //Create a new inline keyboard
        const inlineKeyboard = Markup.inlineKeyboard([
            Markup.button.callback("Get Answer", "answer"),
        ])

        //reply
        ctx.reply("Say or Think out load your question and click: ", inlineKeyboard)

        //Update user tracking data
        userTracking[userId] = Date.now()
        saveUserTracking(userTracking)
    }
})

//callback function
bot.on("callback_query", async (ctx) => {
    if (ctx.callbackQuery.data == "answer") {
        answer = getRandomAnswer()
        ctx.reply(`Answer:\n\n ${answer}`)
    }
})

//RNG to get answer
function getRandomAnswer() {
    const answers = JSON.parse(fs.readFileSync("answers.json"))

    //total 100
    const percentages = {
        yes: 15,
        yesMaybe: 15,
        no: 15,
        noMaybe: 15,
        sarcastic: 20,
        witty: 20,
    }

    const totalPercentage = Object.values(percentages).reduce(
        (sum, percentage) => sum + percentage,
        0
    )
    const random_number = Math.floor(Math.random() * totalPercentage) + 1

    let category
    let accumulatedPercentage = 0
    for (const [key, percentage] of Object.entries(percentages)) {
        accumulatedPercentage += percentage
        if (random_number <= accumulatedPercentage) {
            category = key
            break
        }
    }

    const response =
        answers[category].response[Math.floor(Math.random() * answers[category].response.length)]
    return response
}

function saveUserTracking(userTracking) {
    const filePath = path.join(__dirname, "usertrack.json")

    try {
        const data = JSON.stringify(userTracking, null, 2)
        fs.writeFileSync(filePath, data, "utf-8")
    } catch (error) {
        console.error("Error saving user tracking:", error)
    }
}

function loadUserTracking() {
    const filePath = path.join(__dirname, "usertrack.json")

    try {
        const fileContents = fs.readFileSync(filePath, "utf-8")
        return JSON.parse(fileContents)
    } catch (error) {
        console.log("File error: ", error)
        return {}
    }
}

//start the bot
bot.launch()
