const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---readme-md": hot(preferDefault(require("/home/flynn/code/web/ros/react-ros/docs/README.md"))),
  "component---src-hello-mdx": hot(preferDefault(require("/home/flynn/code/web/ros/react-ros/docs/src/hello.mdx"))),
  "component---src-pages-404-js": hot(preferDefault(require("/home/flynn/code/web/ros/react-ros/docs/.docz/src/pages/404.js")))
}

