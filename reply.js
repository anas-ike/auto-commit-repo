const {
  cooldown,
  check_dj,
  databasing,
  getPermissionName,
} = require("../handlers/functions");
const client = require("..");
const { PREFIX: botPrefix, emoji } = require("../settings/config");
const { PermissionsBitField, EmbedBuilder } = require("discord.js");

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild || !message.id) return;
  await databasing(message.guildId, message.author.id);
  let settings = await client.music.get(message.guild.id);
  let prefix = settings?.prefix || botPrefix;
  let mentionprefix = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
  );
  if (!mentionprefix.test(message.content)) return;
  const [, nprefix] = message.content.match(mentionprefix);
  const args = message.content.slice(nprefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  if (cmd.length === 0) {
    if (nprefix.includes(client.user.id)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setDescription(
              ` ${emoji.SUCCESS} To See My All Commands Type  \`/help\` or \`${prefix}help\``
            ),
        ],
      });
    }
  }
  const command =
    client.mcommands.get(cmd) ||
    client.mcommands.find((cmds) => cmds.aliases && cmds.aliases.includes(cmd));
  if (!command) return;
  if (command) {
    let queue = client.distube.getQueue(message.guild.id);
    let voiceChannel = message.member.voice.channel;
    let botChannel = message.guild.members.me.voice.channel;
    let checkDJ = await check_dj(client, message.member, queue?.songs[0]);

    // User permission check
    if (
      !message.member.permissions.has(
        PermissionsBitField.resolve(command.userPermissions)
      )
    ) {
      const needPerms = getPermissionName(command.userPermissions);
      const responses = [
        `Aww, you need **${needPerms}** to use this. Too bad! ${emoji.ERROR} 💅`,
        `Sorry, you ain't got the **${needPerms}** power. Better luck next time! ${emoji.ERROR} 😏`,
        `Oops, looks like you’re missing **${needPerms}**. I guess no one told you this command is VIP only. ${emoji.disabled} 🙃`,
        `Nah, you don’t have **${needPerms}**. This command is **exclusive**. ${emoji.stop} 🔒`,
        `**${needPerms}**? You wish. Sorry, not today! ${emoji.stop3} 🚫`,
        `You don’t have the **${needPerms}**? Oh, honey, that’s awkward. ${emoji.ERROR} 😬`,
        `Wow, someone’s a little too bold without **${needPerms}**... better sit down. ${emoji.disabled} 😜`,
        `Does this command look like it’s for the common folk? Nah, you need **${needPerms}** to use it. ${emoji.search} 🧐`,
        `You can't touch this command. Missing **${needPerms}**... try again later. ${emoji.stop3} 😎`,
        `That command is a VIP. **${needPerms}** is your ticket in, and you don't have it. ${emoji.disabled} ✌️`,
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return client.embed(message, randomResponse);
    } 
    // Bot permission check
    else if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.resolve(command.botPermissions)
      )
    ) {
      const needPerms = getPermissionName(command.botPermissions);
      const responses = [
        `Well, guess what? I can’t help you. **${needPerms}** missing! How rude. ${emoji.stop3} 😑`,
        `I’d love to, but apparently, I’m not allowed to have **${needPerms}** in this server. SMH. ${emoji.ERROR} 🙄`,
        `Here’s the thing: I’m blocked from running that command due to missing **${needPerms}**. Ain’t that a shame? ${emoji.disabled} 😏`,
        `I’d totally do that for you, but **${needPerms}**? Yeah, I’m not allowed. ${emoji.stop} 😒`,
        `Not today, honey! No **${needPerms}** for me... not happening. ${emoji.disabled} 💅`,
        `Can’t do it. I don’t have **${needPerms}**. My bad, but the rules are the rules. ${emoji.stop3} 🙄`,
        `Sorry to burst your bubble, but I’m not allowed to execute that. No **${needPerms}** for me. ${emoji.ERROR} 😑`,
        `I would love to help, but no **${needPerms}** for this bot. Guess I’m too cool for this command. ${emoji.ping} 😎`,
        `I can’t, because I’m missing **${needPerms}**. But hey, I’ll still look good doing nothing. ${emoji.bot} 💁‍♀️`,
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return client.embed(message, randomResponse);
    } 
    // Cooldown check
    else if (cooldown(message, command)) {
      const responses = [
        `Chill, you're on cooldown! Try again in \`${cooldown(message, command).toFixed()}\` seconds. ${emoji.time}`,
        `Cool down, superstar! Wait \`${cooldown(message, command).toFixed()}\` more seconds before trying again. ${emoji.time} ⏲️`,
        `Slow down there, you're on cooldown! Try again in \`${cooldown(message, command).toFixed()}\` seconds. ${emoji.time} 🕒`,
        `You’re on cooldown, take a breather and try in \`${cooldown(message, command).toFixed()}\` seconds. ${emoji.time} 😎`,
        `Oh no, you're too fast! Wait \`${cooldown(message, command).toFixed()}\` more seconds. ${emoji.time} ⏳`,
        `Take it easy! You're still on cooldown. Try again in \`${cooldown(message, command).toFixed()}\` seconds. ${emoji.time} 🧘‍♂️`,
        `Not so fast! Wait \`${cooldown(message, command).toFixed()}\` more seconds. Time to relax. ${emoji.time} 🕰️`,
        `You’ve got too much energy, slow down and wait \`${cooldown(message, command).toFixed()}\` seconds. ${emoji.time} ⏳`,
        `Oof, trying to rush? Cooldown’s a thing, wait \`${cooldown(message, command).toFixed()}\` seconds. ${emoji.time} 🕑`,
        `Haha, not today! You're on cooldown for \`${cooldown(message, command).toFixed()}\` more seconds. ${emoji.time} 😜`,
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return client.embed(message, randomResponse);
    } 
    // Voice channel check
    else if (command.inVoiceChannel && !voiceChannel) {
      const responses = [
        `${emoji.ERROR} You're not in a voice channel, darling! Get in one! 🎤`,
        `${emoji.ERROR} You need to join a voice channel first, sweetheart! 🎧`,
        `${emoji.ERROR} Can’t do that without you in a voice channel! Join one. 🎵`,
        `${emoji.ERROR} Whoa, you need to be in a voice channel to use this! 🚶‍♂️`,
        `${emoji.ERROR} Uh-oh, voice channel required! Get in one to continue. 🔊`,
        `${emoji.ERROR} Oops, no voice channel? Try again after you join one. 🎙️`,
        `${emoji.ERROR} You can’t skip the voice channel, honey. Join one. 🎧`,
        `${emoji.ERROR} Gotta be in a voice channel, champ! Get to it. 🎶`,
        `${emoji.ERROR} Yo, no channel, no command. You know the drill. 🎤`,
        `${emoji.ERROR} Uh-oh, looks like you need to join a voice channel first! 🎶`,
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return client.embed(message, randomResponse);
    } 
    // Same voice channel check
    else if (
      command.inSameVoiceChannel &&
      botChannel &&
      !botChannel?.equals(voiceChannel)
    ) {
      const responses = [
        `${emoji.ERROR} You gotta join the same voice channel as me! 💁‍♂️`,
        `${emoji.ERROR} I’m waiting here, join the same voice channel as me! 🕺`,
        `${emoji.ERROR} Sweetheart, we gotta be in the same voice channel for this! 💃`,
        `${emoji.ERROR} Try again when you’re in my channel, okay? 😎`,
        `${emoji.ERROR} I’m not teleporting to you, join my voice channel! 🔊`,
        `${emoji.ERROR} Guess what? Same channel, or nada. Join me! 🎤`,
        `${emoji.ERROR} Oh no, not in my channel? Join up, or no go! 🎶`,
        `${emoji.ERROR} We gotta vibe together in the same channel. Get in here! 🎧`,
        `${emoji.ERROR} No magic teleportation here! Same channel, or nothing. 🎤`,
        `${emoji.ERROR} You wanna use that command? Then come to MY channel! 🎵`,
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return client.embed(message, randomResponse);
    } 
    // Music player check
    else if (command.Player && !queue) {
      const responses = [
        `${emoji.ERROR} Music isn't even playing right now! 🎶 Try again later.`,
        `${emoji.ERROR} The music player is off. Start some tunes first! 🎧`,
        `${emoji.ERROR} Can’t do that, no music is playing! Try something else. 🎼`,
        `${emoji.ERROR} Oops, no music right now! Start a song before using that command. 🎤`,
        `${emoji.ERROR} Music's not running yet. Let’s get it started first! 🎶`,
        `${emoji.ERROR} Can’t find the music player. Start a song, then try again! 🎵`,
        `${emoji.ERROR} The music player is inactive. Play something first! 🎧`,
        `${emoji.ERROR} There's no music to control! Start a track and then try again. 🎼`,
        `${emoji.ERROR} Need music running for this. Start a song, please! 🎤`,
        `${emoji.ERROR} Whoops, no tunes playing. Play a song first! 🎶`,
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return client.embed(message, randomResponse);
    } 
    // DJ role check
    else if (command.DJ && checkDJ) {
      const responses = [
        `${emoji.ERROR} You need the **DJ role** to use that command! 🎧`,
        `${emoji.ERROR} Sorry, but you don't have the **DJ role**! 👑`,
        `${emoji.ERROR} You're missing the **DJ role** for that command! 🎵`,
        `${emoji.ERROR} You need **DJ role** for that! 🕺`,
        `${emoji.ERROR} **DJ role** required! Join the club. 🎤`,
        `${emoji.ERROR} Not a DJ? Not a problem! But you'll need the **DJ role**. 🎶`,
        `${emoji.ERROR} Whoa, you need the **DJ role** for this. Better work for it! 🎶`,
        `${emoji.ERROR} You can’t use that without the **DJ role**. Sorry! 🎼`,
        `${emoji.ERROR} No **DJ role**? Then no command for you. 🔊`,
        `${emoji.ERROR} Gotta be the DJ! Missing the role. 🎧`,
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return client.embed(message, randomResponse);
    }

    // Log the command usage
    const logChannel = await message.guild.channels.fetch("1348780722323849246");
    if (logChannel) {
      logChannel.send({
        content: `Command used by: <@${message.author.id}> (${message.author.tag})\nCommand: \`${command.name}\`\nServer: ${message.guild.name} (${message.guild.id})\nChannel: <#${message.channel.id}> (${message.channel.id})\nUser ID: ${message.author.id}`,
      });
    }

    // Execute the command
    await command.run(client, message, args);
  }
});
