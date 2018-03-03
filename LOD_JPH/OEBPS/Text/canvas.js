

/*グラフを作成する*/
function graph_setup(id,data_a){

dataPlot=make_dataPlot(id,data_a);

console.log(dataPlot);
  
//チャートの生成


var chart = new CanvasJS.Chart("statis", {
  title:{
     text:data_a[id][0]
},
  data: [{
    type: 'pie',
    dataPoints: dataPlot
  }]
});
chart.render();


}

var data_count=5;

function make_dataPlot(id,data_a){

 
 var ret_a= new Array();
 var ret_id=0;

 element_a=data_a[id];
console.log("canvas.js");
 console.log(data_a);
 for(var i=1;i<=data_count;i++){
var ret_obj =new Object();
    ret_obj['label']=element_a[2*i-1];
    ret_obj['y']=Number(element_a[2*i]);
ret_a.push(ret_obj);
}
  
return ret_a;


}