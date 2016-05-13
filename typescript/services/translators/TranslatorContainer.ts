import {DictTranslator} from "./dict/DictTranslator";

export class TranslatorContainer {

    private dictTranslator: DictTranslator;

    constructor(dictTranslator:DictTranslator) {
        this.dictTranslator = dictTranslator;
    }

    getDictTranslator():DictTranslator {
        return this.dictTranslator;
    }
}