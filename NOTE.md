### Note

1. AndroidManifest.xml

Manifest

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.dathuynh.lovealarm">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:hardwareAccelerated="true"
        android:theme="@style/AppTheme">

        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:name="com.dathuynh.lovealarm.MainActivity"
            android:label="@string/title_activity_main"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:launchMode="singleTask">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="com.dathuynh.lovealarm" />
            </intent-filter>

        </activity>

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths"></meta-data>
        </provider>

        <meta-data android:name="com.google.firebase.messaging.default_notification_icon" android:resource="@drawable/ic_notification" />
        <meta-data android:name="com.google.firebase.messaging.default_notification_color" android:resource="@color/colorAccent" />
    </application>

    <!-- Permissions -->
    <uses-sdk tools:overrideLibrary="com.google.zxing.client.android" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.INTERNET" />
</manifest>
```

Permission

```xml
  <application
      android:requestLegacyExternalStorage="true"
      ...
  >

  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

Deep link

```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="com.dathuynh.lovealarm" />
</intent-filter>
```

Push Notification

```xml
<meta-data android:name="com.google.firebase.messaging.default_notification_icon" android:resource="@drawable/ic_notification" />
<meta-data android:name="com.google.firebase.messaging.default_notification_color" android:resource="@color/colorAccent" />
```

2. App Icon

Logo:
  - container: 512x512 (px)
  - logo: 230x230 (px)

3. To generate icons and splash screen for Android & iOs in Capacitor and copies generated resources into native projects:

```
cordova-res ios --skip-config --copy
cordova-res android --skip-config --copy
```

4. Update environment file

```
ts-node set-env.ts
```

### Key store android
Key store path: keystore.jks
Password: hyenat_hutdin

Alias: key_0
Password: hyenat_hutdin

### Postgres Database

1. User Profile

```sql
-- Create a table for Public Profiles
create table profiles (
  id uuid references auth.users not null,
  updated_at timestamp with time zone,
  email text unique,
  name text,
  picture text,
  bio text,
  city text,
  interested text[],
  birthday text,
  joindate text,
  ringers text[],
  ringgings text[],

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

### Design

[Figma](https://www.figma.com/file/MpLE0uUrm6rMZtFCVdK4jb/LoveAlarm?node-id=0%3A1)