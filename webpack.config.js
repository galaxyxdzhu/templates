const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 入口起点：使用 entry 配置手动地分离代码。
// 防止重复：使用 Entry dependencies 或者 SplitChunksPlugin 去重和分离 chunk。
// 动态导入：通过模块的内联函数调用来分离代码。

module.exports = {
  mode: 'development', // 编译环境
  entry: {
    index: './main.js',
    another: './print.js'
  }, // 入口文件
  output: {
    // filename: 'main.js', // 输出的文件名
    filename: '[name].[contenthash].bundle.js', // 在文件代码没有改动的时候，此时打包，hash值不变
    path: path.resolve(__dirname, 'dist'), // 输出的文件路径
    clean: true // 打包前清空dist文件夹
  },
  devtool: 'inline-source-map', // 原始代码映射

  // webpack 提供几种可选方式，帮助你在代码发生变化后自动编译代码：
  // webpack's Watch Mode -- webpack --watch  自动检测并执行webpack  需刷新浏览器
  // webpack-dev-server -- 提供了一个基本的 web server，并且具有 live reloading(实时重新加载) 功能
  // webpack-dev-middleware -- 把 webpack 处理过的文件发送到一个 server， 需要在output中设置publicPath指向单独的server文件

  devServer: {
    static: './dist'
  },

  // module配置 处理资源文件
  // 模块中loader可实现链式调用，执行顺序是数组中从后往前依次执行
  module: {
    rules: [
      // 处理css文件， css-loader解析css文件中的代码，将解析的内容传递给style-loader,style-loader将解析的内容挂在到html页面中
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      // 处理图片文件

      //webpack5使用四种新增的资源模块（Asset Modules）替代了这些loader的功能。
      // asset/resource 将资源分割为单独的文件，并导出url，就是之前的 file-loader的功能.
      // asset/inline 将资源导出为dataURL（url(data:)）的形式，之前的 url-loader的功能.
      // asset/source 将资源导出为源码（source code）. 之前的 raw-loader 功能.
      // asset 自动选择导出为单独文件或者 dataURL形式（默认为8KB）. 之前有url-loader设置asset size limit 限制实现。
      {
        test: /\.(png|jpe?g|svg|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024
          }
        }
      },
      // 处理字体资源
      {
        test: /\.(woff|woff2|eot|ttf|oft)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    // 生成html模板，自动引入打包后的js文件
    new HtmlWebpackPlugin({
      title: 'development',
      template: path.resolve(__dirname, 'index.html')
    })
  ],
  optimization: {
    runtimeChunk: 'single',

    // 将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中，是比较推荐的做法，这是因为，它们很少像本地的源代码那样频繁修改。因此通过实现以上步骤，利用 client 的长效缓存机制，命中缓存来消除请求，并减少向 server 获取资源，同时还能保证 client 代码和 server 代码版本一致。通过cacheGroups选项来实现
    // webpack4中，每个 module.id 会默认地基于解析顺序(resolve order)进行增量。也就是说，当解析顺序发生变化，ID 也会随之改变，我们将 optimization.moduleIds 设置为 'deterministic', 但在webpack5中，生产环境默认设置为'deterministic'
    splitChunks: {
      // moduleIds: 'deterministic',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}
