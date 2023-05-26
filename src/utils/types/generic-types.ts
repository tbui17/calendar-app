export type ValueOf <T> = T[keyof T]


const obj1 = {
    name: "John",
    age: 30,
    job: "mechanic",
} as const

type valueOptions = ValueOf<typeof obj1>

let key: keyof typeof obj1
for (key in obj1){
    const val2:valueOptions = "John"
    const value: ValueOf<typeof obj1> = obj1[key]
    
}

const obj2 = {
    name: "Mary",
    age: 22,
    job: "teacher",
    greet: function (name:string){
        const greetingMessage = `hello ${name}, my name is ${this.name}`
        console.log(greetingMessage)
    }
}
