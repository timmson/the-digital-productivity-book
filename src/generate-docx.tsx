import * as fs from "fs"
import {Packer} from "docx"
import {createDOCX} from "./create-docx"

import {lexer} from "marked"

const structure = {
    title: "Цифровая продуктивность",
    font: "Times New Roman"
}
const index = lexer(fs.readFileSync("./docs/index.md", "utf-8"))

console.log(JSON.stringify(index, null, 2))

// const docx = createDOCX(structure)
//
// Packer.toBuffer(docx).then((buffer) =>
//     fs.writeFileSync("./docs/distr/the-productivity-book.docx", buffer)
// )