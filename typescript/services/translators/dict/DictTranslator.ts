import cheerio = require('cheerio');

import {ITranslation} from "../abstract/ITranslation";

import request_promise = require("request-promise");
import Promise = require("bluebird");
import {DictLanguageSupportProvider} from "./DictLanguageSupportProvider";
import {Translator} from "../abstract/Translator";

export class DictTranslator extends Translator {

    getLanguageSupportProvider():DictLanguageSupportProvider {
        return super.getLanguageSupportProvider();
    }

    translate(fromLanguage:string, toLanguage:string, sentence:string):Promise {
        var self = this;

        return new Promise(function (resolve, reject) {
            self.getLanguageSupportProvider().isTranslationSupported(fromLanguage, toLanguage);

            var url = self.getUrl(fromLanguage, toLanguage, sentence);

            var toLanguageName = self.getLanguageSupportProvider().getToLanguageName(fromLanguage, toLanguage);

            request_promise(url).then(function (html:string) {
                resolve(self.parseTranslations(html, toLanguageName));
            });
        });
    }

    parseTranslations(html:string, toLanguageName:string):Array<ITranslation> {
        var self = this;

        var relevantRows = self.getRelevantRows(html);

        var translations:Array<ITranslation> = [];

        var translationColumnIndex = self.getTranslationColumnIndex(html, toLanguageName);

        relevantRows.forEach(function (row) {
            translations.push(self.parseRow(row, translationColumnIndex));
        });

        translations = self.calculateConfidence(translations);

        return translations;
    }

    getRelevantRows(html:string):Array<CheerioElement> {
        var start = false;

        var relevantRows:Array<CheerioElement> = [];

        var $ = cheerio.load(html);

        var passedFirstTranslation = false;
        var enteredSecondTranslationsSection = false;

        $('table').eq(2).find('tr').each(function (index, element) {
            var id = $(element).attr('id');
            var hasConfidenceScore = Boolean($(element).find('td').eq(2).find('div').length);

            if (passedFirstTranslation === true && enteredSecondTranslationsSection === true && id === undefined) {
                return false;
            }

            if (id === "tr1") {
                passedFirstTranslation = true;
            }

            if (passedFirstTranslation === true && id === undefined) {
                enteredSecondTranslationsSection = true;
            }

            if (passedFirstTranslation === true && id != undefined && hasConfidenceScore
                ||  passedFirstTranslation === true && enteredSecondTranslationsSection === false && id != undefined) {
                relevantRows.push(element);
            }
        });

        return relevantRows;
    }

    getTranslationColumnIndex(html:string, toLanguageName:string):number {
        var $ = cheerio.load(html);

        var tds = $('table').eq(2).find('tr').eq(0).find('td');

        var translationRowIndex = null;

        var tdIndices = [1, 2];
        tdIndices.forEach(function(tdIndex){
            var td = tds.eq(tdIndex);

            if(cheerio(td).html().indexOf(toLanguageName) > -1) {
                translationRowIndex = tdIndex;
            }
        });

        return translationRowIndex;
    }

    parseRow(row:CheerioElement, translationColumnIndex:number):ITranslation {
        var self = this;

        var translation:ITranslation = {};

        var sentenceColumnIndex = 3 - translationColumnIndex;

        var $ = cheerio(row);
        $.find('dfn').remove();

        var tds = $.find('td');

        translation.confidence_score = parseInt(tds.eq(2).find('div').text());
        translation.confidence = NaN;

        translation.sentence = self.parseTranslation(tds.eq(sentenceColumnIndex).text().replace(translation.confidence_score.toString(), ''));
        translation.sentence_hints = self.parseHints(tds.eq(sentenceColumnIndex).text());
        translation.translation = self.parseTranslation(tds.eq(translationColumnIndex).text().replace(translation.confidence_score.toString(), ''));
        translation.translation_hints = self.parseHints(tds.eq(translationColumnIndex).text());

        return translation;
    }

    parseHints(sentence:string):Array<String> {
        var split = sentence.replace(/\[/g, '***[').split('***');

        var hints = [];

        split.forEach(function (element) {
            if (element.indexOf('[') > -1) {
                var hint = element.substring(element.lastIndexOf("[") + 1, element.lastIndexOf("]"))

                hints.push(hint);
            }
        });

        return hints;
    }

    calculateConfidence(translations:Array<ITranslation>):Array<ITranslation> {
        var highestScore = 0;

        translations.forEach(function (translation) {
            if (isNaN(translation.confidence_score)) {
                translation.confidence_score = 0;
            }

            if (translation.confidence_score > highestScore) {
                highestScore = translation.confidence_score;
            }
        });

        translations.forEach(function (translation) {
            if (translation.confidence_score === 0) {
                translation.confidence = 0;
            } else {
                translation.confidence = translation.confidence_score / highestScore;
            }
        });

        translations.sort(function(a, b) {
            return b.confidence - a.confidence;
        });

        return translations;
    }

    parseTranslation(sentence:string):string {
        return sentence.split('[')[0].replace('Unverified', '').trim();
    }

    getUrl(fromLanguage:string, toLanguage:string, sentence:string):string {
        return 'http://' + fromLanguage.toLowerCase() + '-' + toLanguage.toLowerCase() + '.dict.cc/?s=' + sentence.replace(/\s/g, "+");
    }
}



