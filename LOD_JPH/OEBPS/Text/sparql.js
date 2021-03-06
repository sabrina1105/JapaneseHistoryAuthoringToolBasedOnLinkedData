
//対象にするhtmlの要素
var obj;
var url;


//解説文データを格納する配列
var description_a;

//説明文を表示する番号
var des_id = 0;


//画像データを格納する配列
var image_a;

//画像Store,DBpediaのプロジェクト名?1 project是什么
var target_RDF = new Array();
target_RDF = ["test_school", "test_dbpedia"];

//画像を表示する番号
var image_id = 0;



//地理情報を格納する配列
var geo_a;
var geo_id = 0;

//右上画面の表示されている項目
// 0 画像    1 地理情報
var flag_1 = 0;

//右上画面の表示されている項目
// 0 統計   1 問題
var flag_2 = 0;






//統計データを格納する配列
var statis_a;
var statis_id = 0;

//問題データを格納する配列

var question_a;
var question_id=0;


/*
 
  キーワード検索が行われたときに呼び出される
　
  キーワードの情報をRDFストアから収集する。

　収集した情報は、配列に格納する。

*/

function collectInfo() {

    update(getBaseUrl());
   
    //window.setTimeout(function () { show_description(des_id) }, 5000);
    //9:42 2016/11/07 window.setTimeout(function(){ show_gmap(0)},3200);
    //window.setTimeout(function () { show_statis(statis_id) }, 3700);
    window.setTimeout(function () { show_image(image_id) }, 4300);
   //window.setTimeout(function () { showLeftDown()}, 4900);

}




/**
 *左下に　問題・統計データを表示する表示する
 *初期状態からスタートする
 */
function showLeftDown() {
    //統計データがない
    if (statis_a[0] == undefined) {
        if (question_a[0] == undefined) {
            //問題データがない　　何もしない
        } else {
            //問題表示
            console.log("問題の方を表示");
            off_statis();
            flag_2 = 1;
            show_question(0);
        }
    }
        //統計データがある
    else {
        //統計表示
        console.log("統計の方を表示");
        off_question();
        flag_2 = 0;
        show_statis(0);

    }

}


/*  
    HTMLファイルから検索ワードを取得する
    
　　return　キーワードを検索するためのURL　
　　
*/
///????
function getBaseUrl() {
    var str;
    str = document.getElementById('form').value;
    console.log("document:" + str.value);
    return makeBaseUrl(str);
}

/*

    キーワードをもとに検索用URLを生成する

*/
function makeBaseUrl(key) {
    //return "http://ja.dbpedia.org/resource/" + key;
    return "https://upload.wikimedia.org/wikipedia/commons/9/9a/" + key;
}






/*
function update(){

             getKey();
             window.setTimeout( function(){console.log("結果Url："+url)},100 );
              window.setTimeout( function(){show_label()},100 );

             window.setTimeout( function(){show_description()},200 );
             window.setTimeout( function(){show_image()},300 );
             window.setTimeout( function(){show_question()},400);
             window.setTimeout( function(){show_choice(1)},450);
              window.setTimeout( function(){show_choice(2)},500);
             window.setTimeout( function(){show_choice(3)},550);
             window.setTimeout( function(){show_choice(4)},600);            
}

*/

function update(Url) {
   // window.setTimeout(function () { collect_description(Url) }, 300);
   // window.setTimeout(function () { collect_geo(Url) }, 600);
   // window.setTimeout(function () { collect_statis(Url) }, 1000);
    window.setTimeout(function () { collect_image(Url) }, 1500);
   // window.setTimeout(function () { collect_question(Url)},2200);

}
//function SparqlSend(project_id, cmd){....}


function getUrl(key) {
    obj = "-1";
    return SparqlSend("test_asagao", "select * where {?s rdfs:label \"" + key + "\"} LIMIT 1");
}

//ラベルの更新
function show_label() {
    obj = document.getElementById("label");
    SparqlSend("test_asagao", "select * where {<" + url + "> rdfs:label ?o} LIMIT 1");//?label 是?o??????
}


