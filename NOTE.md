### Note

1. AndroidManifest.xml

Permission

```
  <application
      android:requestLegacyExternalStorage="true"
      ...
  >

  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

Deep link

```
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="http" />
    <data android:scheme="https" />
    <data android:host="lovealarm.vercel.app" />
</intent-filter>
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

### Design

[Figma](https://www.figma.com/file/MpLE0uUrm6rMZtFCVdK4jb/LoveAlarm?node-id=0%3A1)