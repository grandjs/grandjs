/*
================================================
file role: uploader file class
================================================
*/
// dependencies
const fs = require("fs");

const path = require("path");
// define uploader file class
class FileUploader {
    constructor() {
            this.uploadPath = "";
        }
        setUploadPath(uploadPath) {
            this.uploadPath = uploadPath;
        }
        // method to check folder name
    makeDirectory(folder) {
            // return promise
            return new Promise((resolve, reject) => {
                folder = path.join(process.cwd(), folder);
                fs.exists(folder, (exist) => {
                    if (exist) {
                        return resolve();
                    } else {
                        // create this folder
                        fs.mkdir(folder, (err) => {
                            if (err) {
                                return reject(err);
                            } else {
                                return resolve();
                            }
                        })
                    }
                })
            })
        }
        // method to delete uploaded file
    deleteFile(filename, folder) {
            let filePath = path.join(process.cwd(), folder, filename);
            return new Promise((resolve, reject) => {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        return reject({ message: "failed to delete file" });
                    } else {
                        return resolve({ message: "file deleted successfully" });
                    }
                })
            })
        }
        // method to parse and save image base64
    saveImageBase64(data, uploadPath = this.uploadPath) {
        let cuttedPath = uploadPath;
        uploadPath = path.join(process.cwd(), uploadPath);
        return new Promise(async(resolve, reject) => {
            if (data) {
                let matches = data.match(/data:([A-Za-z-+\/]+);base64,(.+)$/);
                let image = {};
                if (typeof matches !== null && matches.length !== 3) {
                    return reject({ message: "failed to read the image" });
                }
                image.type = matches[1];
                let mimeTypes = {
                    "image/png": ".png",
                    "image/jpeg": ".jpeg",
                    "image/jpg": ".jpg",
                    "image/webp": ".webp",
                    "image/tiff": ".tif",
                    "image/bmp": ".bnp",
                    "image/gif": ".gif"
                }
                let matchedType = mimeTypes[image.type];
                if (matchedType) {
                    image.extName = matchedType;
                } else {
                    image.extName = ".jpg";
                }
                image.name = Math.random().toString(36).substr(2, 9) + image.extName;
                image.data = Buffer.from(matches[2], 'base64');
                image.url = path.join(uploadPath, image.name);
                image.path = path.resolve("/", path.join(cuttedPath, image.name));
                // write the image
                await this.makeDirectory(uploadPath);
                fs.writeFile(image.url, image.data, (err) => {
                    if (err) {
                        return reject({ message: "error happened while saving image" });
                    } else {
                        return resolve({ name: image.name, path: image.path });
                    }
                });
            } else {
                return reject({ message: "no image sent to upload" });
            }
        })
    }
}

// export file uploader class
module.exports = new FileUploader();