import {ITranslator} from "./ITranslator";
import {ILanguageSupportProvider} from "./ILanguageSupportProvider";

export abstract class Translator implements ITranslator {

    languageSupportProvider:ILanguageSupportProvider;

    constructor(languageSupportProvider:ILanguageSupportProvider) {
        this.languageSupportProvider = languageSupportProvider;
    }

    getLanguageSupportProvider():ILanguageSupportProvider {
        return this.languageSupportProvider;
    }
}