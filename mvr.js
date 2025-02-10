const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
  name: "mvr",
  description: "Move a member to a voice channel",
  category: "MODERATION",
  botPermissions: [],
  userPermissions: [],
  command: {
    enabled: true,
    usage: "<@member> <channelName>",
    minArgsCount: 2,
  },

  async messageRun(message, args) {
    // Array of allowed role IDs
    const allowedRoleIDs = [
      "1154050942216454276",
      "1161385113804869734",
      "1154051201474756689",
      "1154335679275343872",
      "1155108097061298288",
      "1153983012543930438",
      "1161371916179886210",
      "1154050942216454276",
      "1161385113804869734",
      "1153984539509665802",
      "1155108097061298288",
      "1159776732467961907",
      "1154463227867041822",
      // Add other role IDs here
    ];

    // Check if the user has any allowed role
    const hasAllowedRole = message.member.roles.cache.some(role => allowedRoleIDs.includes(role.id));

    // If the user doesn't have an allowed role, prevent command execution
    if (!hasAllowedRole) {
      return;
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply("Please mention a valid member.");

    const channelName = args[1];
    const channelId = getVoiceChannelIdByName(channelName);

    if (!channelId) {
      return message.reply("Voice channel not found.");
    }

    if (!member.voice.channel) {
      return message.reply("The mentioned member is not in a voice channel.");
    }

    const button = new ButtonBuilder()
      .setCustomId("move_member")
      .setLabel("less go")
      .setStyle(1);

    const row = new ActionRowBuilder().addComponents(button);

    const confirmationMessage = await message.reply({
      content: `<@${member.user.id}>, are you sure you want to be moved to <#${channelId}>?`,
      components: [row],
    });

    const filter = (i) => i.customId === "move_member" && i.user.id === member.id;

    const collector = confirmationMessage.createMessageComponentCollector({ filter, time: 30000 });

    collector.on('collect', async i => {
      try {
        // Move the member to the target channel
        await member.voice.setChannel(channelId);
        confirmationMessage.edit(`Moved ${member.user.username} to ${channelName}`, {
          components: [],
        });
      } catch (error) {
        console.error(`Failed to move ${member.user.username}: ${error}`);
        confirmationMessage.edit(`Failed to move ${member.user.username}`, {
          components: [],
        });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        confirmationMessage.edit("Confirmation timed out.", { components: [] });
      }
    });
  },
};

function getVoiceChannelIdByName(channelName) {
  const voiceChannels = {
    au1: "115355929289347080",
    au2: "1153559554668367932",
    au3: "1153559611681538080",
    au4: "1153559790144995339",
    br1: "1175437893641191504",
    br2: "1153561583302230078",
    br3: "1164264972499558522",
    br4:"1174692092266684538",
    mc1: "1154370516317118494",
    mc2: "1154654973066481664",
    sk: "1153560682088910908",
    cn1: "1156573985027391598",
    cn2: "1160519322117083238",
    tb: "1162486315900747777",
    sb: "1153562776095162378",
    mo: "1153562905627873290",
    ro: "1155225199743082507",
    va: "1155821281946632222",
    cs: "1155935895023792169",
    ch: "1155111642783301713",
    bg: "1153564038303846430",
    sg: "1153564105395949600",
    bw: "1153564181593858129",
    gi: "1154773339743715489",
    vr1:"1160604461660647534",
    vr2:"1154983910107775036",
    og: "1153564396245757983"
    // Add more voice channels here
  };

  return voiceChannels[channelName];
}
