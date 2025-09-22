import * as fs from "fs"
import {lexer} from "marked"
import {create} from "xmlbuilder2"
import {globalConfig} from "./config"
import {createChapter, createFB2} from "./create-fb2"

const contents = fs.readFileSync("./docs/index.md", "utf-8")
const index = lexer(contents)

const config = {
    ...globalConfig,
    cover: {
        ...globalConfig.cover,
        base64: fs.readFileSync(`./docs/distr/${globalConfig.cover.name}`).toString("base64")
    }
}

const extractHref = (element: any): Array<string> => {
    if (element["href"])
        return [element["href"]]
    if (element["items"] && element["items"].length > 0)
        return element["items"].map((item: any) => extractHref(item)).flat()
    if (element["tokens"] && element["tokens"].length > 0)
        return element["tokens"].map((token: any) => extractHref(token)).flat()
    return []
}

const chapters = index.map((item) => extractHref(item))
    .flat().filter((file) => file.indexOf(".md") >= 0)
    .map((file) => createChapter(fs.readFileSync(`./docs/${file}`, "utf-8")))

const xml = createFB2(config, chapters)
const fb2 = create(xml).end({prettyPrint: true})
fs.writeFileSync("./docs/distr/the-digital-productivity-book.fb2", fb2)
