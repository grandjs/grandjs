export const JSX = {
  createElement(name: string, props: { [id: string]: string }, ...content: string[]) {
    props = props || {};
    const propsstr = Object.keys(props)
      .map(key => {
        const value = props[key];
        if (key === "className") return `class=${value}`;
        else return `${key}=${value}`;
      })
      .join(" ");
      return `<${name} ${propsstr}> ${content.join("")}</${name}>`;
  },
};

export default JSX;
