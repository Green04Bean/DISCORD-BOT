const {SlashCommandBuilder, PermissionFlagsBits} = require(`discord.js`);

module.exports = {
    category: `moderation`,
    data: new SlashCommandBuilder()
        .setName(`mute`)
        .setDescription(`Mute a user`)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addUserOption(option =>
        option.setName(`user`)
            .setDescription(`User to mute`)
            .setRequired(true))
        .addIntegerOption(option =>
        option.setName(`duration`)
            .setDescription(`Duration of mute`)
            .setRequired(true)
            .addChoices(
                { name: '1 minute', value: 60 },
                {name: `5 minutes`, value: 5 * 60},
                {name: `10 minutes`, value: 10 * 60},
                {name: `1 hour`, value: 60 * 60},
                {name: `1 day`, value: 24 * 60 * 60},
                {name: `1 week`, value: 7 * 24 * 60 * 60}
            ))
        .addStringOption(option =>
        option.setName(`reason`)
            .setDescription(`Reason for mute`)),
    async execute(interaction){
        const member = await interaction.options.getMember(`user`);
        const duration = await interaction.options.getInteger(`duration`);
        const reason = await interaction.options.getString(`reason`) || `No reason provided`;

        try{
            /*if(!interaction.inGuild()){
                return await interaction.reply({
                    content: `This command can only be used in a server`
                });
            }*/

            if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)){
                return await interaction.reply({
                    content: `I do not have permission to mute members`,
                    ephemeral: true
                });
            }

            if(member.permissions.has(PermissionFlagsBits.ModerateMembers)){
                return await interaction.reply({
                    content: `You cannot mute this member`,
                    ephemeral: true
                });
            }

            if(member.roles.highest.position >= interaction.guild.members.me.roles.highest.position){
                return await interaction.reply({
                    content: `I cannot mute this member`,
                    ephemeral: true
                });
            }

            const durations = {
                60 : `1 minute`,
                300: `5 minutes`,
                600: `10 minutes`,
                3_600: `1 hour`,
                86_400: `1 day`,
                604_800: `1 week`
            };
            const durationMs = duration * 1_000;
            await member.timeout(durationMs);
            await interaction.reply({
                content: `${member.user} has been muted for ${durations[duration]}\nReason: ${reason}`
            });

            try {
                const name = interaction.member.user;
                await member.send(`${name} has muted you in ${interaction.guild.name} for ${durations[duration]}\nReason: ${reason}`);
            }
            catch(error){
                interaction.followUp({
                    content: `An error has occurred when DMing the member`,
                    ephemeral: true
                });
            }
        }
        catch(error){
            console.log(error);
            await interaction.reply({
                content: `An error has occurred`,
                ephemeral: true
            });
        }
    }
}