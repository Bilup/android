// PrivacyPreload implementation for Capacitor

const PrivacyPreload = {
  // Check if update checker is allowed (not supported in Capacitor)
  isUpdateCheckerAllowed: () => {
    return false;
  },
  
  // Open desktop settings
  openDesktopSettings: () => {
    window.location.href = '../desktop-settings/desktop-settings.html';
  }
};

// Make it globally available
window.PrivacyPreload = PrivacyPreload;