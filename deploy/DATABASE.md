# Love Alarm Database

> Postgres Database

## User Profile

```sql
-- Create a table for Public Profiles

create table profiles (
  id uuid references auth.users not null,
  updated_at timestamp with time zone,
  email text unique,
  name text,
  gender text,
  picture text,
  bio text,
  city text,
  interested text[],
  birthday text,
  joindate text,
  ringers text[],
  ringings text[],

  primary key (id),
  unique(email),
  constraint email_length check (char_length(email) >= 3)
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Set up Storage
insert into storage.buckets (id, name)
values ('avatars', 'avatars');

create policy "Give anon users access to JPG images in folder"
  on storage.objects for select
  using (bucket_id = 'avatars' and storage."extension"(name) = 'jpg' and LOWER((storage.foldername(name))[1]) = 'public' and auth.role() = 'anon');

create policy "Give users access to own folder"
  on storage.objects for select
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Give users access to own folder"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
```

##  User tokens

Store user notification token, bluetooth id, ...

```sql
-- Create a table for Public User Tokens
create table tokens (
  id uuid references auth.users not null,
  updated_at timestamp with time zone,

  notification text,
  bluetooth text,

  primary key (id)
);

-- Setup security
create policy "Public tokens are viewable by everyone."
  on tokens for select
  using ( true );

create policy "Users can insert their own token."
  on tokens for insert
  with check ( auth.uid() = id );

create policy "Users can update own token."
  on tokens for update
  using ( auth.uid() = id );

create policy "Users can delete own token."
  on tokens for delete
  using ( auth.uid() = id );

```