module.exports = (env) => {
    const cmd = process.env['npm_lifecycle_event']
    const theme = !cmd ? 'classic' : cmd.split(':')[1]
    return require(`./webpack.${env}.js`)(theme)
}