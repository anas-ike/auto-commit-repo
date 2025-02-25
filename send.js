const { ApplicationCommandOptionType } = require("discord.js");
const fs = require("fs");
const path = require("path");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "send",
  description: "Add all emojis from the ./file directory to the server",
  cooldown: 10,
  category: "UTILITY",
  botPermissions: ["ManageEmojisAndStickers"],
  command: {
    enabled: true,
  },
  slashCommand: {
    enabled: true,
  },

  async messageRun(message) {
    if (!message.guild) return message.safeReply("This command can only be used in a server.");
    const response = await addEmojis(message.guild);
    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    if (!interaction.guild) return interaction.followUp("This command can only be used in a server.");
    await interaction.followUp("Adding emojis... Please wait.");
    const response = await addEmojis(interaction.guild);
    await interaction.editReply(response);
  },
};

async function addEmojis(guild) {
  const emojiPath = path.join(__dirname, "../file");

  if (!fs.existsSync(emojiPath)) return "The ./file directory does not exist.";

  const files = fs.readdirSync(emojiPath).filter((file) => file.match(/\.(png|jpg|jpeg|gif)$/i));

  if (files.length === 0) return "No valid emoji images found in ./file.";

  let added = 0,
    failed = 0;

  for (const file of files) {
    try {
      const emojiName = path.parse(file).name;
      const emojiFilePath = path.join(emojiPath, file);
      await guild.emojis.create({ attachment: emojiFilePath, name: emojiName });
      added++;
    } catch (error) {
      console.error(`Failed to add ${file}:`, error);
      failed++;
    }
  }

  return `✅ Added ${added} emojis.\n❌ Failed: ${failed}.`;
}
