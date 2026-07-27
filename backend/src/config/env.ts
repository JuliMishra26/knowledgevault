import dotenv from 'dotenv';
import { z } from 'zod';

// 1. Load the variables from your .env file into process.env memory
dotenv.config();

// 2. Define the strict blueprint rules for your backend secrets
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default(4000), // Safely transforms text "4000" into a real number
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  // Add your future secrets here as your backend grows (e.g. DATABASE_URL)
});

// 3. Run the validation check against the loaded variables
const result = envSchema.safeParse(process.env);

// 4. Crash safely on boot if something critical is wrong or missing
if (!result.success) {
  console.error('❌ Missing or invalid environment configuration variables:');
  console.error(JSON.stringify(result.error.format(), null, 2));
  process.exit(1);
}

// 5. Export the clean, fully-typed object
export const env = result.data;
