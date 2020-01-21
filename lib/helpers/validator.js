/**
 * =========================================
 * file role: base class for validation
 * =========================================
 */
// dependencies
const helpers = require("./helpers");
//  define validation class
class Validator {
    constructor() {
            this.validation = helpers.validation;
            this.imagMimeTypes = {
                "image/png": ".png",
                "image/jpeg": ".jpeg",
                "image/jpg": ".jpg",
                "image/webp": ".webp",
                "image/tiff": ".tif",
                "image/bmp": ".bnp",
                "image/gif": ".gif"
            };
        }
        // method to validate all types of inputs
    validateRequired(inputs) {
            // define validation result
            const validations = [];
            // loop through data array
            for (let input of inputs) {
                if(Array.isArray(input.type)) {
                    let types = input.type;
                    let inputType = typeof input.data;
                    if(input.data == null) {
                        inputType = "null";
                    }
                    if(Array.isArray(input.data)) {
                        inputType = "array";
                    }
                    // check if the input type is one of the available types
                    if(!types.includes(inputType)) {
                        let result = {
                            message: input.message ||
                                `${input.name} is required and should be one of these types ${types.join(" , ")}`,
                            fieldName: input.name
                        };
                        // push the result into validations array
                        validations.push(result);
                    }
                }
                if (input.type == "string-number") {
                    if (this.validation.isString(input.data) && this.validation.notEmptyString(input.data)) {
                        // continue
                    } else {
                        if (Number.isNaN(input.data - input.data)) {
                            let result = {
                                message: input.message ||
                                    `${input.name} is required and should be string or number`,
                                fieldName: input.name
                            };
                            // push the result into validations array
                            validations.push(result);
                        }
                    }
                }
                // check if type of input is string
                if (input.type == "string") {
                    if (this.validation.isString(input.data) && this.validation.notEmptyString(input.data)) {
                        // continue
                    } else {
                        let result = {
                            message: input.message ||
                                `${input.name} is required and should be a valid ${input.type}`,
                            fieldName: input.name
                        };
                        validations.push(result);
                    }
                }
                // method to check if the input is number
                if (input.type == "number") {
                    if (Number.isNaN(input.data - input.data)) {
                        let result = {
                            message: input.message ||
                                `${input.name} is required and should be a valid ${input.type}`,
                            fieldName: input.name
                        };
                        // push the result into validations array
                        validations.push(result);
                    }
                }
                // check if type of input is object
                if (input.type == "object") {
                    if (this.validation.isObject(input.data) && this.validation.notEmpty(input.data)) {
                        // continue
                    } else {
                        let result = {
                            message: input.message ||
                                `${input.name} is required and should be an ${input.type}`,
                            fieldName: input.name
                        };
                        validations.push(result);
                    }
                }
                // check if the input is email
                if (input.type == "email") {
                    // continue
                    if (
                        this.validation.isString(input.data) &&
                        this.validation.notEmptyString(input.data) &&
                        this.validation.checkEmail(input.data)
                    ) {
                        // continue
                    } else {
                        let result = {
                            message: input.message ||
                                `${input.name} is required and should be a valid ${input.type}`,
                            fieldName: input.name
                        };
                        validations.push(result);
                    }
                }
                // check if the input is phone number
                if (input.type == "phone") {
                    if (
                        this.validation.isString(input.data) &&
                        this.validation.notEmptyString(input.data) &&
                        input.data.length == 11 &&
                        input.data.startsWith("0")
                    ) {
                        // continue
                    } else {
                        let result = {
                            message: input.message ||
                                `${input.name} is required and should be a valid ${
                input.type
              }, with 11 digit`,
                            fieldName: input.name
                        };
                        validations.push(result);
                    }
                }
                // check if the type is file
                if (input.type == "image") {
                    // check if there are data
                    if (!input.data) {
                        // return error
                        let result = {
                            message: input.message ||
                                `${input.name} is required and should be an ${input.type}`,
                            fieldName: input.name
                        };
                        // push validation errors into validations array
                        validations.push(result);
                    } else {
                        // check if the mime type is image
                        if (this.imagMimeTypes[input.data.mimetype]) {
                            // continue
                        } else {
                            let result = {
                                message: input.message || `${input.name} should be an ${input.type}`,
                                fieldName: input.name
                            };
                            validations.push(result);
                        }
                    }
                }
                if (input.type == "array") {
                    if (Array.isArray(input.data) && input.data.length > 0) {
                        // continue
                        // check if there is of property
                        if(this.validation.isString(input.of) && this.validation.notEmptyString(input.of)) {
                            let existType = input.data.find(item => {
                                if(input.of == "object") {
                                    if (typeof item == "object" && !Array.isArray(item) && item !== null) {
                                        return item;
                                        // continue
                                    } else {
                                        return undefined;
                                    }
                                } else if(input.of == "array") {
                                    if(Array.isArray(item)) {
                                        return item;
                                        // continue
                                    } else {
                                        return undefined;
                                    }
                                } else if(input.of == "string") {
                                    if(this.validation.isString(item)) {
                                        return item;
                                        // continue
                                    } else {
                                        return undefined;
                                    }
                                } else if(input.of == "number") {
                                    if(item && Number.isNaN(item - item)) {
                                        // continue
                                        return item;
                                    } else {
                                        return undefined;
                                    }
                                }
                            })
                            if(!existType) {
                                let result = {
                                    message: input.message ||
                                        `${input.name} should be an ${input.type} and should includes valid items`,
                                    fieldName: input.name
                                };
                                validations.push(result);
                            }
                        }
                    } else {
                        let result = {
                            message: input.message ||
                                `${input.name} should be an ${input.type} and shouldn't be empty`,
                            fieldName: input.name
                        };
                        validations.push(result);
                    }
                }
                // check the object has two properties
                if (input.type == "object" && input.length == ">=2") {
                    if (
                        this.validation.isObject(input.data) &&
                        this.validation.notEmpty(input.data) &&
                        Object.keys(input.data).length >= 2
                    ) {
                        // continue
                    } else {
                        let result = {
                            message: input.message ||
                                `${input.name} should be an ${input.type} and shouldn't be empty`,
                            fieldName: input.name
                        };
                        validations.push(result);
                    }
                }
                if (input.type == "boolean") {
                    if (input.data == true || input.data == false) {
                        // continue
                    } else {
                        let result = {
                            message: input.message || `${input.name} should be a ${input.type}`,
                            fieldName: input.name
                        }
                        validations.push(result);
                    }
                }
            }
            // return validations array
            return validations;
        }
        // method to validate optional fields
    validateOptional(inputs) {
        const validations = [];
        // loop through data array
        for (let input of inputs) {
            // check if the type of input is number
            if (input.type == "number") {
                // check if the input is exist
                if (input.data && Number.isNaN(input.data - input.data)) {
                    let result = {
                        message: input.message || `${input.name} should be an ${input.type}`,
                        fieldName: input.name
                    };
                    validations.push(result);
                }
            }
        }
        // return validations errors
        return validations;
    }
}

// export validation class
module.exports = new Validator();