import {lexer} from "marked"
import {GlobalConfig} from "./config"

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
 * table and code type
 *
 */

export const createChapter = (file: string): Array<Fb2Paragraph> =>
    lexer(file).map((paragraph) => {
        switch (paragraph.type) {
            case "heading":
                return [{name: (paragraph.depth === 1 ? "title" : "subtitle"), value: paragraph.text}]
            case "paragraph":
                return [{name: "p", value: paragraph.text}]
            case "blockquote":
                return [{name: "emphasis", value: {name: "p", value: paragraph.text}}]
            case "space":
                return [{name: "empty-line"}]
            case "list":
                return paragraph.items.map((it) => ({name: "p", value: "- " + it.text}))
            default:
                return [{name: "p", value: `???? - ${paragraph.type}`}]
        }
    }).flat()
