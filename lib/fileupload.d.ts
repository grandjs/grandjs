declare class FileUploadClass {
    uploadPath: string;
    constructor();
    setUploadPath(uploadPath: string): void;
    makeDirectory(folder: string): Promise<unknown>;
    deleteFile(filename: string, folder: string): Promise<unknown>;
    saveImageBase64(data: any, uploadPath?: string): Promise<unknown>;
}
declare const FileUpload: FileUploadClass;
export default FileUpload;
