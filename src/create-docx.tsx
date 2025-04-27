import {Document, Paragraph, HeadingLevel, TextRun} from "docx"

interface Structure {
    title: string
    font: string
}

export const createDOCX = (structure: Structure) =>
    new Document({
            sections: [
                {
                    children: [
                        new Paragraph({
                            heading: HeadingLevel.HEADING_1,
                            children: [
                                new TextRun({
                                    text: structure.title,
                                    font: structure.font,
                                    size: "28pt",
                                    bold: true
                                })
                            ]
                        })
                    ]
                }
            ]
        }
    )
