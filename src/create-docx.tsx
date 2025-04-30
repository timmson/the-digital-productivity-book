import {lexer} from "marked"
import {Document, Paragraph, HeadingLevel, TextRun, FileChild} from "docx"

interface Config {
    title: string
    font: string
}

export const createDOCX = (config: Config, children: Array<FileChild>) =>
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


export const createChapter = (config: Config, structure: any): Array<Paragraph> => {
    return structure.map((paragraph)  => {
        switch (paragraph.type) {
            case "heading":
                return new Paragraph({
                    pageBreakBefore: paragraph.depth == 1,
                    heading: `Heading${paragraph.depth}`,
                    children: [
                        new TextRun({
                            text: paragraph.text,
                            font: config.font,
                        })
                    ]
                })
            default:
                return new Paragraph({
                    children: [
                        new TextRun({
                            text: paragraph.text,
                            font: config.font,
                            size: "12pt"
                        })
                    ]
                })
        }

    })
}
