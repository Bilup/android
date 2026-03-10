// DesktopSettingsPreload implementation for Capacitor
// Using the new l10n system

const DesktopSettingsPreload = {
  // Initialize settings
  init: () => {
    // Get locale from localStorage or default to 'zh-cn'
    const locale = localStorage.getItem('bilup:locale') || 'zh-cn';
    
    // Load translations
    const englishTranslations = {
      'desktop-settings.title': 'Desktop Settings',
      'desktop-settings.update-checker': 'Update Checker',
      'desktop-settings.notify-unstable': 'Unstable versions',
      'desktop-settings.notify-stable': 'Stable versions',
      'desktop-settings.notify-security': 'Security updates',
      'desktop-settings.notify-never': 'Never check',
      'desktop-settings.disabled-updates': 'Update checking is not recommended as you will miss security updates.',
      'desktop-settings.update-checker-not-allowed': 'Update checking is not available',
      'desktop-settings.microphone': 'Microphone',
      'desktop-settings.camera': 'Camera',
      'desktop-settings.loading': 'Loading...',
      'desktop-settings.no-devices': 'No devices',
      'desktop-settings.editor-must-be-open': 'Error: Editor must be open to configure media devices',
      'desktop-settings.error': 'Error: {error}',
      'desktop-settings.media-devices-changed': 'You must restart the application for microphone or camera changes to take effect.',
      'desktop-settings.bypass-cors': 'Allow extensions to access any website',
      'desktop-settings.bypass-cors-enabled': 'This disables many security features designed to protect you. Malicious projects or extensions will be able to access any website or device on your network.',
      'desktop-settings.open-user-data': 'Open User Data'
    };

    const otherTranslations = {
      'zh-cn': {
        'desktop-settings.title': '桌面设置',
        'desktop-settings.update-checker': '更新检查',
        'desktop-settings.notify-unstable': '不稳定版本',
        'desktop-settings.notify-stable': '稳定版本',
        'desktop-settings.notify-security': '安全更新',
        'desktop-settings.notify-never': '从不检查',
        'desktop-settings.disabled-updates': '不建议关闭更新检查，因为这样你会无法接收安全更新。',
        'desktop-settings.update-checker-not-allowed': '更新检查不可用',
        'desktop-settings.microphone': '麦克风',
        'desktop-settings.camera': '摄像头',
        'desktop-settings.loading': '加载中...',
        'desktop-settings.no-devices': '无设备',
        'desktop-settings.editor-must-be-open': '错误：编辑器必须打开才能配置媒体设备',
        'desktop-settings.error': '错误：{error}',
        'desktop-settings.media-devices-changed': '你需要重新启动应用程序以应用麦克风或摄像头更改。',
        'desktop-settings.bypass-cors': '允许扩展访问任何网站',
        'desktop-settings.bypass-cors-enabled': '这将禁用多项用来保护网络安全的功能。恶意作品或扩展将可以访问您网络上的任何网站或设备。',
        'desktop-settings.open-user-data': '打开用户数据'
      }
    };

    // Load translations based on locale
    const strings = Object.assign({}, englishTranslations);
    const possible = [locale];
    if (locale.includes('-')) {
      possible.push(locale.split('-')[0]);
    }
    for (const language of possible) {
      const translations = otherTranslations[language];
      if (translations) {
        Object.assign(strings, translations);
        break;
      }
    }
    
    // Default settings
    const settings = {
      updateChecker: localStorage.getItem('bilup:update-checker') || 'stable',
      updateCheckerAllowed: true,
      microphone: localStorage.getItem('bilup:preferred-audio-device') || null,
      camera: localStorage.getItem('bilup:preferred-video-device') || null,
      bypassCORS: localStorage.getItem('bilup:bypassCORS') === 'true'
    };
    
    return { locale, strings, settings };
  },
  
  // Set update checker (supported in Capacitor)
  setUpdateChecker: (value) => {
    console.log('Set update checker:', value);
    localStorage.setItem('bilup:update-checker', value);
  },
  
  // Set microphone (supported in Capacitor)
  setMicrophone: (value) => {
    console.log('Set microphone:', value);
    localStorage.setItem('bilup:preferred-audio-device', value);
  },
  
  // Set camera (supported in Capacitor)
  setCamera: (value) => {
    console.log('Set camera:', value);
    localStorage.setItem('bilup:preferred-video-device', value);
  },
  
  // Enumerate media devices (supported in Capacitor)
  enumerateMediaDevices: async () => {
    try {
      // First try to enumerate devices without explicit permission request
      // This might return limited information, but it's better than nothing
      let devices = await navigator.mediaDevices.enumerateDevices();
      
      // If we don't get any videoinput devices, try requesting permission
      if (!devices.some(device => device.kind === 'videoinput')) {
        try {
          // Request media device permissions
          await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
          // Re-enumerate devices after permission is granted
          devices = await navigator.mediaDevices.enumerateDevices();
        } catch (permissionError) {
          console.warn('Permission denied for camera:', permissionError);
          // Continue with whatever devices we have
        }
      }
      
      // If we don't get any audioinput devices, try requesting permission
      if (!devices.some(device => device.kind === 'audioinput')) {
        try {
          // Request media device permissions
          await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          // Re-enumerate devices after permission is granted
          devices = await navigator.mediaDevices.enumerateDevices();
        } catch (permissionError) {
          console.warn('Permission denied for microphone:', permissionError);
          // Continue with whatever devices we have
        }
      }
      
      // Filter out audio and video input devices
      return devices.filter(device => 
        device.kind === 'audioinput' || device.kind === 'videoinput'
      );
    } catch (error) {
      console.error('Error enumerating media devices:', error);
      return [];
    }
  },
  
  // Set bypass CORS (supported in Capacitor)
  setBypassCORS: (value) => {
    console.log('Set bypass CORS:', value);
    localStorage.setItem('bilup:bypassCORS', value.toString());
    // Reload the page to apply changes
    window.location.reload();
  },
  
  // Open user data (not supported in Capacitor)
  openUserData: () => {
    console.log('Open user data');
    alert('用户数据功能在Capacitor版本中不可用');
  }
};

// Make it globally available
window.DesktopSettingsPreload = DesktopSettingsPreload;