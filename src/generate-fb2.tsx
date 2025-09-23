import * as fs from "fs"
import {lexer} from "marked"
import {create} from "xmlbuilder2"
import {globalConfig} from "./config"
import {createChapter, createFB2, Fb2Paragraph} from "./create-fb2"

const contents = fs.readFileSync("./docs/index.md", "utf-8")
const index = lexer(contents)

const extractHref = (element: any): Array<string> => {
    if (element["href"])
        return [element["href"]]
    if (element["items"] && element["items"].length > 0)
        return element["items"].map((item: any) => extractHref(item)).flat()
    if (element["tokens"] && element["tokens"].length > 0)
        return element["tokens"].map((token: any) => extractHref(token)).flat()
    return []
}


const fb2 = create(createFB2(globalConfig))
const body = fb2.root().ele("body")

index.map((item) => extractHref(item))
    .flat().filter((file) => file.indexOf(".md") >= 0)
    .forEach((file) => {
        createChapter(fs.readFileSync(`./docs/${file}`, "utf-8"), body.ele("section"))
    })

fb2.root().ele("binary")
    .att("id", globalConfig.cover.name)
    .att("content-type", "image/jpeg")
    .txt(fs.readFileSync(`./docs/distr/${globalConfig.cover.name}`).toString("base64"))

const src= fb2.end({prettyPrint: true}).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
fs.writeFileSync("./docs/distr/the-digital-productivity-book.fb2", src)
