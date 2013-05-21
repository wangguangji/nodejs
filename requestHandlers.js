var mysql = require('mysql');
var querystring = require('querystring');
var url = require('url');

var pool  = mysql.createPool({
    host:'192.168.1.162',
    user:'root',
    port: 3309, 
    password:'tsoft.cn'
});

function start(response,request){
	console.log("Request handler 'start' was called .");
    response.writeHead(200, {"Content-Type": "text/html"});
     var array = "1,2".split(",");
     console.log(array.length);
    console.log("array[0]  %s ; array[1] %s ",array[0],array[1]);
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

function checkInventoryStorage(response,request){
    console.log(" 检查 当前库 的库存异动是否异常 ！");
    // console.log(url.parse(request.url).pathname);
  
    var query = url.parse(request.url).query;

    var databaseName = querystring.parse(query)["database"];

    function callback(){
            response.writeHead(200,{"Content-Type":"text/html"});  
            response.write("good!" +resultstr);
            response.end(); 
    }

     pool.getConnection(function(err, connection) {
             connection.changeUser({database:databaseName}, function(err) {
                      if (err) throw err;
                    });
             var resultstr ="";
             connection.query('select id from base_store where state =1',function (err,rows){
                  var length = rows.length ;
                  for (var i=0;i<rows.length ;i++ ){
                    var storeId = rows[i].id ;
               
                    var sql = "SELECT GROUP_CONCAT(quantity) as quantity , skuId ,storeId FROM ( SELECT SKU_ID AS skuId ,SUM(change_QUANTITY) AS quantity,  2  AS TYPE ,store_id as storeId  FROM inventory_storage_change "+
                                "WHERE store_id=? GROUP BY sku_id "+
                                "UNION ALL " +
                                " SELECT  SKU_ID AS skuId , SUM(quantity ) quantity ,  1  AS TYPE ,store_id as storeId FROM  inventory_storage "+
                                " WHERE store_id=?  GROUP BY sku_id ) as t GROUP BY skuId  ";

                                connection.query(sql,[storeId,storeId],function (err,changerows){
                                      for (var j=0;j<changerows.length ;j++ ){
                                        var quantity =changerows[j].quantity; 
                                        var skuId = changerows[j].skuId;
                                        var array = quantity.split(","); 
                                        var storeIdstr =changerows[j].storeId;

                                        if(array.length===2 && array[0]!=array[1]){
                                            console.log("array[0] =  %s array[1] = %s  array is length %s ",array[0],array[1],array.length);
                                            resultstr+="storeId =  "+storeIdstr +" skuId =   "+skuId +"\n";  
                                        }
                                      }
                                     
                                      length --;
                                       console.log(length+"===length");
                                      if(length===1){
                                              response.writeHead(200,{"Content-Type":"text/html"});  
                                              response.write("good!" +resultstr);
                                              response.end(); 
                                      }
                                    console.log("changerows"+changerows.length);
                                });
                  }               
             });

     });

}

exports.start = start;
exports.upload =upload;
exports.removeConditionField = removeConditionField;
exports.checkInventoryStorage = checkInventoryStorage;