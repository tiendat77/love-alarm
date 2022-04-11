export interface UserProfile {
  id: string | null;
  email: string;
  name: string | null;
  picture?: string | null;
  bio?: string | null;
  interested?: string[];
  birthday?: string | null;
  joindate?: string | null;
  ringers?: string[];
  ringgings?: string[];
}