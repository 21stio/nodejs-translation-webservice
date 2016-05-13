import appContainer = require('../../../AppContainer');
import * as Chai from 'chai';
import cheerio = require('cheerio');
import {ITranslation} from "../../../services/translators/abstract/ITranslation";
import request_promise = require("request-promise");

describe('DictTranslator', function () {
    var dictTranslator = appContainer.getServiceContainer().getTranslatorContainer().getDictTranslator();

    describe('#translate()', function () {
        it('checks whether the correct translations are returned', function (done) {
            let translations = [
                {
                    fromLanguage: 'DE',
                    toLanguage: 'EN',
                    sentence: 'hallo',
                    expected: 13
                },
                {
                    fromLanguage: 'DE',
                    toLanguage: 'EN',
                    sentence: 'guten abend',
                    expected: 1
                },
                {
                    fromLanguage: 'DE',
                    toLanguage: 'EN',
                    sentence: 'Abend',
                    expected: 5
                },
                {
                    fromLanguage: 'DE',
                    toLanguage: 'EN',
                    sentence: 'Apfel',
                    expected: 1
                },
                {
                    fromLanguage: 'DE',
                    toLanguage: 'SQ',
                    sentence: 'hallo',
                    expected: 1
                },
                {
                    fromLanguage: 'SQ',
                    toLanguage: 'DE',
                    sentence: 'hallo',
                    expected: Error
                }
            ];


            var count = 0;

            translations.forEach(function(translation){
                var url = dictTranslator.getUrl(translation.fromLanguage, translation.toLanguage, translation.sentence);

                dictTranslator.translate(translation.fromLanguage, translation.toLanguage, translation.sentence).then(function(results:Array<ITranslation>){
                    //console.log('translate ' + translation.sentence + ' from ' + translation.fromLanguage + ' to ' + translation.toLanguage + ' url ' + url + ' results ' + results.length);

                    results.forEach(function(result){
                        Chai.assert.isNumber(result.confidence_score);
                        Chai.assert.isNumber(result.confidence);
                        Chai.assert.isString(result.sentence);
                        Chai.assert.isArray(result.sentence_hints);
                        Chai.assert.isString(result.translation);
                        Chai.assert.isArray(result.translation_hints);
                    });

                    Chai.assert.equal(results.length, translation.expected);


                    //console.log(results);
                }).error(function(error: Error){
                    console.log(error);
                }).finally(function(){
                    if(++count == translations.length) {
                        done();
                    }
                });
            });

        });
    });

    describe('#parseHints()', function () {
        it('checks whether the correct hints are returned', function (done) {
            let sentences = [
                {
                    input: 'kriegen [veraltet] [Krieg führen]',
                    expected: ['veraltet', 'Krieg führen']
                },
                {
                    input: 'kriegen [veraltet]',
                    expected: ['veraltet']
                }
            ];

            sentences.forEach(function (sentence) {
                Chai.assert.sameMembers(dictTranslator.parseHints(sentence.input), sentence.expected);
            });

            done();
        });
    });

    describe('#parseTranslation()', function () {
        it('checks whether the correct translation is returned', function (done) {
            let sentences = [
                {
                    input: 'kriegen [veraltet] [Krieg führen]',
                    expected: 'kriegen'
                },
                {
                    input: 'kriegen auf [veraltet] [Krieg führen]',
                    expected: 'kriegen auf'
                },
                {
                    input: 'kriegen',
                    expected: 'kriegen'
                }
            ];

            sentences.forEach(function (sentence) {
                Chai.assert.equal(dictTranslator.parseTranslation(sentence.input), sentence.expected);
            });

            done();
        });
    });

    describe('#getUrl()', function () {
        it('checks whether the correct url is returned', function (done) {
            let sentences = [
                {
                    fromLanguage: 'DE',
                    toLanguage: 'EN',
                    sentence: 'hallo',
                    expected: 'http://de-en.dict.cc/?s=hallo'
                },
                {
                    fromLanguage: 'DE',
                    toLanguage: 'EN',
                    sentence: 'guten abend',
                    expected: 'http://de-en.dict.cc/?s=guten+abend'
                }
            ];

            sentences.forEach(function (sentence) {
                var actual = dictTranslator.getUrl(sentence.fromLanguage, sentence.toLanguage, sentence.sentence);

                Chai.assert.equal(actual, sentence.expected);
            });

            done();
        });
    });

    describe('#parseRow()', function () {
        it('checks whether the row is parsed correctly', function (done) {

            let rows = [
                {
                    html: '<tr id="tr1"><td class="td7cml" style="background-color: rgb(233, 233, 233);"><img src="http://www4.dict.cc/img/but_info.gif" height="18" width="18" onmouseover="this.src=but_dd1.src" onmouseout="if(parentNode.parentNode.id.substr(2,4)!=cmopened)this.src=but_dd.src" style="border:1px solid #666" onclick="cmopen(parentNode.parentNode.id.substr(2,4),1)"><img src="http://www4.dict.cc/img/but_speech.gif" width="18" height="18" onmouseover="this.src=but_big11.src" onmouseout="this.src=but_big1.src" onclick="cmclick(parentNode.parentNode.id.substr(2,4),1)" style="border:1px solid #666"></td><td class="td7nl" dir="ltr" style="background-color: rgb(233, 233, 233);">to <a href="/englisch-deutsch/get.html">get</a> <a href="/englisch-deutsch/%5Breceive%5D.html"><kbd>[receive]</kbd></a></td><td class="td7nl" dir="ltr" style="background-color: rgb(233, 233, 233);"><div style="float:right;color:#999">728</div><a href="/deutsch-englisch/kriegen.html"><b>kriegen</b></a> <a href="/deutsch-englisch/%5Bugs.%5D.html"><kbd title="umgangssprachlich">[ugs.]</kbd></a> <a href="/deutsch-englisch/%5Bbekommen%5D.html"><kbd>[bekommen,</kbd></a> <a href="/deutsch-englisch/%5Berhalten%5D.html"><kbd>erhalten]</kbd></a> </td><td class="td7cmr" style="background-color: rgb(233, 233, 233);"><img src="http://www4.dict.cc/img/but_speech.gif" width="18" height="18" onmouseover="this.src=but_big21.src" onmouseout="this.src=but_big2.src" onclick="cmclick(parentNode.parentNode.id.substr(2,4),2)" style="border:1px solid #666"><img src="http://www4.dict.cc/img/but_info.gif" height="18" width="18" onmouseover="this.src=but_dd1.src" onmouseout="if(parentNode.parentNode.id.substr(2,4)!=cmopened)this.src=but_dd.src" style="border:1px solid #666" onclick="cmopen(parentNode.parentNode.id.substr(2,4),2)"></td></tr>',
                    toLanguageColumnIndex: 1,
                    expected: {
                        sentence: 'kriegen',
                        sentence_hints: ['ugs.', 'bekommen, erhalten'],
                        translation: 'to get',
                        translation_hints: ['receive'],
                        confidence: NaN,
                        confidence_score: 728,
                    }
                },
                {
                    html: '<tr id="tr1"><td class="td7cml"><img src="http://www4.dict.cc/img/pxl.gif" width="40" height="20"></td><td class="td7nl" dir="ltr"><a href="/englisch-deutsch/Good.html">Good</a> <a href="/englisch-deutsch/evening%21.html">evening!</a></td><td class="td7nl" dir="ltr"><a href="/deutsch-englisch/Guten.html"><b>Guten</b></a> <a href="/deutsch-englisch/Abend%21.html"><b>Abend</b>!</a> </td><td class="td7cmr"><img src="http://www4.dict.cc/img/pxl.gif" width="40" height="20"></td></tr>',
                    toLanguageColumnIndex: 1,
                    expected: {
                        sentence: 'Guten Abend!',
                        sentence_hints: [],
                        translation: 'Good evening!',
                        translation_hints: [],
                        confidence: NaN,
                        confidence_score: NaN
                    }
                }
            ];

            rows.forEach(function(row){
                let element = cheerio.load(row.html)('tr').eq(0).get()[0];
                var actual = dictTranslator.parseRow(element, row.toLanguageColumnIndex);

                Chai.assert.deepEqual(actual, row.expected);
            });

            done();
        });
    });

    describe('#calculateConfidence()', function () {
        it('checks whether the confidence is calculated correctly', function (done) {
            var translations = [
                {
                    translations: [
                        {
                            sentence: '',
                            sentence_hints: [],
                            translation: '',
                            translation_hints: [],
                            confidence: NaN,
                            confidence_score: 1000
                        },
                        {
                            sentence: '',
                            sentence_hints: [],
                            translation: '',
                            translation_hints: [],
                            confidence: NaN,
                            confidence_score: 10
                        },{
                            sentence: '',
                            sentence_hints: [],
                            translation: '',
                            translation_hints: [],
                            confidence: NaN,
                            confidence_score: 100
                        }
                    ],
                    expected: [
                        {
                            sentence: '',
                            sentence_hints: [],
                            translation: '',
                            translation_hints: [],
                            confidence: 1,
                            confidence_score: 1000
                        },
                        {
                            sentence: '',
                            sentence_hints: [],
                            translation: '',
                            translation_hints: [],
                            confidence: 0.1,
                            confidence_score: 100
                        },
                        {
                            sentence: '',
                            sentence_hints: [],
                            translation: '',
                            translation_hints: [],
                            confidence: 0.01,
                            confidence_score: 10
                        }
                    ]
                },
                {
                    translations: [
                        {
                            sentence: '',
                            sentence_hints: [],
                            translation: '',
                            translation_hints: [],
                            confidence: NaN,
                            confidence_score: 1000
                        }
                    ],
                    expected: [
                        {
                            sentence: '',
                            sentence_hints: [],
                            translation: '',
                            translation_hints: [],
                            confidence: 1,
                            confidence_score: 1000
                        }
                    ]
                },
                {
                    translations: [
                        {
                            sentence: '',
                            sentence_hints: [],
                            translation: '',
                            translation_hints: [],
                            confidence: NaN,
                            confidence_score: NaN
                        }
                    ],
                    expected: [
                        {
                            sentence: '',
                            sentence_hints: [],
                            translation: '',
                            translation_hints: [],
                            confidence: 0,
                            confidence_score: 0
                        }
                    ]
                },
            ];

            translations.forEach(function(translation){
                var actual = dictTranslator.calculateConfidence(translation.translations);

                Chai.assert.sameDeepMembers(actual, translation.expected);
            });

            done();
        });
    });

    describe('#getTranslationColumnIndex()', function () {
        it('checks whether the correct translation column index is returned', function (done) {
            let languages = [
                {
                    url: 'http://de-en.dict.cc/?s=Hallo',
                    toLanguageName: 'Englisch',
                    expected: 1
                },
                {
                    url: 'http://en-fr.dict.cc/?s=Hello',
                    toLanguageName: 'French',
                    expected: 1
                },
                {
                    url: 'http://de-en.dict.cc/?s=guten+abend',
                    toLanguageName: 'Englisch',
                    expected: 1
                }
            ];

            let requestCount = 0;

            languages.forEach(function (language) {
                request_promise(language.url).then(function (html:string) {
                    let actual = dictTranslator.getTranslationColumnIndex(html, language.toLanguageName);

                    Chai.assert.equal(actual, language.expected);

                    if(++requestCount == languages.length) {
                        done();
                    }
                });
            });
        });
    });

});