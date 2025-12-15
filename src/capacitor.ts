import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { App } from '@capacitor/app';

/**
 * Initialize Capacitor plugins for native mobile experience
 */
export async function initializeCapacitor() {
  // Only run on native platforms
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    // Configure status bar
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#0D0D0D' });

    // Configure keyboard behavior
    if (Capacitor.getPlatform() === 'ios') {
      await Keyboard.setResizeMode({ mode: KeyboardResize.Body });
    }

    // Hide splash screen after app is ready
    await SplashScreen.hide();

    // Handle app state changes
    App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active:', isActive);
    });

    // Handle back button on Android
    App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp();
      } else {
        window.history.back();
      }
    });

    console.log('Capacitor initialized successfully');
  } catch (error) {
    console.error('Error initializing Capacitor:', error);
  }
}

/**
 * Check if running on native platform
 */
export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

/**
 * Get the current platform
 */
export function getPlatform(): string {
  return Capacitor.getPlatform();
}