//説明文の更新
//用Url来收集文字信息

function collect_description(Url) {
    obj = document.getElementById("description");
    description_a = new Array();
    sparql = "select ?label ?description where {<" + Url + "> rdfs:comment ?description; rdfs:label ?label;}LIMIT 100";
    SparqlSend("test_dbpedia", sparql);

    sparql = "select ?label ?des where{ ?s owl:sameAs \"" + Url + "\"; rdfs:comment ?des; rdfs:label ?label;} LIMIT 10";
    window.setTimeout(function () { SparqlSend("test_description", sparql) }, 100);
}

//画像情報の収集
function collect_image(Url) {
    obj = document.getElementById('image');

    //画像情報格納用の配列を初期化
    image_a = new Array();
    //sparql = "select ?image ?comment where{ ?s owl:sameAs \"" + Url + "\"; <http://xmlns.com/foaf/0.1/depiction> ?image; rdfs:comment ?comment}";
    sparql = "select * where {?s rdfs:label ?label;rdfs:isDefinedBy ?isDefinedBy.}"
    console.log("start");
    SparqlSend_virtuoso("http://133.5.24.71:8890/sparql", sparql, function(data){
        console.log(data);
    });
    //SparqlSend("test_school", sparql);
    //sparql = "select ?image where {<" + Url + "> <http://xmlns.com/foaf/0.1/depiction> ?image;}LIMIT 100";
    //window.setTimeout(function () { SparqlSend("test_dbpedia", sparql); }, 100);
}
//地理情報の収集

function collect_geo(Url) {
    obj = document.getElementById('gmap');


   
    geo_a = new Array();
    sparql = "select ?lat ?long ?comment where{ ?s owl:sameAs \"" + Url + "\"; rdfs:comment ?comment;geo:long ?long;geo:lat ?lat;} LIMIT 10";
    SparqlSend("test_geo", sparql);
}

//統計情報の収集

function collect_statis(Url) {
    obj = document.getElementById('statis');

    console.log("collect statis");

    //画像情報格納用の配列を初期化
    statis_a = new Array();
    sparql = "select ?comment ?element1 ?value1 ?element2 ?value2   ?element3 ?value3   ?element4 ?value4  ?element5 ?value5 where {?s owl:sameAs \"" + Url + "\";rdfs:comment ?comment;<http://sgmhr.jp/element1> ?element1;<http://sgmhr.jp/element2> ?element2;<http://sgmhr.jp/element3> ?element3;<http://sgmhr.jp/element4> ?element4;<http://sgmhr.jp/element5> ?element5;<http://sgmhr.jp/value1> ?value1;<http://sgmhr.jp/value2> ?value2;<http://sgmhr.jp/value3> ?value3;<http://sgmhr.jp/value4> ?value4;<http://sgmhr.jp/value5> ?value5;} LIMIT 10";
    SparqlSend("test_statistics", sparql);
}


//問題情報の収集

function collect_question(Url) {
    obj = document.getElementById('queall');

    console.log("collect question");

    //画像情報格納用の配列を初期化
   question_a = new Array();
    sparql = "select ?question ?choice1 ?choice2 ?choice3 ?choice4 where {?s owl:sameAs \"" + Url + "\"; <http://sgmhrp.jp/question> ?question;<http://sgmhrp.jp/choice1> ?choice1;<http://sgmhrp.jp/choice2> ?choice2;<http://sgmhrp.jp/choice3> ?choice3;<http://sgmhrp.jp/choice4> ?choice4;} LIMIT 100";
    SparqlSend("test_question", sparql);
}






/*

function show_question() {
    obj = document.getElementById("question");
    SparqlSend("test_asagao", "select * where {<" + url + "> schema:question ?o} LIMIT 1");
}
*/
function show_choice(id) {
    obj = document.getElementById("choice" + id);
    SparqlSend("test_asagao", "select * where {<" + url + "> schema:choice" + id + " ?o} LIMIT 1");
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

    obj.src = image_a[id][0];


    obj = document.getElementById('imgDes');

    if (image_a[id][1] == undefined) {
        image_a[id][1] = image_a[id][0];
    }
    obj.innerHTML = image_a[id][1];
}


