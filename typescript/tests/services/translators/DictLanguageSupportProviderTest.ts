import appContainer = require('../../../AppContainer');
import * as Chai from 'chai';
import cheerio = require('cheerio');
import {ITranslation} from '../../../services/translators/abstract/ITranslation';
import {DictLanguageSupportProvider} from '../../../services/translators/dict/DictLanguageSupportProvider';

describe('DictLanguageSupportProvider', function () {
    var dictLanguageSupportProvider:DictLanguageSupportProvider = appContainer.getServiceContainer().getTranslatorContainer().getDictTranslator().getLanguageSupportProvider();

    describe('#isTranslationSupported()', function () {
        it('checks whether the correct languages are supported', function (done) {
            let languages = [
                {
                    fromLanguage: 'DE',
                    toLanguage: 'EN',
                    expected: true
                },
                {
                    fromLanguage: 'EN',
                    toLanguage: 'DE',
                    expected: true
                },
                {
                    fromLanguage: 'DE',
                    toLanguage: 'SQ',
                    expected: true
                },
                {
                    fromLanguage: 'SQ',
                    toLanguage: 'EN',
                    expected: false
                },
                {
                    fromLanguage: 'ER',
                    toLanguage: 'SQ',
                    expected: false
                }
            ];

            languages.forEach(function (language) {
                Chai.assert.equal(dictLanguageSupportProvider.isTranslationSupported(language.fromLanguage, language.toLanguage), language.expected);
            });

            done();
        });
    });

    describe('#getToLanguageName()', function () {
        it('checks whether the correct language name is returned', function (done) {
            let languages = [
                {
                    fromLanguage: 'DE',
                    toLanguage: 'EN',
                    expected: 'Englisch'
                },
                {
                    fromLanguage: 'EN',
                    toLanguage: 'DE',
                    expected: 'Deutsch'
                },
                {
                    fromLanguage: 'DE',
                    toLanguage: 'SQ',
                    expected: 'Albanisch'
                },
                {
                    fromLanguage: 'EN',
                    toLanguage: 'SQ',
                    expected: 'Albanian'
                }
            ];

            languages.forEach(function (language) {
                Chai.assert.equal(dictLanguageSupportProvider.getToLanguageName(language.fromLanguage, language.toLanguage), language.expected);
            });

            done();
        });
    });

});