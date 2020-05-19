const { mergeWith } = require('docz-utils')
const fs = require('fs-extra')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err),
    )
  }
}

const config = {
  pathPrefix: '/react-ros/',

  siteMetadata: {
    title: 'react-ros',
    description: 'My awesome app using docz',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: {},
        src: './',
        gatsbyRoot: null,
        themesDir: 'src',
        mdxExtensions: ['.md', '.mdx'],
        docgenConfig: {},
        menu: [],
        mdPlugins: [],
        hastPlugins: [],
        ignore: [],
        typescript: false,
        ts: false,
        propsParser: true,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: null,
        o: null,
        open: null,
        'open-browser': null,
        root: '/home/flynn/code/web/ros/react-ros/docs/.docz',
        base: '/react-ros/',
        source: './',
        'gatsby-root': null,
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: './dest/',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'react-ros',
        description: 'My awesome app using docz',
        host: 'localhost',
        port: 3000,
        p: 3000,
        separator: '-',
        paths: {
          root: '/home/flynn/code/web/ros/react-ros/docs',
          templates:
            '/home/flynn/code/web/ros/react-ros/docs/node_modules/docz-core/dist/templates',
          docz: '/home/flynn/code/web/ros/react-ros/docs/.docz',
          cache: '/home/flynn/code/web/ros/react-ros/docs/.docz/.cache',
          app: '/home/flynn/code/web/ros/react-ros/docs/.docz/app',
          appPackageJson:
            '/home/flynn/code/web/ros/react-ros/docs/package.json',
          appTsConfig: '/home/flynn/code/web/ros/react-ros/docs/tsconfig.json',
          gatsbyConfig:
            '/home/flynn/code/web/ros/react-ros/docs/gatsby-config.js',
          gatsbyBrowser:
            '/home/flynn/code/web/ros/react-ros/docs/gatsby-browser.js',
          gatsbyNode: '/home/flynn/code/web/ros/react-ros/docs/gatsby-node.js',
          gatsbySSR: '/home/flynn/code/web/ros/react-ros/docs/gatsby-ssr.js',
          importsJs:
            '/home/flynn/code/web/ros/react-ros/docs/.docz/app/imports.js',
          rootJs: '/home/flynn/code/web/ros/react-ros/docs/.docz/app/root.jsx',
          indexJs:
            '/home/flynn/code/web/ros/react-ros/docs/.docz/app/index.jsx',
          indexHtml:
            '/home/flynn/code/web/ros/react-ros/docs/.docz/app/index.html',
          db: '/home/flynn/code/web/ros/react-ros/docs/.docz/app/db.json',
        },
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
