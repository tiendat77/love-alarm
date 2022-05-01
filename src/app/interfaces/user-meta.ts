export interface UserMeta {
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;

  [key: string]: any; // properties from provider
}
