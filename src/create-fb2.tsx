import {lexer} from "marked"
import {GlobalConfig} from "./config"

interface Fb2Config extends GlobalConfig {

}

/*
http://www.fictionbook.org/index.php/%D0%9E%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5_Fictionbook
 */

export const createFB2 = (config: Fb2Config, chapters: Array<any>): any => ({
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
                "genre": config.genre,
                "lang": "ru",
                "date": config.year,
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
        "body": {
            "section": chapters.map((it) => ({
                    "title": it.title,
                    "p": it.paragraphs
                }
            ))
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

export const createChapter = (file: string): any => {
    const section = {
        title: "",
        paragraphs: []
    }

    lexer(file).forEach((paragraph) => {
        switch (paragraph.type) {
            case "heading":
                if (paragraph.depth === 1) {
                    section.title = paragraph.text
                } else {
                    section.paragraphs.push(paragraph.text)
                }
                break
            case "paragraph":
                section.paragraphs.push(paragraph.text)
                break
        }
    })

    return section
}
