export const globalConfig = {
    title: "Цидукция. Жить, а не выжимать!",
    author: {
        firstName: "Артём",
        lastName: "Кротов"
    },
    genre: {
        popular_business: "80",
        sci_psychology: "80",
        sci_culture: "70",
        sci_business: "80",
        management: "80",
    },
    year: "2025",
    version: "1.0",
    annotation: "Добавить аннотацию!",
    cover: {
        "name": "cover.jpg",
        "base64": ""
    }
}

export interface GlobalConfig {
    title: string
    author: {
        firstName: string
        lastName: string
    }
    genre: { [key: string]: string }
    year: string
    version: string
    annotation: string
    cover: {
        name: string
        base64: string
    }
}