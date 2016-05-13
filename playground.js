var cheerio = require('cheerio');
var request_promise = require('request-promise');
var fs = require('fs');


function a() {


    var withoutIdCount = 0;
    var relevantRows = [];

    $("table:eq(2) tbody tr").each(function (index) {
        var id = $(this).attr('id');

        console.log(id);

        if (id === undefined) {
            return withoutIdCount++;
        }

        if (withoutIdCount == 5) {
            relevantRows.push(this);
        }
    });

    console.log(relevantRows);
}

function b() {
    var str = 'kriegen [veraltet] [Krieg führen]';

    var splits = str.replace(/\[/g, '***[').split('***');

    var hints = [];

    console.log(splits);

    splits.forEach(function (element) {
        if (element.indexOf('[') > -1) {
            var hint = element.substring(element.lastIndexOf("[") + 1, element.lastIndexOf("]"))

            hints.push(hint);
        }
    });

    console.log(hints);
}

function c() {
    var start = false;
    var stop = false;

    var relevantRows = [];

    $("table:eq(2) tbody tr").each(function (index) {
        var id = $(this).attr('id');

        console.log(id);

        if (id === "tr1") {
            start = true;
        }

        if (start === true && id === undefined) {
            stop = true;
        }

        if (start === true && stop === false) {
            relevantRows.push(this);
        }
    });

    console.log(relevantRows);

    var translations = [];

    relevantRows.forEach(function (row) {
        var translation = {};

        tds = $(row).find('td');
        translation.sentence = tds.eq(1).text();
        translation.translation = tds.eq(2).find('a').text();
        translation.confidence = tds.eq(2).find('div').text();

        translations.push(translation);
    });

    console.log(translations);
}


function d(searchTerm) {
    var url = 'http://de-en.dict.cc/?s=' + searchTerm;

    return request_promise(url).then(function (html) {
        var $ = cheerio.load(html);

        var el = $('table').eq(2).find('tr').html();

        var start = false;
        console.log(el);

        var el = $('table').eq(2).find('tr').each(function (index, element) {
            var id = $(element).attr('id');

            if (id === "tr1") {

                start = true;
            }

            if (start === true && id === undefined) {

                return false;
            }

            if (start === true) {
                console.log(cheerio(element).html())
            }
        });
    });
}

function e() {
    var url = 'http://de-en.dict.cc/?s=hallo';

    return request_promise(url).then(function (html) {
        var $ = cheerio.load(html);

        var tds = $('table').eq(2).find('tr').eq(0).find('td');

        var tdIndices = [1, 2];
        tdIndices.forEach(function(tdIndex){
            var td = tds.eq(tdIndex)

            console.log(cheerio(td).html());
        });
    });
}

function f() {
    var url = 'http://de-en.dict.cc/?s=guten+abend';

    return request_promise(url).then(function (html) {
        var $ = cheerio.load(html);

        var relevantRows = [];

        $('table').eq(2).find('tr').each(function (index, element) {
            var id = $(element).attr('id');

            if (id === "tr1") {
                start = true;
            }

            if($(element).find('td').eq(2).find('div').length) {
                relevantRows.push(element);

                console.log($(element).html());
            }
        });
    });
}

function g(searchTerm) {
    var url = 'http://de-en.dict.cc/?s=' + searchTerm;

    return request_promise(url).then(function (html) {
        var $ = cheerio.load(html);

        var el = $('table').eq(2).find('tr').html();

        var passedFirstTranslation = false;
        var enteredSecondTranslationsSection = false;

        console.log(el);

        var el = $('table').eq(2).find('tr').each(function (index, element) {
            var id = $(element).attr('id');

            if (id === "tr1") {
                passedFirstTranslation = true;
            }

            if (passedFirstTranslation === true && id === undefined) {

                return false;
            }

            if (start === true) {
                console.log(cheerio(element).html())
            }
        });
    });
}

function h(searchTerm) {
    var url = 'http://de-en.dict.cc/?s=' + searchTerm;

    return request_promise(url).then(function (html) {
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
                $(element).find('td').css('border', '5px solid red');
            }
        });


        fs.writeFile("/opt/webservice/tmp/" + searchTerm + '.html', $.html(), function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    });
}






h('guten+abend');
h('apfel');
h('hallo');
h('abend');