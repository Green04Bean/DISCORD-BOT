const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Replies with your input.')
        .setDMPermission(false)
        .addStringOption(option =>
        option.setName('input')
            .setDescription('The input to echo back.')
            .setMaxLength(2_000)
            .setRequired(true))
        .addChannelOption(option =>
        option.setName('channel')
            .setDescription('The Channel to echo into')),
    async execute(interaction) {
        /*if(!interaction.inGuild()){
            return await interaction.reply(`This command can only be used in a server`);
        }*/

        const input = await interaction.options.getString('input');
        const channel = await interaction.options.getChannel('channel');

        if(channel){
            await channel.send(input);
            await interaction.reply({content: `Message sent to ${channel}`, ephemeral: true});
        }
        else{
            interaction.reply({content: 'Done', ephemeral: true});
            await interaction.channel.send(input);
        }
    }
}