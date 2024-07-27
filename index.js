const koa = require('koa')
const fs = require('fs')
const path = require("path")
const send = require('koa-send')
const compilerSfc = require("@vue/compiler-sfc")
const compilerDom = require("@vue/compiler-dom")
const {rewriteDefault} = require("@vue/compiler-sfc");

const App = new koa()
const port = 3000
const root = process.cwd()
console.log(root)

App.use(async (ctx) => {
  const {url, query} = ctx.request;
  console.log("url" + url, query)

  if (url === "/") {
    ctx.type = "text/html"
    const content = fs.readFileSync('./index.html', "utf-8")
    ctx.body = content
  } else if (url.endsWith(".js")) {
    const p = path.resolve(__dirname, url.slice(1))
    const content = fs.readFileSync(p, 'utf-8')
    ctx.type = 'application/javascript'
    ctx.body = content
  } else if (url.endsWith(".css")) {
    const p = path.resolve(__dirname, url.slice(1))
    const css = fs.readFileSync(p, "utf-8").replace(/\r?\n|\r/g, "").replace(/\s/g, "")
    console.log(css.toString())
    const content = `
    const css = "${css}"
    let link = document.createElement('style')
    link.setAttribute('type', 'text/css')
    document.head.appendChild(link)
    link.innerHTML = css
    export default css
    `
    ctx.type = 'application/javascript'
    ctx.body = content

  }
})


App.listen(port, () => {
  console.log("running on:" + port)
})

