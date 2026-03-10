// L10n implementation for Capacitor
// Based on src-main/l10n/index.js

const englishTranslations = {
  'prompt.ok': '确定',
  'prompt.cancel': '取消',
  'in-app-about.desktop-settings': '桌面设置',
  'in-app-about.privacy': '隐私',
  'in-app-about.about': '关于',
  'in-app-about.source-code': '源代码',
  'desktop-settings.title': '桌面设置',
  'desktop-settings.update-checker': '更新检查',
  'desktop-settings.notify-unstable': '不稳定版本',
  'desktop-settings.notify-stable': '稳定版本',
  'desktop-settings.notify-security': '安全更新',
  'desktop-settings.notify-never': '从不检查',
  'desktop-settings.disabled-updates': '已禁用更新检查',
  'desktop-settings.update-checker-not-allowed': '更新检查不可用',
  'desktop-settings.microphone': '麦克风',
  'desktop-settings.camera': '摄像头',
  'desktop-settings.loading': '加载中...',
  'desktop-settings.no-devices': '无设备',
  'desktop-settings.editor-must-be-open': '编辑器必须打开',
  'desktop-settings.error': '错误: {error}',
  'desktop-settings.media-devices-changed': '媒体设备已更改',
  'desktop-settings.hardware-acceleration': '硬件加速',
  'desktop-settings.hardware-acceleration-when-available': '硬件加速（如有可用）',
  'desktop-settings.hardware-acceleration-disabled': '已禁用硬件加速',
  'desktop-settings.background-throttling': '后台节流',
  'desktop-settings.background-throttling-disabled': '已禁用后台节流',
  'desktop-settings.bypass-cors': '绕过CORS',
  'desktop-settings.bypass-cors-enabled': '已启用CORS绕过',
  'desktop-settings.spellchecker': '拼写检查',
  'desktop-settings.exit-fullscreen-on-escape': '按ESC退出全屏',
  'desktop-settings.more-information': '更多信息',
  'desktop-settings.open-user-data': '打开用户数据'
};

const otherTranslations = {
  'zh-cn': englishTranslations,
  'en': englishTranslations
};

let currentLocale;
let currentStrings;

const loadTranslations = (locale) => {
  const result = Object.assign({}, englishTranslations);

  const possible = [locale];
  if (locale.includes('-')) {
    possible.push(locale.split('-')[0]);
  }
  for (const language of possible) {
    const translations = otherTranslations[language];
    if (translations) {
      Object.assign(result, translations);
      break;
    }
  }

  return result;
};

const updateLocale = (locale) => {
  currentLocale = locale;
  currentStrings = loadTranslations(locale);
};

const translate = (id) => currentStrings[id] || id;

const getLocale = () => currentLocale;

const getStrings = () => currentStrings;

const init = () => {
  const locale = localStorage.getItem('bilup:locale') || 'zh-cn';
  updateLocale(locale);
  return { locale, strings: currentStrings };
};

export {
  updateLocale,
  translate,
  getLocale,
  getStrings,
  init
};