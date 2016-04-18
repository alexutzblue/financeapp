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
    connection.query('SELECT transactions.*, categories.color as categoryColor FROM transactions INNER JOIN categories ON transactions.category = categories.name', function (error, result) {
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

app.post('/api/transactions', function (request, response) {
    connection.query('insert into transactions (name,value,category,type,added) values (?,?,?,?,?)',
            [request.body.name,
                request.body.value,
                request.body.category,
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
    connection.query('update transactions set name = ?, value = ?, category = ?, added = ? where id = ?',
            [request.body.name,
                request.body.value,
                request.body.category,
                request.body.date,
                request.params.id
            ], function (error, result) {
        if (error) {
            response.status(500).send({error: 'Something failed!'});
        }
        response.send();
    });
});



