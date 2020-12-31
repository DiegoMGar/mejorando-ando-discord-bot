import { Injectable } from '@nestjs/common';
import * as Discord from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { AppConfiguration } from '../../config/configuration';
import { Client, Message } from 'discord.js';
import { BotConfigService } from '../../db/bot-config/bot-config.service';
import { BotConfigDocument } from '../../db/bot-config/bot-config.schema';
import { UserDiscordService } from './user/user-discord-service';

@Injectable()
export class DiscordService {
  private client: Client;
  private configDocument: BotConfigDocument;

  constructor(
    private config: ConfigService<AppConfiguration>,
    private botConfigMongo: BotConfigService,
    private userDiscord: UserDiscordService,
  ) {
    this.client = new Discord.Client();
    this.botConfigMongo
      .findAll()
      .then((response: BotConfigDocument[]) => {
        if (response.length > 0) return response[0];
        return this.botConfigMongo.insertDefaultConfig();
      })
      .then((response: BotConfigDocument) => {
        this.configDocument = response;
        this.userDiscord.configure(response);
      })
      .catch((err) => {
        console.log('Error loading bot config from database');
        console.log(err.message);
      });
    this.login();
    this.onMessage();
  }

  private async listenNewChannel(message: Message): Promise<void> {
    if (this.configDocument.channels.includes(message.channel.id)) return;
    this.configDocument.channels.push(message.channel.id);
    this.configDocument.markModified('channels');
    await this.configDocument.save();
    await message.channel.send(
      'A partir de ahora prestaré atención a este canal.',
    );
  }

  private async stopListeningChannel(message: Message): Promise<void> {
    const pos: number = this.configDocument.channels.findIndex(
      (id) => id === message.channel.id,
    );
    if (pos < 0) return;
    this.configDocument.channels.splice(pos, 1);
    this.configDocument.markModified('channels');
    await this.configDocument.save();
    await message.channel.send(
      'A partir de ahora no prestaré atención a este canal.',
    );
  }

  private listeningChannel(id: string): boolean {
    return this.configDocument.channels.includes(id);
  }

  private messageFromAdmin(id: string): boolean {
    return (
      id === this.config.get('DISCORD_SUPERADMIN_ID') ||
      this.configDocument.admins.includes(id)
    );
  }

  private async help(message: Message): Promise<void> {
    await message.author.send('Hola, estoy aquí para ayudarte.');
  }

  private async manageAdminMessage(message: Message): Promise<void> {
    if (!this.listeningChannel(message.channel.id)) return;
    if (!this.messageFromAdmin(message.author.id)) return;
    if (!message.content) return;
    const commands: string[] = this.extractCommands(message);
    if (commands.length < 1) return;
    switch (`${commands[0]}` as BotCommands) {
      case BotCommands.ANSWER:
        break;
      case BotCommands.CHANNEL:
        if (commands[1] === BotChannelCommands.REMOVE)
          await this.stopListeningChannel(message);
        break;
      case BotCommands.QUESTION:
        break;
      case BotCommands.USER:
        await this.userDiscord.manageMessage(commands.slice(1), message);
        break;
    }
  }

  private async manageMessage(message: Message): Promise<void> {
    if (!this.listeningChannel(message.channel.id)) return;
    if (!message.content) return;
    const commands: string[] = this.extractCommands(message);
    if (commands.length < 1) return;
    switch (`${commands[0]}` as BotCommands) {
      case BotCommands.HELP:
        await this.help(message);
        break;
    }
  }

  private onMessage(): void {
    this.client.on('message', async (message: Message) => {
      await this.superAdminDebug(message);
      await this.manageAdminMessage(message);
      await this.manageMessage(message);
    });
  }

  private async superAdminDebug(message: Message): Promise<void> {
    if (
      message.content.startsWith(BotCommands.PING) &&
      message.author.id === this.config.get('DISCORD_SUPERADMIN_ID')
    ) {
      await message.channel.send(`PONG: id del canal:[${message.channel.id}].`);
      if (this.configDocument.channels.includes(message.channel.id)) {
        await message.channel.send(
          `*Este canal está en seguimiento, puedes usar: **"${this.configDocument.prefix}${BotCommands.CHANNEL} ${BotChannelCommands.REMOVE}"***`,
        );
      } else if (message.content.includes(BotChannelCommands.ADD)) {
        await this.listenNewChannel(message);
      } else {
        await message.channel.send(
          `*Añade "${BotChannelCommands.ADD}" al final del comando para escuchar este canal automaticamente.*`,
        );
      }
    }
  }

  private login(): void {
    this.client.on('ready', () => {
      console.log('Discord is connected');
    });
    this.client.login(this.config.get('DISCORD_TOKEN'));
  }

  private extractCommands(message: Message): string[] {
    const commands: string[] = message.content.toLowerCase().split(' ');
    if (!commands[0].startsWith(this.configDocument.prefix)) return [];
    commands[0] = commands[0].replace(this.configDocument.prefix, '');
    return commands;
  }
}

export enum BotChannelCommands {
  ADD = 'add',
  REMOVE = 'remove',
}

export enum BotAnswersCommands {
  LIST = 'list',
  LIST_ALL = 'list all',
  CHECK = 'check',
  UNCHECK = 'uncheck',
}

export enum BotQuestionsCommands {
  ADD = 'add',
  REMOVE = 'remove',
}

export enum BotCommands {
  HELP = 'help',
  PING = 'ping',
  CHANNEL = 'channel',
  USER = 'user',
  QUESTION = 'question',
  ANSWER = 'answer',
}
