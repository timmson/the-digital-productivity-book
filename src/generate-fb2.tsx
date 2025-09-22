import * as fs from "fs"
import {lexer} from "marked"
import {create} from "xmlbuilder2"
import {globalConfig} from "./config"
import {createFB2} from "./create-fb2"
import {createChapter} from "./create-docx";


let contents = fs.readFileSync("./docs/index.md", "utf-8")
const index = lexer(contents)

const config = {
    ...globalConfig,
    index: index
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

const files = index.map((item) => extractHref(item))
    .flat().filter((file) => file !== "LICENSE")
    .map((file) => fs.readFileSync(`./docs/${file}`, "utf-8"))

const children = files.map((file) => createChapter(config, lexer(file)))
    .flat()

const fb2 = createFB2(config, children)
const xml = create(fb2).end({prettyPrint: true})
console.log(xml)
//fs.writeFileSync("./docs/distr/the-digital-productivity-book.fb2", fb2)
