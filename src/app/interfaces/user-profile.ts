export interface UserProfile {
  id: string | null;
  email?: string;
  name?: string | null;
  gender?: 'male' | 'female' | 'others' | null;
  city?: string | null;
  picture?: string | null;
  bio?: string | null;
  interested?: string[];
  birthday?: string | null;
  joindate?: string | null;
  ringers?: string[];
  ringings?: string[];
}