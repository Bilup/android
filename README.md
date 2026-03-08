# Bilup Android

Bilup is a mod of TurboWarp with real-time collaboration support and Chinese translations. This project packages Bilup as an Android application using Capacitor.

## Requirements

- Node.js 20+
- npm or yarn
- Android Studio (for building Android apps)
- JDK 17+

## Installation

```bash
git clone --recursive https://github.com/Bilup/desktop bilup-android
cd bilup-android
npm install
```

## Build Process

### 1. Download Resource Files

```bash
npm run fetch
```

This will download the following resources:
- Library files (library-files)
- Packager resources (packager)
- Extensions (extensions)
- PenguinMod resources

### 2. Build Web Application

```bash
npm run webpack:prod
```

This compiles the React application and outputs to the `dist-renderer-webpack/` directory.

### 3. Sync to Android Project

```bash
npm run cap:copy
```

This copies the compiled web application to the Android project's assets directory.

### 4. Build Android Application

#### Using command line:

```bash
cd android
./gradlew assembleDebug
```

#### Using Android Studio:

1. Open Android Studio
2. Open the `android` directory
3. Click Build > Build Bundle(s) / APK(s) > Build APK(s)

The generated APK file is located at `android/app/build/outputs/apk/debug/`

## Development

### Start Development Server

```bash
npm run webpack:watch
```

### Run on Android Device

```bash
npm run cap:open android
```

Then connect your device and run the app from Android Studio.

## Project Structure

```
├── android/                 # Android native project
├── src-renderer/           # Static HTML pages
├── src-renderer-webpack/   # React source code
├── scripts/                # Build scripts
├── dist-renderer-webpack/  # Build output (not committed to version control)
└── capacitor.config.json    # Capacitor configuration
```

## Troubleshooting

### PowerShell Execution Policy Error

If you encounter a PowerShell execution policy error on Windows, you can:

1. Run PowerShell as administrator
2. Execute: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### Build Failures

Make sure:
- All dependencies are installed: `npm install`
- Submodules are updated: `git submodule update --init --recursive`
- JDK version is correct (JDK 17+)

## License

GPL-3.0

## Contact

- Website: https://desktop.bilup.org/
- Issues: https://github.com/Bilup/desktop/issues
- Email: support@bilup.org