/*

  指定されたid番目の解説文を左画面に表示する

*/

function show_description(id) {

    obj = document.getElementById('description');
    obj.innerHTML = "";
    console.log("Debug");
console.log(description_a);
console.log(id);

 var ret_a=description_a[id];
    

console.log(ret_a);
    


    str = ret_a[1];
    obj.innerHTML = str;
    obj.style.fontFamily = "'Book Antiqua',serif;";

    obj = document.getElementById('label');
    obj.innerHTML = "";
    str = description_a[id][0];
    obj.innerHTML = str;
    obj.style.fontFamily = "'Book Antiqua',serif;";
}

/*

  指定されたid番目のGoogle Mapを右上画面に表示する

*/

function show_gmap(id) {
    console.log("gmap起動");
    console.log(geo_a);
    obj = document.getElementById('gmap');

    obj.style.display = "";
    console.log("a");
    console.log(geo_a[id][0]);
    console.log(geo_a[id][0]);
    gmap_setup(geo_a[id][0], geo_a[id][1], geo_a[id][2]);
}

/*

   指定されたid番目の統計グラフを右下画面に表示する

*/

function show_statis(id) {

    obj = document.getElementById('statis');
    obj.style.display = "";

    graph_setup(id, statis_a);
   // statis_a


}

/*
*指定されたidのQuestionを表示する　問題のHTMLオブジェクトを有効にする
*/
function show_question(id){

obj = document.getElementById('question');
obj.style.display = "";
str=question_a[id][0];
    obj.innerHTML = str;
    obj.style.fontFamily = "'Book Antiqua',serif;";

obj = document.getElementById('choice1');
obj.style.display = "";
str=question_a[id][1];
    obj.innerHTML = str;
    obj.style.fontFamily = "'Book Antiqua',serif;";

obj = document.getElementById('choice2');
obj.style.display = "";
str=question_a[id][2];
    obj.innerHTML = str;
    obj.style.fontFamily = "'Book Antiqua',serif;";

obj = document.getElementById('choice3');
obj.style.display = "";
str=question_a[id][3];
    obj.innerHTML = str;
    obj.style.fontFamily = "'Book Antiqua',serif;";

obj = document.getElementById('choice4');
obj.style.display = "";
str=question_a[id][4];
    obj.innerHTML = str;
    obj.style.fontFamily = "'Book Antiqua',serif;";


    document.getElementById('No1').style.display = "";
    document.getElementById('No2').style.display = "";
    document.getElementById('No3').style.display = "";
    document.getElementById('No4').style.display = "";
    document.getElementById('QuestionMain').style.display = "";

}





/*
 
  Google Map を非表示にする

*/

