export interface UserMeta {
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;

  bluetooth_id?: string;
  notification_token?: string;

  [key: string]: any; // properties from provider
}
