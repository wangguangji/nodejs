

var mysql = require('mysql');

var pool  = mysql.createPool({
    host:'192.168.1.162',
    user:'root',
    port: 3309, 
    password:'tsoft.cn'
});

function start(response,request){
	console.log("Request handler 'start' was called .");
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("start ");
    response.end();
}

function upload(response,request){
	console.log("Request handler 'upload' was called .");
	response.writeHead(200,{"Content-Type":"text/html"});  
    response.write("You've sent: ");
    response.end();
}


function removeConditionField(response,request){
    console.log(" 删除条件 信息 ");
    pool.getConnection(function(err, connection) {
         connection.query( 'SHOW DATABASES', function(err, rows) {
         console.log("rows"+rows.length);
         for (var i=0;i<rows.length ;i++ )
        {
            if(rows[i].Database.indexOf('tech_soft_drp')==0){
                connection.changeUser({database:rows[i].Database}, function(err) {
                      if (err) throw err;
                    }); 
                connection.query("DELETE FROM BASE_CONDITIONFIELD");
            }
        } 
        connection.end();
        response.writeHead(200,{"Content-Type":"text/html"});  
        response.write("removeConditionField  seccessed !! ");
        response.end();
    
      });
    });
}

exports.start = start;
exports.upload =upload;
exports.removeConditionField = removeConditionField;