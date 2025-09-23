import {lexer} from "marked"
import {GlobalConfig} from "./config"
import {XMLBuilder} from "xmlbuilder2/lib/interfaces";

interface Fb2Config extends GlobalConfig {

}

export interface Fb2Paragraph {
    name: string
    value?: string | Fb2Paragraph
}

/*
@also http://www.fictionbook.org/index.php/%D0%9E%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5_Fictionbook
*/

export const createFB2 = (config: Fb2Config): any => ({
    "FictionBook": {
        "@xmlns": "http://www.gribuser.ru/xml/fictionbook/2.0",
        "@xmlns:l": "http://www.w3.org/1999/xlink",
        "description": {
            "title-info": {
                "book-title": config.title,
                "author": {
                    "first-name": config.author.firstName,
                    "last-name": config.author.lastName
                },
                "genre": Object.keys(config.genre)
                    .map((genre) => ({
                        "@match": config.genre[genre],
                        "#": genre
                    })),
                "lang": "ru",
                "date": config.year,
                "version": config.version,
                "annotation": {"p": config.annotation},
                "coverage": {
                    "image": {
                        "@l:href": `#${config.cover.name}`
                    }
                }
            },
            "document-info": {
                "author": {
                    "first-name": config.author.firstName,
                    "last-name": config.author.lastName
                },
            },
            "publish-info": {
                "year": config.year
            }
        }
    }
})

export const createChapter = (section: XMLBuilder, file: string) =>
    lexer(file).forEach((paragraph) => addElement(section, paragraph))


const addElement = (parent: XMLBuilder, paragraph: any) => {
    switch (paragraph.type) {
        case "heading":
            (paragraph.depth === 1 ? parent.ele("title") : parent.ele("subtitle")).txt(paragraph.text)
            break
        case "paragraph":
            const p = parent.ele("p")
            paragraph.tokens.forEach((it) => addStyle(it, p))
            break
        case "blockquote":
            paragraph.tokens.forEach((it) => parent.ele("p").ele("cite").txt(it.text))
            break
        case "space":
            parent.ele("empty-line")
            break
        case "list":
            paragraph.items.forEach((item) => {
                const p = parent.ele("p")
                item.tokens[0].tokens.forEach((it, index) =>
                    addStyle(index === 0 ? {...it, text: "- " + it.text} : it, p)
                )
            })
            break
        case "table":
            const table = parent.ele("table")

            //header
            const header = table.ele("tr")
            paragraph.header.forEach((cell) => {
                const p = header.ele("th").ele("p")
                cell.tokens.forEach((it) => addStyle(it, p))
            })

            //rows
            paragraph.rows.forEach((row) => {
                const tr = table.ele("tr")
                row.forEach((cell) => {
                    const p = tr.ele("td").ele("p")
                    cell.tokens.forEach((it) => addStyle(it, p))
                })
            })
            break
        case "code":
            parent.ele("p").ele("code").txt(paragraph.text)
            break
        default:
            console.log(paragraph.type)
            console.log(paragraph.text)
    }
};

const addStyle = (chunk: any, parent: XMLBuilder) => {
    switch (chunk.type) {
        case "strong":
            parent.ele("strong").txt(chunk.text)
            break
        case "em":
            parent.ele("emphasis").txt(chunk.text)
            break
        case "codespan":
            parent.ele("code").txt(chunk.text)
            break
        case "text":
            parent.txt(chunk.text)
            break
        default:
            console.log(chunk.type)
            console.log(chunk.text)
    }
}

