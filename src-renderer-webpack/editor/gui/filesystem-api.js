/**
 * FileSystem API implementation using Capacitor Filesystem API
 */

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Dialog } from '@capacitor/dialog';

class WrappedFileWritable {
  constructor (path) {
    this.path = path;
    this.data = [];
  }

  async write (contents) {
    this.data.push(contents);
  }

  async close () {
    // Combine all data chunks
    const combinedData = new Uint8Array(
      this.data.reduce((acc, chunk) => acc + chunk.length, 0)
    );
    
    let offset = 0;
    for (const chunk of this.data) {
      combinedData.set(chunk, offset);
      offset += chunk.length;
    }

    // Write to file
    await Filesystem.writeFile({
      path: this.path,
      data: combinedData,
      directory: Directory.Documents,
      recursive: true
    });
  }

  async abort () {
    // Simply clear the data
    this.data = [];
  }
}

class WrappedFileHandle {
  constructor (path, name) {
    this.id = path;
    this.name = name;
    this.path = path;
  }

  async getFile () {
    const result = await Filesystem.readFile({
      path: this.path,
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    });
    
    // Convert string back to Uint8Array
    const data = new Uint8Array(result.data.length);
    for (let i = 0; i < result.data.length; i++) {
      data[i] = result.data.charCodeAt(i);
    }
    
    return new File([data], this.name);
  }

  async createWritable () {
    return new WrappedFileWritable(this.path);
  }
}

class AbortError extends Error {
  constructor (message) {
    super(message);
    this.name = 'AbortError';
  }
}

const showOpenFilePicker = async () => {
  // For Capacitor, we'll use a simple dialog to get the filename
  // In a real app, you would use a file picker plugin
  const { value } = await Dialog.prompt({
    title: '打开文件',
    message: '请输入文件名:',
    inputText: 'project.sb3'
  });
  
  if (!value) {
    throw new AbortError('No file selected');
  }
  
  return [new WrappedFileHandle(value, value)];
};

const showSaveFilePicker = async (options) => {
  const { value } = await Dialog.prompt({
    title: '保存文件',
    message: '请输入文件名:',
    inputText: options.suggestedName || 'project.sb3'
  });
  
  if (!value) {
    throw new AbortError('No file selected');
  }
  
  return new WrappedFileHandle(value, value);
};

export {
  WrappedFileHandle,
  showOpenFilePicker,
  showSaveFilePicker
};