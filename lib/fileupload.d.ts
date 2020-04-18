declare class FileUpload {
    uploadPath: string;
    constructor();
    setUploadPath(uploadPath: string): void;
    makeDirectory(folder: string): Promise<unknown>;
    deleteFile(filename: string, folder: string): Promise<unknown>;
    saveImageBase64(data: any, uploadPath?: string): Promise<unknown>;
}
export default FileUpload;
