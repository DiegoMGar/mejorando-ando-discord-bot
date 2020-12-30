import { Injectable } from '@nestjs/common';
import * as Discord from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { AppConfiguration } from '../../config/configuration';
import { Client, Message } from 'discord.js';
import { BotConfigService } from '../../db/bot-config/bot-config.service';
import { BotConfigDocument } from '../../db/bot-config/bot-config.schema';

@Injectable()
export class DiscordService {
  private client: Client;
  private botConfig: BotConfigDocument;

  constructor(
    private config: ConfigService<AppConfiguration>,
    private botConfigService: BotConfigService,
  ) {
    this.client = new Discord.Client();
    this.botConfigService
      .findAll()
      .then((response: BotConfigDocument[]) => {
        if (response.length > 0) return response[0];
        return this.botConfigService.insertDefaultConfig();
      })
      .then((response: BotConfigDocument) => {
        this.botConfig = response;
      })
      .catch((err) => {
        console.log('Error loading bot config from database');
        console.log(err.message);
      });
    this.client.on('ready', () => {
      console.log('Discord is connected');
    });
    this.client.login(this.config.get('DISCORD_TOKEN'));
    this.client.on('message', async (message: Message) => {
      await this.listenNewChannel(message);
      if (!this.listeningChannel(message.channel.id)) return;
      this.ping(message);
    });
  }

  async listenNewChannel(message: Message): Promise<void> {
    if (
      !message.content.toLowerCase().startsWith('!addchannel') ||
      !this.messageFromAdmin(message.author.id)
    )
      return;
    if (this.botConfig.channels.includes(message.channel.id)) return;
    this.botConfig.channels.push(message.channel.id);
    this.botConfig.markModified('channels');
    await this.botConfig.save();
    await message.channel.send(
      'A partir de ahora prestaré atención a este canal.',
    );
  }

  async ping(message: Message): Promise<void> {
    if (message.content.toLowerCase() === 'ping')
      await message.channel.send('pong');
  }

  private listeningChannel(id: string): boolean {
    return this.botConfig.channels.includes(id);
  }

  private messageFromAdmin(id: string): boolean {
    return (
      id === this.config.get('DISCORD_SUPERADMIN_ID') ||
      this.botConfig.admins.includes(id)
    );
  }
}
