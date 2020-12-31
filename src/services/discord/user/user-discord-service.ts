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
  ): Promise<void> {
    const user: UserDocument = (
      await this.userMongo.find({
        discord: discordId,
      })
    )[0];
    if (!user) {
      await message.channel.send(`Usuario ${discordId} no encontrado`);
      return;
    }
    user.admin = adminValue;
    await user.save();
    const messageToPrint = adminValue
      ? `Usuario ${discordId} pasa a ser administrador`
      : `Usuario ${discordId} deja de ser administrador`;
    await message.channel.send(messageToPrint);
    return;
  }

  async manageMessage(commands: string[], message: Message): Promise<void> {
    const userId = commands[1];
    if (!userId) {
      await this.writeCommandError(message, commands);
      return;
    }
    switch (commands[0] as BotUserCommands) {
      case BotUserCommands.GIVE_ADMIN:
        await this.giveAdmin(userId, true, message);
        break;
      case BotUserCommands.REMOVE_ADMIN:
        await this.giveAdmin(userId, true, message);
        break;
      default:
        await this.writeCommandError(message, commands);
    }
  }

  private async writeCommandError(
    message: Message,
    commands: string[],
  ): Promise<void> {
    await message.channel.send(
      '**Error:** Comando mal formado, revisa la ayuda.',
    );
    await message.channel.send(
      `*"${this.configDocument.prefix}${BotCommands.HELP} ${commands[0]}"*`,
    );
  }
}

export enum BotUserCommands {
  GIVE_ADMIN = 'give_admin',
  REMOVE_ADMIN = 'remove_admin',
  GIVE_POWERS = 'give_powers',
  REMOVE_POWERS = 'remove_powers',
  LIST = 'list',
  SET_SCORE = 'score',
  ENABLE = 'enable',
  DISABLE = 'disable',
}
