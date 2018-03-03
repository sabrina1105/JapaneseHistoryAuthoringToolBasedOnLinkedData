
function gmap_setup(lat,long,comment) {
//ピンにマウスオーバーしたときのテキスト
var markTitle = '東京都庁';


console.log("aaa");
//ウィンドウのコンテンツ
var contentString = comment;
console.log(comment);
contentString.toString();
console.log("1");
//緯度・経度
var myLatlng = new google.maps.LatLng(lat,long);
console.log("2");
var myOptions = {
    zoom: 16,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: true
}
console.log("3");
var map = new google.maps.Map(document.getElementById("gmap"), myOptions);
console.log("3.5");
var infowindow = new google.maps.InfoWindow({
    content: contentString
});
console.log("4");
var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
    title: markTitle
});
console.log("5");
google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
});
}

