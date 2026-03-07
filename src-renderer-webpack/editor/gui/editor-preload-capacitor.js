// EditorPreload implementation for Capacitor
// Replaces Electron IPC calls with Capacitor Filesystem API

import { Filesystem, Directory } from '@capacitor/filesystem';

// File storage path
const PROJECTS_DIR = 'projects';

// Helper function to ensure directory exists
async function ensureDirectory(path) {
  try {
    await Filesystem.mkdir({
      path: path,
      directory: Directory.Data,
      recursive: true
    });
  } catch (e) {
    // Directory might already exist
  }
}

// Helper function to read file as ArrayBuffer
async function readFileAsArrayBuffer(path) {
  try {
    const result = await Filesystem.readFile({
      path: path,
      directory: Directory.Data
    });
    // Convert base64 to ArrayBuffer
    const base64 = result.data;
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (e) {
    console.error('Error reading file:', e);
    return null;
  }
}

// Helper function to write ArrayBuffer to file
async function writeFileFromArrayBuffer(path, buffer) {
  try {
    // Convert ArrayBuffer to base64
    const bytes = new Uint8Array(buffer);
    let binaryString = '';
    for (let i = 0; i < bytes.length; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binaryString);
    
    await Filesystem.writeFile({
      path: path,
      data: base64,
      directory: Directory.Data
    });
    return true;
  } catch (e) {
    console.error('Error writing file:', e);
    return false;
  }
}

const EditorPreload = {
  // Check if initially fullscreen
  isInitiallyFullscreen: () => {
    // Capacitor version doesn't support fullscreen on startup
    return false;
  },

  // Get initial file (if app was opened with a file)
  getInitialFile: async () => {
    // Capacitor doesn't support opening files from file association yet
    return null;
  },

  // Get file by ID
  getFile: async (id) => {
    try {
      const filePath = `${PROJECTS_DIR}/${id}.sb3`;
      const data = await readFileAsArrayBuffer(filePath);
      
      if (!data) {
        throw new Error('File not found');
      }
      
      return {
        name: `${id}.sb3`,
        type: 'file',
        data: data
      };
    } catch (e) {
      console.error('Error getting file:', e);
      throw e;
    }
  },

  // Notify that a file was opened
  openedFile: async (id) => {
    console.log('File opened:', id);
    // Store the current file ID in localStorage
    localStorage.setItem('bilup:current-file-id', id);
  },

  // Notify that a file was closed
  closedFile: async () => {
    console.log('File closed');
    // Remove the current file ID from localStorage
    localStorage.removeItem('bilup:current-file-id');
  },

  // Show save file picker
  showSaveFilePicker: async (suggestedName) => {
    // In Capacitor, we'll use a simple prompt for the filename
    const filename = prompt('Enter filename:', suggestedName || 'project.sb3');
    if (!filename) {
      return null;
    }
    
    // Return a mock file handle
    return {
      id: filename.replace(/\.sb3$/, ''),
      name: filename
    };
  },

  // Show open file picker
  showOpenFilePicker: async () => {
    try {
      // List all projects
      await ensureDirectory(PROJECTS_DIR);
      const result = await Filesystem.readdir({
        path: PROJECTS_DIR,
        directory: Directory.Data
      });
      
      // Filter for .sb3 files
      const projects = result.files
        .filter(f => f.name.endsWith('.sb3'))
        .map(f => ({
          id: f.name.replace(/\.sb3$/, ''),
          name: f.name
        }));
      
      if (projects.length === 0) {
        alert('No projects found');
        return null;
      }
      
      // Simple selection dialog
      const options = projects.map((p, i) => `${i + 1}. ${p.name}`).join('\n');
      const selection = prompt(`Select a project:\n${options}\n\nEnter number:`);
      
      if (!selection) {
        return null;
      }
      
      const index = parseInt(selection) - 1;
      if (index < 0 || index >= projects.length) {
        alert('Invalid selection');
        return null;
      }
      
      return projects[index];
    } catch (e) {
      console.error('Error listing projects:', e);
      return null;
    }
  },

  // Set locale and get strings
  setLocale: (locale) => {
    // Store locale in localStorage
    localStorage.setItem('bilup:locale', locale);
    
    // Return localized strings
    const strings = {
      'prompt.ok': '确定',
      'prompt.cancel': '取消',
      'in-app-about.desktop-settings': '桌面设置',
      'in-app-about.privacy': '隐私',
      'in-app-about.about': '关于',
      'in-app-about.source-code': '源代码'
    };
    
    return {
      strings: strings,
      locale: locale
    };
  },

  // Set project changed state
  setChanged: async (changed) => {
    console.log('Project changed:', changed);
    // Store changed state in localStorage
    localStorage.setItem('bilup:project-changed', changed ? 'true' : 'false');
  },

  // Open new window
  openNewWindow: async () => {
    // Capacitor doesn't support multiple windows
    // Reload the current page instead
    window.location.reload();
  },

  // Open addon settings
  openAddonSettings: async (search) => {
    // Navigate to addons page
    window.location.href = './addons/addons.html' + (search ? `?search=${encodeURIComponent(search)}` : '');
  },

  // Open packager
  openPackager: async () => {
    // Navigate to packager page
    window.location.href = '../../packager/migrate-helper.html';
  },

  // Open desktop settings
  openDesktopSettings: async () => {
    // Navigate to settings page
    window.location.href = '../../desktop-settings/desktop-settings.html';
  },

  // Open privacy page
  openPrivacy: async () => {
    // Navigate to privacy page
    window.location.href = '../../privacy/privacy.html';
  },

  // Open about page
  openAbout: async () => {
    // Navigate to about page
    window.location.href = '../../about/about.html';
  },

  // Get preferred media devices
  getPreferredMediaDevices: async () => {
    try {
      // Get saved preferences from localStorage
      const savedAudio = localStorage.getItem('bilup:preferred-audio-device');
      const savedVideo = localStorage.getItem('bilup:preferred-video-device');
      
      return {
        audio: savedAudio,
        video: savedVideo
      };
    } catch (e) {
      console.error('Error getting preferred media devices:', e);
      return {
        audio: null,
        video: null
      };
    }
  },

  // Get advanced customizations (userscripts, userstyles)
  getAdvancedCustomizations: async () => {
    try {
      // Get saved customizations from localStorage
      const userscript = localStorage.getItem('bilup:userscript') || '';
      const userstyle = localStorage.getItem('bilup:userstyle') || '';
      
      return {
        userscript: userscript,
        userstyle: userstyle
      };
    } catch (e) {
      console.error('Error getting advanced customizations:', e);
      return {
        userscript: '',
        userstyle: ''
      };
    }
  },

  // Set export for packager callback
  setExportForPackager: (callback) => {
    window.exportForPackager = callback;
  },

  // Set fullscreen state
  setIsFullScreen: async (isFullScreen) => {
    console.log('Fullscreen state:', isFullScreen);
    // Capacitor doesn't support programmatic fullscreen yet
    // This could be implemented using the Screen Orientation API or a plugin
  }
};

// Make it globally available
window.EditorPreload = EditorPreload;

export default EditorPreload;
