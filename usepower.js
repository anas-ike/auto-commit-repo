const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "usepower",
  description: "Use a power and receive a random effect",
  category: "UTILITY",
  command: {
    enabled: true,
    usage: "",
    minArgsCount: 0,
  },

  async messageRun(message) {
    const allowedRoleId = "1204928350854975508";
    const logChannelId = "1259920170928046152";
    const ALLOWED_CHANNELS = ["1259802322402279457", "1259802322402279457"];

    // Power spawn rates (0 = never, 100 = highest probability)
    const effects = [
      { name: "Revive", rate: 20 },
      { name: "Twice", rate: 15 },
      { name: "Jackpot", rate: 10 },
      { name: "Halves", rate: 25 },
      { name: "Immortal", rate: 5 },
      { name: "Swap", rate: 10 },
      { name: "Elimination", rate: 5 },
      { name: "Mirrornt", rate: 0 }, // Disabled (0% spawn rate)
      { name: "Freeze", rate: 5 },
      { name: "Isolate", rate: 10 },
      { name: "Blast", rate: 15 },
      { name: "Poison", rate: 10 },
      { name: "Cure", rate: 20 },
      { name: "Desire", rate: 50 },
    ];

    // Check if the command is used in allowed channels
    if (!ALLOWED_CHANNELS.includes(message.channel.id)) {
      const response = await message.channel.send("This command can only be used in specific channels.");
      setTimeout(() => {
        response.delete();
        message.delete();
      }, 5000);
      return;
    }

    // Check if the user has the allowed role
    if (!message.member.roles.cache.has(allowedRoleId)) {
      const replyMessage = await message.reply("You do not have permission to use this command.");
      setTimeout(() => {
        replyMessage.delete();
        message.delete();
      }, 5000);
      return;
    }

    // Remove the allowed role from the user
    await message.member.roles.remove(allowedRoleId);

    // Weighted random selection
    const weightedEffects = [];
    effects.forEach(effect => {
      for (let i = 0; i < effect.rate; i++) {
        weightedEffects.push(effect.name);
      }
    });

    if (weightedEffects.length === 0) {
      await message.reply("No powers are available.");
      return;
    }

    const randomEffect = weightedEffects[Math.floor(Math.random() * weightedEffects.length)];

    // Send the effect to the user via DM
    try {
      await message.author.send(`You have received the effect: ${randomEffect}`);
    } catch (error) {
      console.error(`Failed to send DM to ${message.author.tag}: ${error}`);
    }

    // Log the effect in the specified channel
    const logChannel = message.guild.channels.cache.get(logChannelId);
    if (logChannel) {
      await logChannel.send(`${message.author.tag} used the power and received the effect: ${randomEffect}`);
    }

    // Confirm in the same channel
    const confirmationMessage = await message.reply(`You have used the power. Check your DM for the effect.`);
    setTimeout(() => {
      confirmationMessage.delete();
      message.delete();
    }, 10000);
  },
};
