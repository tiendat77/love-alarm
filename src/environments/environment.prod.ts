import pkg from '../../package.json';

export const environment = {
  production: true,
  VERSION: pkg.version,
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseKey: 'YOUR_SUPABASE_KEY',
  serverlessUrl: 'YOUR_SERVERLESS_URL',
};