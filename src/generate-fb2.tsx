import * as fs from "fs"
import {lexer} from "marked"
import {create} from "xmlbuilder2"
import {globalConfig} from "./config"
import {createChapter, createFB2, Fb2Paragraph} from "./create-fb2"
import {XMLBuilder} from "xmlbuilder2/lib/interfaces";

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

const addFb2Chapter = (section: XMLBuilder, paragraph: Fb2Paragraph) => {
    const newSection = section.ele(paragraph.name)

    if (paragraph.name === "empty-line") {
        return
    }

    if (typeof paragraph.value === "string") {
        newSection.txt(paragraph.value)
    } else {
        addFb2Chapter(newSection, paragraph.value)
    }
}

const fb2 = create(createFB2(config))

index.map((item) => extractHref(item))
    .flat().filter((file) => file.indexOf(".md") >= 0)
    .map((file) => createChapter(fs.readFileSync(`./docs/${file}`, "utf-8")))
    .forEach((chapter) => {
        const section = fb2.root().ele("body").ele("section")
        chapter.map((paragraph) => {
            addFb2Chapter(section, paragraph)
        })
    })

const src= fb2.end({prettyPrint: true}).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
fs.writeFileSync("./docs/distr/the-digital-productivity-book.fb2", src)
