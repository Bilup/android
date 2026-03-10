// UpdatePreload implementation for Capacitor

const UpdatePreload = {
  // Get strings for the update window
  getStrings: () => {
    // Get locale from localStorage or default to 'zh-cn'
    const locale = localStorage.getItem('bilup:locale') || 'zh-cn';
    
    // Load translations
    const englishTranslations = {
      'update.window-title': 'Update Available',
      'update.normal-title': 'Update Available',
      'update.security-title': 'Security Update Available',
      'update.normal-description': 'A new version of {appNameVersion} is available. Would you like to download it now?',
      'update.security-description': 'A security update for {appNameVersion} is available. We strongly recommend downloading it now.',
      'update.loading': 'Loading...',
      'update.download-button': 'Download',
      'update.ignore-button': 'Ignore',
      'update.permanently-ignore': 'Permanently ignore this update',
      'update.not-available': 'Changelog not available',
      'update.changelog-error': 'Error loading changelog: {error}'
    };

    const otherTranslations = {
      'zh-cn': {
        'update.window-title': '更新可用',
        'update.normal-title': '更新可用',
        'update.security-title': '安全更新可用',
        'update.normal-description': '有新版本的 {appNameVersion} 可用。您现在要下载吗？',
        'update.security-description': '有 {appNameVersion} 的安全更新可用。我们强烈建议您现在下载。',
        'update.loading': '加载中...',
        'update.download-button': '下载',
        'update.ignore-button': '忽略',
        'update.permanently-ignore': '永久忽略此更新',
        'update.not-available': '更新日志不可用',
        'update.changelog-error': '加载更新日志时出错：{error}'
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
    
    return {
      appName: 'Bilup',
      locale: locale,
      strings: strings
    };
  },
  
  // Get update information
  getInfo: () => {
    // Get update info from localStorage
    const currentVersion = localStorage.getItem('bilup:current-version') || '1.0.0';
    const latestVersion = localStorage.getItem('bilup:latest-version') || '1.0.0';
    const isSecurity = localStorage.getItem('bilup:is-security-update') === 'true';
    
    return {
      currentVersion: currentVersion,
      latestVersion: latestVersion,
      security: isSecurity
    };
  },
  
  // Download update
  download: () => {
    // Open the download URL in a browser
    const info = UpdatePreload.getInfo();
    const params = new URLSearchParams();
    params.set('from', info.currentVersion);
    params.set('to', info.latestVersion);
    window.open(`https://desktop.bilup.org/update_available?${params}`, '_blank');
    
    // Return to previous page instead of closing window
    window.history.back();
  },
  
  // Ignore update
  ignore: (permanently) => {
    const info = UpdatePreload.getInfo();
    const now = Date.now();
    let until;
    
    if (info.security) {
      // Security updates can't be ignored
      until = new Date(0);
    } else if (permanently) {
      // 3000 ought to be enough years into the future...
      until = new Date(3000, 0, 0);
    } else {
      until = new Date();
      until.setTime(until.getTime() + (6 * 60 * 60 * 1000)); // 6 hours
    }
    
    // Save ignored update info
    localStorage.setItem('bilup:ignored-update', info.latestVersion);
    localStorage.setItem('bilup:ignored-update-until', Math.floor(until.getTime() / 1000).toString());
    
    // Return to previous page instead of closing window
    window.history.back();
  }
};

// Make it globally available
window.UpdatePreload = UpdatePreload;