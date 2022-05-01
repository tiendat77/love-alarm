# Love Alarm

## Mockup design

[Figma](https://www.figma.com/file/MpLE0uUrm6rMZtFCVdK4jb/LoveAlarm?node-id=0%3A1)

## Generate app icon

Logo:
  - container: 512x512 (px)
  - logo: 230x230 (px)

To generate icons and splash screen for Android & iOs in Capacitor and copies generated resources into native projects:

```
cordova-res ios --skip-config --copy
cordova-res android --skip-config --copy
```

## Update environment file

```
ts-node set-env.ts
```