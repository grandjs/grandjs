"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
================================================
file role: uploader file class
================================================
*/
// dependencies
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// define uploader file class
class FileUpload {
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
            folder = path_1.default.join(process.cwd(), folder);
            fs_1.default.exists(folder, (exist) => {
                if (exist) {
                    return resolve();
                }
                else {
                    // create this folder
                    fs_1.default.mkdir(folder, (err) => {
                        if (err) {
                            return reject(err);
                        }
                        else {
                            return resolve();
                        }
                    });
                }
            });
        });
    }
    // method to delete uploaded file
    deleteFile(filename, folder) {
        let filePath = path_1.default.join(process.cwd(), folder, filename);
        return new Promise((resolve, reject) => {
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    return reject({ message: "failed to delete file" });
                }
                else {
                    return resolve({ message: "file deleted successfully" });
                }
            });
        });
    }
    // method to parse and save image base64
    saveImageBase64(data, uploadPath = this.uploadPath) {
        let cuttedPath = uploadPath;
        uploadPath = path_1.default.join(process.cwd(), uploadPath);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
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
                };
                let matchedType = mimeTypes[image.type];
                if (matchedType) {
                    image.extName = matchedType;
                }
                else {
                    image.extName = ".jpg";
                }
                image.name = Math.random().toString(36).substr(2, 9) + image.extName;
                image.data = Buffer.from(matches[2], 'base64');
                image.url = path_1.default.join(uploadPath, image.name);
                image.path = path_1.default.resolve("/", path_1.default.join(cuttedPath, image.name));
                // write the image
                yield this.makeDirectory(uploadPath);
                fs_1.default.writeFile(image.url, image.data, (err) => {
                    if (err) {
                        return reject({ message: "error happened while saving image" });
                    }
                    else {
                        return resolve({ name: image.name, path: image.path });
                    }
                });
            }
            else {
                return reject({ message: "no image sent to upload" });
            }
        }));
    }
}
// export file uploader class
exports.default = FileUpload;
