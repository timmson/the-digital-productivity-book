export const globalConfig = {
    title: "Цидукуция. Советы по продуктивности в цифровом мире",
    author: {
        firstName: "Артём",
        lastName: "Кротов"
    },
    genre: "popular_business",
    year: "2025",
    version: "1.0",
    cover: {
        "name" : "cover.jpg",
        "base64" : ""
    }
}

export interface GlobalConfig {
    title: string
    author: {
        firstName: string
        lastName: string
    }
    genre: string
    year: string
    version: string
    cover: {
        name: string
        base64: string
    }
}