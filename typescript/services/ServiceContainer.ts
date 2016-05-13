import {TranslatorContainer} from "./translators/TranslatorContainer";

export class ServiceContainer {
    private translatorContainer:TranslatorContainer;

    constructor(translatorContainer:TranslatorContainer) {
        this.translatorContainer = translatorContainer;
    }

    getTranslatorContainer():TranslatorContainer {
        return this.translatorContainer;
    }
}