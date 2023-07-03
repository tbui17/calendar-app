import { EN_US } from "./en-us";
import { LANGUAGE } from "@/configs/language";

class LanguageService{
    constructor(private language:"en-us"){
        this.language = language;
    }
    

    get(key: keyof typeof EN_US){
        // implement file read based on language later
            
        const text = EN_US[key as keyof typeof EN_US]
        if (text === undefined){
            return "undefined"
        }
        return text
    }
}

export const languageService = new LanguageService(LANGUAGE)