//対象にするhtmlの要素
var obj;

//画像データを格納する配列
var image_a;
var video_a;
var text_a;
var attack_a;
var method_a;
var damage_a;


//画像を表示する番号
var image_id = 0;
var video_id = 0;
var text_id = 0;
var attack_id=0;
var method_id = 0;
var damage_id = 0;


function collectInfo() {
    update(getBaseUrl());
    window.setTimeout(function() { show_image(image_id) }, 4300);
    window.setTimeout(function() { show_video(video_id) }, 5300);
    window.setTimeout(function() { show_text(text_id) }, 5300);

}
/*
 HTMLファイルから検索ワードを取得する

 　　return　キーワードを検索するためのURL　
 　　
 */
function getBaseUrl() {
    var str;
    str = document.getElementById('form').value;
    console.log("document:" + str);
    return makeBaseUrl(str);
}

/*

 キーワードをもとに検索用URLを生成する

 */
function makeBaseUrl(key) {
    return "http://133.5.24.71/JapaneseHistory/" + key;
}

function update(Url) {
    window.setTimeout(function() { collect_image(Url) }, 1500);
    window.setTimeout(function() { collect_video(Url) }, 1500);
    window.setTimeout(function() { collect_text(Url) }, 1500);
}


//画像情報の収集

function collect_image(key) {
    obj = document.getElementById('image');

    //画像情報格納用の配列を初期化
    image_a = new Array();

    var imagevar = document.getElementById('form').value;
    sparql = "select * from <http://133.5.24.71/JapaneseHistoryItem/> where {?s rdfs:label \"" + imagevar + "\";foaf:img ?img.}"
    //sparql = "select * from <http://localhost:8890/JP_H> where {?s rdfs:label \"" + imagevar + "\";foaf:img ?img.}"
    SparqlSend_virtuoso("http://133.5.24.71:8890/sparql", sparql, function(data) {
        console.log(data);

        obj = document.getElementById('image');
        obj.style.display = "";

        console.log(data.results.bindings[0].img.value);
        obj.src = data.results.bindings[0].img.value;

    });

}

//ビデオ情報の収集
function collect_video(key) {
    obj = document.getElementById('video');

    //ビデオ情報格納用の配列を初期化
    video_a = new Array();
    var videovar = document.getElementById('form').value;
    sparql = "select * from <http://133.5.24.71/JapaneseHistoryItem/> where {?s rdfs:label \"" + videovar + "\";rdfs:seeAlso ?seeAlso.}"
    //http://localhost:8890/JP_H
    //sparql = "select * from <http://localhost:8890/JP_H> where {?s rdfs:label \"" + videovar + "\";rdfs:seeAlso ?seeAlso.}"
    SparqlSend_virtuoso("http://133.5.24.71:8890/sparql", sparql, function(data) {
        console.log(data);

        obj = document.getElementById('video');
        obj.style.display = "";

        console.log(data.results.bindings[0].seeAlso.value);
        obj.src = data.results.bindings[0].seeAlso.value.replace("watch?v=", "embed/"); //access authority

    });
}

//文字情報の収集
function collect_text(key) {
    obj = document.getElementById('text');

    //文字情報格納用の配列を初期化
    text_a = new Array();
    var textvar = document.getElementById('form').value;
    sparql = "select * from <http://133.5.24.71/JapaneseHistoryItem/> where {?s rdfs:label \"" + textvar + "\";rdfs:comment ?comment.}"
    //sparql = "select * from <http://localhost:8890/JP_H> where {?s rdfs:label \"" + textvar + "\";rdfs:comment ?comment.}"

    SparqlSend_virtuoso("http://133.5.24.71:8890/sparql", sparql, function(data) {
        console.log(data);

        obj = document.getElementById('text');
        obj.style.display = "";

        console.log(data.results.bindings[0].comment.value);
        obj.data = data.results.bindings[0].comment.value;

    });
}

/*

 指定されたid番目の画像を右上画面に表示する

 */

function show_image(id) {
    console.log("show_image");
    console.log(id);
    console.log(image_a[id]);

    obj = document.getElementById('image');
    obj.style.display = "";

}

function show_video(id) {
    console.log("show_video");
    console.log(id);
    console.log(video_a[id]);

    obj = document.getElementById('video');
    obj.style.display = "";
}


function show_text(id) {
    console.log("show_text");
    console.log(id);
    console.log(text_a[id]);

    obj = document.getElementById('text');
    obj.style.display = "";

}

/*

 画像を　非表示にする

 */
function off_image() {
    document.getElementById('image').style.display = "none";
}

/*
 問題を非表示にする

 */




function img_prev() {
    //画像モード
    if (flag_1 == 0) {
        if (image_id <= 0) {

            flag_1 = 1;
            geo_id = geo_a.length - 1;
            off_image();
            show_gmap(geo_id);
        } else {
            image_id--;
            show_image(image_id);
        }

        //地理情報モード
    } else if (flag_1 == 1) {
        if (geo_id <= 0) {
            flag_1 = 0;
            image_id = image_a.length - 1;
            off_gmap();
            show_image(image_id);
        } else {
            geo_id--;
            show_gmap(geo_id);
        }
    }
}

function img_next() {
    //画像モード
    if (flag_1 == 0) {
        if (image_id >= image_a.length - 1) {

            flag_1 = 1;
            geo_id = 0;
            off_image();
            show_gmap(geo_id);
        } else {
            image_id++;
            show_image(image_id);
        }

        //地理情報モード
    } else if (flag_1 == 1) {
        if (geo_id >= geo_a.length - 1) {
            flag_1 = 0;
            image_id = 0;
            off_gmap();
            show_image(image_id);
        } else {
            geo_id++;
            show_gmap(geo_id);
        }
    }
}



/*
 *左下ボタン
 */

function getErrorMsg(eType, eMsg, eInfo) {
    alert(eMsg + "\n\n" + eInfo);
}


/*

 Virtuoso DBに接続する


 */


function SparqlSend_virtuoso(endpoint, sparql, callback) {

    //AJAXよりSPARQL検索を実行
    $.ajax({
        //sparql検索を呼び出すURLの指定
        url: endpoint + "?query=" + encodeURIComponent(sparql),
        dataType: "json",
    }).done(function(data) {
        callback(data);
    });

}

function callback_virtuoso(json) {

    ret_obj = json.results.bindings;

    for (var k in ret_obj) {

        obj = ret_obj[k];
        var ret_a = new Array();
        ret_id = 0;
        for (var j in obj) {
            ret_a[ret_id] = obj[j].value;
            ret_id++;
        }

        image_a.push(ret_a);
    }

}