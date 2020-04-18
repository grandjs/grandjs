"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSX = {
    createElement(name, props, ...content) {
        props = props || {};
        const propsstr = Object.keys(props)
            .map(key => {
            const value = props[key];
            if (key === "className")
                return `class=${value}`;
            else
                return `${key}=${value}`;
        })
            .join(" ");
        return `<${name} ${propsstr}> ${content.join("")}</${name}>`;
    },
};
exports.default = exports.JSX;
