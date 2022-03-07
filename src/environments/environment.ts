import pkg from '../../package.json';

export const environment = {
  production: false,
  VERSION: pkg.version,
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseKey: 'YOUR_SUPABASE_KEY',
};