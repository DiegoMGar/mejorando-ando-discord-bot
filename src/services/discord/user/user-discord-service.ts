import { Injectable } from '@nestjs/common';
import { UserService } from '../../../db/user/user.service';
import { BotConfigDocument } from '../../../db/bot-config/bot-config.schema';
import { Message } from 'discord.js';
import { UserDocument } from '../../../db/user/user.schema';
import { BotCommands } from '../discord.service';

@Injectable()
export class UserDiscordService {
  private configDocument: BotConfigDocument;

  constructor(private userMongo: UserService) {}

  configure(config: BotConfigDocument): void {
    this.configDocument = config;
  }

  private async giveAdmin(
    discordId: string,
    adminValue: boolean,
    message: Message,
    force: string,
  ): Promise<void> {
    if (!discordId) {
      await this.writeCommandError(message);
      return;
    }
    if (force !== 'force') force = '';
    let user: UserDocument = (
      await this.userMongo.find({
        discord: discordId,
      })
    )[0];
    if (!user && !force) {
      await message.channel.send(`Usuario ${discordId} no encontrado.`);
      await message.channel.send(
        `*Usa **${this.configDocument.prefix}${BotCommands.USER} <${BotUserCommands.GIVE_ADMIN}|${BotUserCommands.REMOVE_ADMIN}> <id> force** para añadirlo automáticamente*`,
      );
      return;
    } else if (!user) {
      user = await this.userMongo.insert({
        admin: true,
        adminRange: 999,
        createdAt: new Date(),
        discord: discordId,
        discordUsername: '<NOT IMPLEMENTED>',
        score: 0,
      });
    }
    user.admin = adminValue;
    await user.save();
    const messageToPrint = adminValue
      ? `Usuario ${discordId} pasa a ser administrador`
      : `Usuario ${discordId} deja de ser administrador`;
    await message.channel.send(messageToPrint);
    return;
  }

  private async listUsers(message: Message): Promise<void> {
    const users: UserDocument[] = await this.userMongo.findAll();
    await message.channel.send('Listando usuarios:\n\n');
    const messageBuilder: string[] = [];
    for (const u of users) {
      messageBuilder.push(
        `User: ${u.discord}\n\tscore: ${u.score}\n\tadmin: ${u.admin}\n`,
      );
      messageBuilder.push(`${'-'.repeat(10)}\n`);
    }
    await message.channel.send(messageBuilder.join(''));
    await message.channel.send(`\n*Total: **${users.length}***`);
  }

  async manageMessage(commands: string[], message: Message): Promise<void> {
    switch (commands[0] as BotUserCommands) {
      case BotUserCommands.GIVE_ADMIN:
        await this.giveAdmin(commands[1], true, message, commands[2]);
        break;
      case BotUserCommands.REMOVE_ADMIN:
        await this.giveAdmin(commands[1], false, message, commands[2]);
        break;
      case BotUserCommands.LIST:
        await this.listUsers(message);
        break;
      default:
        await this.writeCommandError(message);
    }
  }

  private async writeCommandError(message: Message): Promise<void> {
    await message.channel.send(
      '**Error:** Comando mal formado, revisa la ayuda.',
    );
    await message.channel.send(
      `*"${this.configDocument.prefix}${BotCommands.HELP}}"*`,
    );
  }
}

export enum BotUserCommands {
  GIVE_ADMIN = 'give_admin',
  REMOVE_ADMIN = 'remove_admin',
  GIVE_POWERS = 'give_powers',
  REMOVE_POWERS = 'remove_powers',
  LIST = 'list', // GET ALL
  DETAIL = 'detail', // DETAIL ONE
  SET_SCORE = 'score',
  ENABLE = 'enable',
  DISABLE = 'disable',
}
