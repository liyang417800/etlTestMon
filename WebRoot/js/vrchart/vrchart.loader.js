(function(){
	
/*****************************************/
var res = {
	'raphael'	: 'js/raphael.js',
	'lin'		: 'js/vrchart.lin.js',
	'pie'		: 'js/vrchart.pie.js',
	'map'		: 'js/vrchart.map.js'
}
/*****************************************/
	
var loadScript = function(url, callback){
	var o = document.createElement('SCRIPT');
	o.type = 'text/javascript'; 
	o.src = url;
	var callback = typeof(arguments[1]) == 'function' ? arguments[1] : null; 
	document.getElementsByTagName('HEAD')[0].appendChild(o);
	if(!/*@cc_on!@*/0) {
		o.onload = function(){
			this.parentNode.removeChild(this);
			if(callback){ callback(); } 
		};
	}else{
		o.onreadystatechange = function () { 
			if (this.readyState == 'loaded' || this.readyState == 'complete') { 
				this.parentNode.removeChild(this);
				if(callback){ callback(); }
			}
		}
	}
}

var state = {};
for(var key in res){ state[key] = 0; }

//readystate
//0 未开始
//1 发出请求等待中
//4 成功
var loadRes = function(key){
	if(state[key] == 1){ return; }
	if(state[key] == 0){ state[key] = 1; }
	loadScript(res[key], function(){
		state[key] = 4;
	});
}

var loadChartJS = function(key, callback){
	if(state['raphael'] == 4 && state[key] == 4){ callback(); return; }
	if(state['raphael'] != 4){ loadRes('raphael'); } 
	if(state[key] != 4){ loadRes(key); }
	var time = 0;
	var timer = setInterval(function(){
		if(state['raphael'] == 4 && state[key] == 4){
			clearInterval(timer);
			callback();
		}
		//wait 20s
		if(time >= 20000){ clearInterval(timer); }
		time += 25;
	}, 25);	
}

if(!window['VRCHART']){ window['VRCHART'] = {}; }
VRCHART.loadChartJS = loadChartJS;

})();