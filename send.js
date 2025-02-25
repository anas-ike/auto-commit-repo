const fs = require("fs");
const path = require("path");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "send",
  description: "Sends all files from the ./files directory to the current channel",
  category: "UTILITY",
  botPermissions: ["AttachFiles"],
  userPermissions: ["AttachFiles"],
  command: {
    enabled: true,
  },
  slashCommand: {
    enabled: true,
  },

  async messageRun(message) {
    const response = await sendFiles(message.channel);
    return message.safeReply(response);
  },

  async interactionRun(interaction) {
    const response = await sendFiles(interaction.channel);
    await interaction.followUp(response);
  },
};

async function sendFiles(channel) {
  const directoryPath = path.join(__dirname, "files");

  try {
    const files = fs.readdirSync(directoryPath);
    if (files.length === 0) return "No files found in the directory.";

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      await channel.send({ files: [filePath] });
    }

    return "Successfully sent all files.";
  } catch (error) {
    console.error(error);
    return "Failed to send files. Ensure the directory exists and has readable files.";
  }
}
