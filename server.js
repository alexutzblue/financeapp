var express = require('express'),
        bodyParser = require('body-parser'),
        path = require('path'),
        mysql = require('mysql');

var app = express();

var port = 4711;

var connection = mysql.createConnection({
    port: 3306,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node'
});
connection.connect();

app.configure(function () {
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'site')));
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});


app.listen(port, function () {
    console.log('Express is listening on port %s', port);
});

//routes
app.get('/api', function (request, response) {
    response.send('Library API is running');
});


app.get('/api/transactions', function (request, response) {
    connection.query('SELECT tr.id, tr.name, tr.value, tr.type, tr.category_id, tr.date, cat.name as category, col.color_name as categoryColor ' +
        'FROM transactions as tr ' +
        'LEFT JOIN categories as cat ON tr.category_id = cat.id ' +
        'LEFT JOIN categories_colors as col ON cat.color_id = col.id',
        function (error, result) {
            if(error) {
                response.status(500).send({error: error});
            }
            response.send(result);
    });
});

app.get('/api/colors',function(request,response) {
    connection.query('SELECT * from categories_colors',
    function(error,result) {
        if(error) {
            response.status(500).send({error: 'Could not get the colors!'});
        }
        response.send(result);
    });
});

app.get('/api/categories', function (request, response) {
    connection.query('select * from categories', function (error, result) {
        if (error) {
            response.status(500).send({error: 'Something failed!'});
        }
        response.send(result);
    });
});

app.post('/api/categories',function(request,response) {
   connection.query('insert into categories (name,type,color_id) values(?, ?, ?)',
        [request.body.name,
        request.body.type,
        request.body.color],
        function(error,result) {
            if(error) {
                response.status(500).send({error: 'Something failed!'});
            }
            response.send();
        });
});

app.post('/api/transactions', function (request, response) {
    connection.query('insert into transactions (name,value,category_id,type,date) values (?,?,?,?,?)',
            [request.body.name,
                request.body.value,
                request.body.category_id,
                request.body.type,
                request.body.date],
            function (error, result) {
                if (error) {
                    response.status(500).send({error: 'Something failed!'});
                }
                response.send();
            });
});


app.delete('/api/transactions/:id', function (request, response) {
    connection.query('delete from transactions where id = ?', [request.params.id],
            function (error, result) {
                if (error) {
                    response.status(500).send({error: 'Something failed!'});
                }
                response.status(200).send();
            });
});


app.put('/api/transactions/:id', function (request, response) {
    connection.query('update transactions set name = ?, value = ?, category_id = ?, date = ? where id = ?',
            [request.body.name,
                request.body.value,
                request.body.category_id,
                request.body.date,
                request.params.id
            ], function (error, result) {
        if (error) {
            response.status(500).send({error: 'Something failed!'});
        }
        response.send();
    });
});



