var express = require('express'),
	app = express();

app.get('/', function(req, res){
	res.send('静态资源已启动...');
});

app.listen(8000, '0.0.0.0', function(){
	console.log('static is running...');
});
