# LoveAlarm
LoveAlarm is the mobile app based on the Original webtoon &amp; K-drama "Love Alarm"


### Note

1. To generate icons and splash screen for Android & iOs in Capacitor and copies generated resources into native projects:

    ```
    cordova-res android --skip-config --copy
    ```

2. Add a native platform to project:

    ```
    npx cap add android
    ```

3. Buid Ionic project and copy web assets to Capacitor native platform(s):

    ```
    npx cap sync
    ```

4. Open project in native IDE:

    ```
    npx cap open android
    ```