require("dotenv").config();
const mongoose = require("mongoose");
const Discord = require("discord.js");
const Contribution = require("./models/contributionsSchema"); // Adjust the path if necessary
const WOCUser = require("./models/WOCUser")
// MongoDB connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log("Error: " + err);
    });

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.MessageContent,
    ]
});

client.login(process.env.BOT_TOKEN);

client.on("ready", () => {
    console.log("Bot started");
});

client.on("messageCreate", async (message) => {
    if (message.mentions.has(client.user.id)) {
        if ((message.content.split(" ")).indexOf("help") !== -1) {
            const block = Discord.userMention(client.user.id);
            return message.channel.send(
                `**To grant points, use the following syntax:**\n\`\`\`\n${block} grant <github_id> <link_to_PR> <number_of_points>\`\`\``
            );
        }

        const roles = message.guild.roles.cache.filter(role => role.name === "Mentor");
        const mentorRole = roles.first();

        if (mentorRole && message.member.roles.cache.has(mentorRole.id)) {
            const data = message.content.split(" ");
            const command = data[1];
            const github_id = data[2];
            const link_PR = data[3];
            const points = parseInt(data[4], 10);

            if (command !== "grant" || !github_id || !link_PR || isNaN(points)) {
                return message.channel.send("Invalid command syntax! Use `@WOC Point Bot help` for the correct syntax.");
            }

            try {
                // Find or create the contribution object
                const contribution = await Contribution.findOne({ link: link_PR, points: points });
                if (!contribution) {
                    // If the contribution doesn't exist, create it
                    const newContribution = new Contribution({ link: link_PR, points: points });
                    await newContribution.save();
                }

                // Find the user by GitHub ID
                let user = await WOCUser.findOne({ githubId: github_id });
                if (!user) {
                    // If the user doesn't exist, create it
                    user = new WOCUser({ githubId: github_id });
                }

                // Push the contribution reference to the user's contributions array
                user.points += points;
                user.contributions.push(contribution);
                await user.save();

                return message.channel.send(`Successfully added ${points} points to ${github_id}'s contributions.`);
            } catch (err) {
                console.error("Error updating contributions:", err);
                return message.channel.send("An error occurred while updating contributions. Please try again.");
            }
        } else {
            return message.channel.send("You do not have the required permissions to grant points.");
        }
    }
});
