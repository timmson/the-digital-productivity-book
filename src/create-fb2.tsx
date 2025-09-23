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
        },
        "binary": [
            {
                "@id": config.cover.name,
                "@content-type": "image/jpeg",
                "#": config.cover.base64
            }
        ]
    }
})

/**
 * code type
 *
 */

export const createChapter = (file: string, section: XMLBuilder) => {
    lexer(file).forEach((paragraph) => {
        switch (paragraph.type) {
            case "heading":
                (paragraph.depth === 1 ? section.ele("title") : section.ele("subtitle")).txt(paragraph.text)
                break
            case "paragraph":
                section.ele("p").txt(paragraph.text)
                break
            case "blockquote":
                section.ele("p").ele("emphasis").txt(paragraph.text)
                break
            case "space":
                section.ele("empty-line")
                break
            case "list":
                paragraph.items.map((it) => section.ele("p").txt(`- ${it.text}`))
                break
            case "table":
                const table = section.ele("table")

                //header
                const header = table.ele("tr")
                paragraph.header.forEach((it) => header.ele("th").ele("p").txt(it.text))

                //rows
                paragraph.rows.forEach((row) => {
                    const tr = table.ele("tr")
                    row.forEach((cell) => {
                        tr.ele("td").txt(cell.text)
                    })
                })
                break
            case "code":
                section.ele("p").ele("code").txt(paragraph.text)
                break
            default:
                section.ele("p").txt(`???? - ${paragraph.type}`)
        }
    })
}
