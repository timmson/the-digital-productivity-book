export const globalConfig = {
    title: "Цидукуция. Советы по продуктивности в цифровом мире",
    author: {
        firstName: "Артём",
        lastName: "Кротов"
    },
    year: "2025",
    version: "1.0",
    logo: "../distr/cover.jpg"
}

export interface GlobalConfig {
    title: string
    author: {
        firstName: string
        lastName: string
    }
    year: string
    version: string
    logo: string
}