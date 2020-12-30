export default (): AppConfiguration => ({
  APP_STAGE: process.env.APP_STAGE,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  DISCORD_PUBLIC_KEY: process.env.DISCORD_PUBLIC_KEY,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  DISCORD_SUPERADMIN_ID: process.env.DISCORD_SUPERADMIN_ID,
  MONGODB_URL: process.env.MONGODB_URL,
});

export interface AppConfiguration {
  APP_STAGE: string;
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
  DISCORD_PUBLIC_KEY: string;
  DISCORD_TOKEN: string;
  DISCORD_SUPERADMIN_ID: string;
  MONGODB_URL: string;
}
