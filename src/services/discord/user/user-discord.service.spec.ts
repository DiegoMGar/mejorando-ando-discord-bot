import { Test, TestingModule } from '@nestjs/testing';
import { UserDiscordService } from './user-discord-service';

describe('UserDiscordService', () => {
  let service: UserDiscordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserDiscordService],
    }).compile();

    service = module.get<UserDiscordService>(UserDiscordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
