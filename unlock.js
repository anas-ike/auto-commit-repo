const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require('discord.js');

/**  
 * @type {import("@structures/Command")}  
 */

module.exports = {
    name: "unlock",
    description: "Unlocks a channel",
    category: "MODERATION",
    userPermissions: ["ManageChannels"],

    command: {
        enabled: true,
        usage: "<channel>",
        minArgsCount: 1,
    },

    slashCommand: {
        enabled: true,
        ephemeral: true,
        options: [
            {
                name: "channel",
                description: "Select a channel to unlock",
                type: ApplicationCommandOptionType.Channel,
                required: true,
            },
        ],
    },

    async messageRun(message, args) {
        const channel = message.mentions.channels.first();
        if (!channel) return message.channel.send("Please enter a channel to unlock.");

        await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
            [PermissionsBitField.Flags.SendMessages]: true, // Explicitly allowing messages
        });

        const embed = new EmbedBuilder()
            .setTitle("✅ **Channel Unlocked** ✅")
            .setDescription(`**Channel** ${channel} **was successfully unlocked by a moderator**`)
            .setColor("#00ff00");

        channel.send({ embeds: [embed] });
    },

    async interactionRun(interaction) {
        const channel = interaction.options.getChannel("channel");
        if (!channel) return interaction.reply({ content: "Invalid channel.", ephemeral: true });

        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            [PermissionsBitField.Flags.SendMessages]: true,
        });

        const embed = new EmbedBuilder()
            .setTitle("✅ **Channel Unlocked** ✅")
            .setDescription(`**Channel** ${channel} **was successfully unlocked by a moderator**`)
            .setColor("#00ff00");

        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
