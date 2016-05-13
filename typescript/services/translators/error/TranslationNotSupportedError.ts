export class TranslationNotSupportedError extends Error {

    constructor(fromLanguage:string, toLanguage:string) {
        var message = 'Translation from ' + fromLanguage + ' to ' + toLanguage + ' is not supported';

        super(message);
    }
}