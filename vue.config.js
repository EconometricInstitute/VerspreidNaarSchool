module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  outputDir: path.resolve(__dirname, "docs"),
  publicPath: process.env.NODE_ENV === 'production' ? '/VeiligNaarSchool/' : '/',
  pages: {
    index: {
      entry: './src/main.js',
      title: 'Veilig Naar School'
    }
  }  
}
