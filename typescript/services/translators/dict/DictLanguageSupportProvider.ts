import {ILanguageSupportProvider} from "../abstract/ILanguageSupportProvider";
import {TranslationNotSupportedError} from "../error/TranslationNotSupportedError";

export class DictLanguageSupportProvider implements ILanguageSupportProvider {
    languageSupport = {
        DE: {
            BG: 'Bulgarisch',
            BS: 'Bosnisch',
            CS: 'Tschechisch',
            DA: 'Dänisch',
            EL: 'Griechisch',
            EN: 'Englisch',
            EO: 'Esperanto',
            ES: 'Spanisch',
            FI: 'Finnisch',
            FR: 'Französisch',
            HR: 'Kroatisch',
            HU: 'Ungarisch',
            IS: 'Isländisch',
            IT: 'Italienisch',
            LA: 'Latein',
            NL: 'Niederländisch',
            NO: 'Norwegisch',
            PL: 'Polnisch',
            PT: 'Portugiesisch',
            RO: 'Rumänisch',
            RU: 'Russisch',
            SK: 'Slowakisch',
            SQ: 'Albanisch',
            SR: 'Serbisch',
            SV: 'Schwedisch',
            TR: 'Türkisch'
        },
        EN: {
            BG: 'Bulgarian',
            BS: 'Bosnian',
            CS: 'Czech',
            DA: 'Danish',
            DE: 'Deutsch',
            EL: 'Greek',
            EO: 'Esperanto',
            ES: 'Spanish',
            FI: 'Finnish',
            FR: 'French',
            HR: 'Croatian',
            HU: 'Hungarian',
            IS: 'Icelandic',
            IT: 'Italian',
            LA: 'Latin',
            NL: 'Dutch',
            NO: 'Norwegian',
            PL: 'Polish',
            PT: 'Portuguese',
            RO: 'Romanian',
            RU: 'Russian',
            SK: 'Slovak',
            SQ: 'Albanian',
            SR: 'Serbian',
            SV: 'Swedish',
            TR: 'Turkish'
        }
    };

    isTranslationSupported(fromLanguage:string, toLanguage:string):boolean {
        var self = this;

        if (self.languageSupport[fromLanguage] && self.languageSupport[fromLanguage][toLanguage]) {
            return true;
        }

        throw new TranslationNotSupportedError(fromLanguage, toLanguage);
    }

    getToLanguageName(fromLanguage:string, toLanguage:string):string {
        return this.languageSupport[fromLanguage][toLanguage];
    }
}