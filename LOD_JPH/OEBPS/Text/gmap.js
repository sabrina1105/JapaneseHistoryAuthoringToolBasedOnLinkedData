
function gmap_setup(lat,long,comment) {
//�s���Ƀ}�E�X�I�[�o�[�����Ƃ��̃e�L�X�g
var markTitle = '�����s��';


console.log("aaa");
//�E�B���h�E�̃R���e���c
var contentString = comment;
console.log(comment);
contentString.toString();
console.log("1");
//�ܓx�E�o�x
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

