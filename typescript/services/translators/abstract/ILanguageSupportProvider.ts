export interface ILanguageSupportProvider {
    isTranslationSupported(fromLanguage:string, toLanguage:string):boolean;
}