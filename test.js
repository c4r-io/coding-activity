const dependencies= {
    "@myst-theme/frontmatter": "^0.5.10",
    "@myst-theme/site": "^0.5.10",
    "@myst-theme/styles": "^0.5.10",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@uiw/react-codemirror": "^4.21.20",
    "myst-common": "^1.1.11",
    "myst-demo": "^0.5.10",
    "myst-ext-exercise": "^1.0.5",
    "myst-ext-grid": "^1.0.5",
    "myst-ext-proof": "^1.0.7",
    "myst-ext-tabs": "^1.0.5",
    "myst-frontmatter": "^1.1.11",
    "myst-parser": "^1.0.12",
    "myst-theme": "file:myst-theme",
    "myst-to-html": "^1.0.12",
    "myst-to-react": "^0.5.10",
    "myst-transforms": "^1.1.9",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "rehype-raw": "^7.0.0",
    "save": "^2.9.0",
    "storybook": "^7.5.3",
    "tailwind": "^4.0.0",
    "web-vitals": "^2.1.4"
  }

  const keylist = Object.keys(dependencies)

  await Deno.writeTextFile("./hello.txt", keylist.join(" "));

  console.log("File written to ./hello.txt");