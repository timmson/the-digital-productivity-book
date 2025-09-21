import * as fs from "fs"
import {Packer} from "docx"
import {createChapter, createDOCX} from "./create-docx"

import {lexer} from "marked"

let contents = fs.readFileSync("./docs/index.md", "utf-8");
const index = lexer(contents)

const config = {
    title: "Цидукуция. Советы по продуктивности в цифровом мире",
    font: "Times New Roman",
    index: index,
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

const children = [contents, ...files]
    .map((file) => createChapter(config, lexer(file)))
    .flat()

const docx = createDOCX(config, children)

Packer.toBuffer(docx).then((buffer) =>
    fs.writeFileSync("./docs/distr/the-productivity-book.docx", buffer)
)