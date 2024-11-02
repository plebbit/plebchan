import { registerPlugin } from '@capacitor/core';

export interface FileUploaderPlugin {
  pickAndUploadMedia(): Promise<{ url: string; fileName: string }>;
}

const FileUploader = registerPlugin<FileUploaderPlugin>('FileUploader');

export default FileUploader;
