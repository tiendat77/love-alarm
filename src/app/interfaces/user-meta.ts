export interface UserMeta {
  id: string;
  name: string | null;
  email: string | null;
  avatar?: string | null;

  bluetooth_id?: string;
  notification_token?: string;
}
