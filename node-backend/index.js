const path = require('path');
require('dotenv').config();
const express = require('express');
//const cors = require('cors');
const { Pool } = require('pg');
// Load database info to connect
const pgUser = process.env.PG_USER;
const pgPass = process.env.PG_PASS;
const serverLoc = process.env.PG_SERVER;
const dbName = process.env.DB_NAME;
const connString = 'tcp://'+pgUser+':'+pgPass+'@'+serverLoc+':5432/'+dbName;   //username:password@location:port/dbname

var app = express();
//app.use(cors);
var server = app.listen(3000);
var io = require('socket.io').listen(server);
io.origins('*:*')

const pool = new Pool({
    connectionString: connString
});
pool.connect(err => {
    if(err) {
        console.error('Database connection error', err.stack);
    }
    else {
        console.log('Connected');
    }
})

//io = to all clients
//socket = to specific client
io.on('connection', function(socket) {
    console.log('User Connected');
    socket.on('Disconnect', () => {
        console.log('User Disconnected')
    })

    //Get everything from a table
    socket.on("getAllData", page => {
        //Base query
        var queryText = "SELECT id, name, notes FROM public.\"Notes\" ORDER BY name ASC ";

        //Position and valus are for parameterization. Help with sql injection.
        //If you want to add filters, you can add them here and follow teh pattern
        var position = 1;
        var values = [];
        //Offset and fetch next is needed when the database is huge.
        queryText += "OFFSET $" +position++ + " ROWS FETCH NEXT $" + position++ + " ROWS ONLY";
        values.push(page.offset);
        values.push(page.limit);

        pool.query(queryText, values, (err ,res) => {
            if(err) throw err
            socket.emit("allData", res.rows);
        })
    })

    socket.on("getDataSize", () => {
        pool.query("SELECT COUNT(*) as count FROM public.\"Notes\";", (err ,res) => {
            if(err) throw err
            socket.emit("tableSize", res.rows[0]);
        })
    })
})