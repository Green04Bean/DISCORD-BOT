const {SlashCommandBuilder, PermissionFlagsBits} = require(`discord.js`);

module.exports = {
    category: `moderation`,
    data: new SlashCommandBuilder()
        .setName(`warn`)
        .setDescription(`Warn a user`)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addUserOption(option =>
        option.setName(`user`)
            .setDescription(`User to mute`)
        .setRequired(true))
        .addStringOption(option =>
        option.setName(`reason`)
            .setDescription(`Reason for warning`)
            .setRequired(true)),
    async execute(interaction){
        const member = await interaction.options.getMember(`user`);
        const reason = await interaction.options.getString(`reason`);

        try{
            if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)){
                return await interaction.reply({
                    content: `I do not have permission to warn members`,
                    ephemeral: true
                });
            }

            if(member.permissions.has(PermissionFlagsBits.ModerateMembers)){
                return await interaction.reply({
                    content: `You cannot warn this member`,
                    ephemeral: true
                });
            }

            if(member.roles.highest.position >= interaction.guild.members.me.roles.highest.position){
                return await interaction.reply({
                    content: `I cannot warn this member`,
                    ephemeral: true
                });
            }

            await interaction.reply({
                content: `${member.user} you have been warned!\nReason: ${reason}`
            });
            try{
               const name = interaction.member.user;
               await member.send(`${name} has warned you in ${interaction.guild.name}\nReason: ${reason}`);
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