function off_gmap() {
    document.getElementById('gmap').style.display = "none";
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

function off_question() {
    document.getElementById('choice1').style.display = "none";
    document.getElementById('choice2').style.display = "none";
    document.getElementById('choice3').style.display = "none";
    document.getElementById('choice4').style.display = "none";
    document.getElementById('question').style.display = "none";
    document.getElementById('No1').style.display = "none";
    document.getElementById('No2').style.display = "none";
    document.getElementById('No3').style.display = "none";
    document.getElementById('No4').style.display = "none";
    document.getElementById('QuestionMain').style.display = "none";

}

/*
統計データを非表示にする

*/

function off_statis() {

    document.getElementById('statis').style.display = "none";

}


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


function que_prev() {
    //統計モード
    if (flag_2 == 0) {
        if (statis_id <= 0) {

            flag_2 = 1;
            question_id = question_a.length - 1;
            off_statis();
            show_question(question_id);
        } else {
            statis_id--;
            show_statis(statis_id);
        }

        //問題モード
    } else if (flag_2 == 1) {
        if (question_id <= 0) {
            flag_2 = 0;
            statis_id = statis_a.length - 1;
            off_question();
            show_statis(statis_id);
        } else {
            question_id--;
            show_question(question_id);
        }
    }
}

function que_next() {
    //統計モード
    if (flag_2 == 0) {
        if (statis_id >= statis_a.length - 1) {

            flag_2 = 1;
            question_id = 0;
            off_statis();
            show_question(question_id);
        } else {
            statis_id++;
            show_statis(statis_id);
        }

        //問題モード
    } else if (flag_2 == 1) {
        if (question_id >= question_a.length - 1) {
            flag_2 = 0;
            statis_id = 0;
            off_question();
            show_statis(statis_id);
        } else {
            question_id++;
            show_question(question_id);
        }
    }
}

function des_prev() {

    if (des_id <= 0) {
        des_id = description_a.length - 1;
    } else {
        des_id--;
    }

    show_description(des_id);

}

function des_next() {

    if (des_id <= 0) {
        des_id = description_a.length - 1;
    } else {
        des_id--;
    }

    show_description(des_id);

}


/*

   sparqlEPCUにて情報を取り出す
　 JSON形式 (?)にて情報を取り出した後、適切な形で
　 image_a, description_aに格納していく
　 画像、解説、地理、統計データが処理可能

*/


//SPARQLの実行
function SparqlSend(project_id, cmd) {
    //インスタンスの宣言
    var rdfmgr = new RDFmgr();
    var stext = $("#sparql").val();

    //executeSparql()でSPARQL検索を行う
    rdfmgr.executeSparql({
        sparql: cmd,
        inference: false,//?设置Json格式的数据?
        projectID: project_id,
        success: maketable,
        error: getErrorMsg
    });
}


function maketable(re) {  //会不会是从excuteSparql函数执行完之后得到的结果???????没定义就可以直接用吗？
console.log(obj.id);

console.log(re);

    var str = new String("");

    if (obj.id == "image") {
        //画像データの処理
        while (re.next()) {
            var ret_img = new Array();
            for (var i = 0; i < re.getLength() ; i++) {
                ret_img[i] = re.getValue(i);
            }
            image_a.push(ret_img);
        }
       // console.log("画像配列");
       // console.log(image_a);
        return;
    }
    //他のデータについても同様に配列に格納していく
//}


      //解説文データの処理
    if (obj.id == "description") {

        while (re.next()) {
            var ret_des = new Array();
            for (var i = 0; i < re.getLength() ; i++) {

                ret_des[i] = re.getValue(i);
            }
            description_a.push(ret_des);
        }

        console.log("解説文配列");
        console.log(description_a);
        return;
    }

    if (obj.id == "gmap") {
        //地理データの処理

        while (re.next()) {
            var ret_map = new Array();
            for (var i = 0; i < re.getLength() ; i++) {
                ret_map[i] = re.getValue(i);
            }
            geo_a.push(ret_map);
        }
        console.log("地理情報配列");
        console.log(geo_a);
        return;
    }


    if (obj.id == "statis") {
        //統計データの処理

        while (re.next()) {
            var ret_statis = new Array();
            for (var i = 0; i < re.getLength() ; i++) {
                ret_statis[i] = re.getValue(i);
            }
            statis_a.push(ret_statis);
        }
        console.log("統計情報配列");
        console.log(statis_a);
        return;
    }

console.log("問題log");
console.log(obj.id);
    if (obj.id=="queall") {
        //問題データの処理
console.log("問題Mian");
        while (re.next()) {
            var ret_question = new Array();
            for (var i = 0; i < re.getLength() ; i++) {
                ret_question[i] = re.getValue(i);
            }
            question_a.push(ret_question);
        }
        console.log("問題情報配列");
        console.log(question_a);
        return;
    }



    /*
                     if(obj=="-1"){
                        url=str;
                        console.log("結果Url____："+url);
                        return str;
                     } else{
                      //文字データの処理
                    obj.innerHTML="";
                    obj.innerHTML=str;
                    obj.style.fontFamily="'Book Antiqua',serif;";
                       }
    */
}
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
    }).done(function (data) { callback(data); });

}

//image是从virtuoso中取到的值

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

