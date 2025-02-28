const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require('discord.js');

/** 
 * @type {import("@structures/Command")}  
 */
module.exports = {
    name: "lock",
    description: "Blocks the channel",
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
                description: "Select a channel to lock",
                type: ApplicationCommandOptionType.Channel,
                required: true,
            },
        ],
    },

    async messageRun(message, args) {
        const channel = message.mentions.channels.first();
        if (!channel) return message.channel.send("Bitte gib einen Kanal an, der gesperrt werden soll.");

        await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
            [PermissionsBitField.Flags.SendMessages]: false,
        });

        const embed = new EmbedBuilder()
            .setTitle("🛑 **Channel locked** 🛑")
            .setDescription(`**Channel** ${channel} **has been locked**`)
            .setColor("#ff0000");

        channel.send({ embeds: [embed] });
    },

    async interactionRun(interaction) {
        const channel = interaction.options.getChannel("channel");
        if (!channel) return interaction.reply({ content: "Invalid channel.", ephemeral: true });

        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            [PermissionsBitField.Flags.SendMessages]: false,
        });

        const embed = new EmbedBuilder()
            .setTitle("🛑 Channel locked 🛑")
            .setDescription(`Channel ${channel} has been locked`)
            .setColor("#ff0000");

        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
