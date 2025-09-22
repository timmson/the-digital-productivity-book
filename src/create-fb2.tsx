import {create, fragment} from "xmlbuilder2"
import {GlobalConfig} from "./config"
import {XMLBuilder} from "xmlbuilder2/lib/interfaces";

interface Fb2Config extends GlobalConfig {

}

/*
http://www.fictionbook.org/index.php/%D0%9E%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5_Fictionbook
 */

export const createFB2 = (config: Fb2Config, children: Array<any>): any => {
    const child = fragment("section")

    return {
        "FictionBook": {
            "description": {
                "title-info": {
                    "book-title": config.title,
                    "author": {
                        "first-name": config.author.firstName,
                        "last-name": config.author.lastName
                    },
                    "date": config.year,
                },
                "document-info": {}
            },
            "body": {}
        }
    }
}


// export const createChapter = (config: Fb2Config, structure: any): Array<Paragraph> => {
//     return structure.map((paragraph) => {
//         switch (paragraph.type) {
//             case "heading":
//                 return [
//                     new Paragraph({
//                         pageBreakBefore: paragraph.depth == 1,
//                         heading: `Heading${paragraph.depth}`,
//                         children: [
//                             new TextRun({
//                                 text: paragraph.text,
//                             })
//                         ]
//                     })
//                 ]
//             case "list":
//                 return paragraph.items.map((it) =>
//                     new Paragraph({
//                         bullet: {
//                             level: 0
//                         },
//                         children: [
//                             new TextRun({
//                                 text: it.text,
//                                 size: "12pt"
//                             })
//                         ]
//                     })
//                 )
//             case "table":
//                 return [
//                     new Table({
//                         rows: [
//                             new TableRow({
//                                 children: paragraph.header.map((it) =>
//                                     new TableCell({
//                                         children: [
//                                             new Paragraph({
//                                                 children: [
//                                                     new TextRun({
//                                                         text: it.text,
//                                                         size: "12pt"
//                                                     })
//                                                 ]
//                                             })
//                                         ]
//                                     })
//                                 )
//                             }),
//                             ...paragraph.rows.map((row) => new TableRow({
//                                 children: row.map((it) => new TableCell({
//                                     children: [
//                                         new Paragraph({
//                                             children: [
//                                                 new TextRun({
//                                                     text: it.text,
//                                                     size: "12pt"
//                                                 })
//                                             ]
//                                         })
//                                     ]
//                                 }))
//                             }))
//                         ]
//                     })
//                 ]
//             case "blockquote":
//                 return [
//                     new Paragraph({
//                         pageBreakBefore: paragraph.depth,
//                         children: [
//                             new TextRun({
//                                 text: paragraph.text,
//                                 italics: true,
//                                 size: "14pt"
//                             })
//                         ]
//                     })
//                 ]
//             default:
//                 return [
//                     new Paragraph({
//                         children: [
//                             new TextRun({
//                                 text: paragraph.text,
//                                 size: "12pt"
//                             })
//                         ]
//                     })
//                 ]
//         }
//
//     }).flat()
// }
