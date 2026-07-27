import { createApp } from './app';
import { env } from '@/config/env';

const app = await createApp();

if (!env.JWT_SECRET) {
  throw new Error('CRITICAL: JWT_SECRET environment variable is missing!');
}
// env.PORT is already fully validated as a safe number by your Zod schema!
app.listen(env.PORT, () => {
  console.log(
    `🚀 KnowledgeVault API running on port ${env.PORT} in ${env.NODE_ENV} mode`
  );
});
