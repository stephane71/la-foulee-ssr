const test = {
  context: '/Users/stephane/Work/serveless-deploy-test',
  entry: {
    'main.js': [ '/Users/stephane/Work/serveless-deploy-test/node_modules/next/dist/client/next.js' ],
    'bundles/pages/_document.js': [ './pages/_document.js?entry' ],
    'bundles/pages/event.js': [ './pages/event.js?entry' ],
    'bundles/pages/index.js': [ './pages/index.js?entry' ],
    'bundles/pages/search.js': [ './pages/search.js?entry' ],
    'bundles/pages/_error.js': [ '/Users/stephane/Work/serveless-deploy-test/node_modules/next/dist/pages/_error.js?entry' ]
  },
  output: {
    path: '/var/folders/cc/mrt_sfy93w31ghs70chj08fh0000gn/T/4f4f13ab-37f3-425f-aa69-3bd1b8736094/.next',
    filename: '[name]',
    libraryTarget: 'commonjs2',
    publicPath: '/_next/819034fe-d2f8-4584-91e5-3503c156ef00/webpack/',
    strictModuleExceptionHandling: true,
    // devtoolModuleFilenameTemplate: [Function: devtoolModuleFilenameTemplate],
    chunkFilename: '[name]'
  },

  resolve: {
     modules:[
       '/Users/stephane/Work/serveless-deploy-test/node_modules/next/node_modules',
        'node_modules'
    ]
  },

  resolveLoader: {
    modules: [
      '/Users/stephane/Work/serveless-deploy-test/node_modules/next/node_modules',
      'node_modules',
      '/Users/stephane/Work/serveless-deploy-test/node_modules/next/dist/server/build/loaders'
    ]
  },

  plugins: [
    IgnorePlugin {
       resourceRegExp: /(precomputed)/,
       contextRegExp: /node_modules.+(elliptic)/,
       checkIgnore: [Function: bound checkIgnore]
     },
     LoaderOptionsPlugin {
       options: [Object]
     },
     {
       apply: [Function: apply]
     },
     CommonsChunkPlugin {
       chunkNames: [Array],
       filenameTemplate: 'commons.js',
       minChunks: [Function: minChunks],
       selectedChunks: undefined,
       children: undefined,
       async: undefined,
       minSize: undefined,
       ident: '/Users/stephane/Work/serveless-deploy-test/node_modules/webpack/lib/optimize/CommonsChunkPlugin.js0'
     },
     CommonsChunkPlugin {
       chunkNames: [Array],
       filenameTemplate: 'manifest.js',
       minChunks: undefined,
       selectedChunks: undefined,
       children: undefined,
       async: undefined,
       minSize: undefined,
       ident: '/Users/stephane/Work/serveless-deploy-test/node_modules/webpack/lib/optimize/CommonsChunkPlugin.js1'
     },
     DefinePlugin {
       definitions: [Object]
     },
     PagesPlugin {},
     PagesPlugin {},
     CaseSensitivePathsPlugin {
       options: {},
       pathCache: {},
       fsOperations: 0,
       primed: false
     },
     IgnorePlugin {
       resourceRegExp: /react-hot-loader/,
       contextRegExp: undefined,
       checkIgnore: [Function: bound checkIgnore]
     },
     CombineAssetsPlugin {
       input: [Array],
       output: 'app.js'
     },
     UglifyJsPlugin {
       options: [Object]
     },
     ModuleConcatenationPlugin {
       options: {}
     }
   ],

   module: {
     rules: [
       {
         test: /\.json$/,
         loader: 'json-loader'
       },
       {
         test: /\.(js|json)(\?[^?]*)?$/,
         loader: 'emit-file-loader',
         include: [
           '/Users/stephane/Work/serveless-deploy-test',
           '/Users/stephane/Work/serveless-deploy-test/node_modules/next/dist/pages'
         ],
         exclude: [Function: exclude],
         options: {
           name: 'dist/[path][name].[ext]',
           transform: [Function: transform]
         }
       },
       {
         loader: 'babel-loader',
         include: '/Users/stephane/Work/serveless-deploy-test/node_modules/next/dist/pages',
         exclude: [Function: exclude],
         options: {
           babelrc: false,
           cacheDirectory: true,
           presets: [Array]
         }
       },
       { test: /\.js(\?[^?]*)?$/,
         loader: 'babel-loader',
         include: [ '/Users/stephane/Work/serveless-deploy-test' ],
         exclude: [Function: exclude],
         options: {
           cacheDirectory: true,
           presets: [],
           babelrc: true
         }
       }
     ]
   },
   devtool: false,
   performance: {
     hints: false
   }
}
