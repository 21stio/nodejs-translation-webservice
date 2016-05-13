import {ITranslation} from "./ITranslation";
import Promise = require("bluebird");
import {ILanguageSupportProvider} from "./ILanguageSupportProvider";

export interface ITranslator {
    translate(fromLanguage:string, toLanguage:string, sentence:string):Promise<Array<ITranslation>>;
    getLanguageSupportProvider():ILanguageSupportProvider;
}