import {GlobalConfig} from "./config"
import {Document, Paragraph, HeadingLevel, TextRun, FileChild, Table, TableRow, TableCell} from "docx"

interface DocxConfig extends GlobalConfig{
    font: string
}

export const createDOCX = (config: DocxConfig, children: Array<FileChild>) =>
    new Document({
            sections: [
                {
                    children: [
                        new Paragraph({
                            heading: HeadingLevel.TITLE,
                            children: [
                                new TextRun({
                                    text: config.title,
                                    font: config.font,
                                    size: "28pt",
                                })
                            ]
                        }),
                        ...children
                    ]
                }
            ]
        }
    )


export const createChapter = (config: DocxConfig, structure: any): Array<Paragraph> => {
    return structure.map((paragraph) => {
        switch (paragraph.type) {
            case "heading":
                return [
                    new Paragraph({
                        pageBreakBefore: paragraph.depth == 1,
                        heading: `Heading${paragraph.depth}`,
                        children: [
                            new TextRun({
                                text: paragraph.text,
                                font: config.font,
                            })
                        ]
                    })
                ]
            case "list":
                return paragraph.items.map((it) =>
                    new Paragraph({
                        bullet: {
                            level: 0
                        },
                        children: [
                            new TextRun({
                                text: it.text,
                                font: config.font,
                                size: "12pt"
                            })
                        ]
                    })
                )
            case "table":
                return [
                    new Table({
                        rows: [
                            new TableRow({
                                children: paragraph.header.map((it) =>
                                    new TableCell({
                                        children: [
                                            new Paragraph({
                                                children: [
                                                    new TextRun({
                                                        text: it.text,
                                                        font: config.font,
                                                        size: "12pt"
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                )
                            }),
                            ...paragraph.rows.map((row) => new TableRow({
                                children: row.map((it) => new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [
                                                new TextRun({
                                                    text: it.text,
                                                    font: config.font,
                                                    size: "12pt"
                                                })
                                            ]
                                        })
                                    ]
                                }))
                            }))
                        ]
                    })
                ]
            case "blockquote":
                return [
                    new Paragraph({
                        pageBreakBefore: paragraph.depth,
                        children: [
                            new TextRun({
                                text: paragraph.text,
                                font: config.font,
                                italics: true,
                                size: "14pt"
                            })
                        ]
                    })
                ]
            default:
                return [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: paragraph.text,
                                font: config.font,
                                size: "12pt"
                            })
                        ]
                    })
                ]
        }

    }).flat()
}
