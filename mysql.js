/**
var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'192.168.1.162',
	user:'root',
	port: 3309, 
	password:'tsoft.cn',
	database: 'tech_soft_drp_shrrm' 
});
**/
var mysql = require('mysql');
var pool  = mysql.createPool({
	host:'192.168.1.162',
	user:'root',
	port: 3309, 
	password:'tsoft.cn',
	database: 'tech_soft_drp_shrrm' 
});


pool.getConnection(function(err, connection) {
  // Use the connection
     connection.query( 'SELECT name FROM base_company', function(err, rows) {
    // And done with the connection.
	 console.log("rows"+rows.length);
     connection.end();
    // Don't use the connection here, it has been returned to the pool.
  });
});

pool.getConnection(function(err, connection) {
    connection.query( 'SELECT name FROM base_store', function(err, rows) {
	console.log("rows"+rows.length);
    connection.end();
  });
	connection.changeUser({database:'tech_soft_drp_yebao'}, function(err) {
	  if (err) throw err;
	});
    connection.query( 'SELECT name,code FROM base_store', function(err, rows) {
    for (var i=0;i<rows.length ;i++ )
    {
		console.log("name"+rows[i].name+"code"+rows[i].code);
    }	
    connection.end();
  });
});



/*
pool.getConnection(function(err, connection) {
    if(err){
	   console.log('dajiahao');
	   connection.query( 'SELECT name FROM base_company', function(err, rows) {    
			console.log("rows"+rows.length);
			connection.end();
		});
	}
});

connection.connect(function(err) {
	if(err){
	   console.log('dajiahao');
	}
});

connection.query( 'SELECT name FROM base_company', function(err, rows) {    
	console.log("rows"+rows.length);
 });

connection.changeUser({database:'tech_soft_drp_yebao'}, function(err) {
  if (err) throw err;
});

connection.query( 'SELECT name FROM base_company', function(err, rows) {  
	console.log("rows"+rows.length);
 });

connection.on('error', function(err) {
  console.log(err.code); // 'ER_BAD_DB_ERROR'
});

connection.query('USE name_of_db_that_does_not_exist');
connection.end();
*/