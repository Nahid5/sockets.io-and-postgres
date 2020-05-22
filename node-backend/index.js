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
//Listen on socket
var io = require('socket.io').listen(server);
io.origins('*:*')

//Try to connect to database
const pool = new Pool({
    connectionString: connString
});
//Check if connection is good or bad
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
    //Alerts us when someone successfully connects
    console.log('User Connected');
    //Alerts us when someone disconnects
    socket.on('Disconnect', () => {
        console.log('User Disconnected')
    })

    //Update notes and let the clients know which row was updated
    socket.on("updateNotes", data => {
        pool.query('UPDATE public."Notes" SET notes = $1 WHERE id = $2;', [data.notes, data.id] ,(err ,res) => {
            if(err) throw err
            io.emit('dataIdUpdated', data.id);
        })
    })

    //Get everything from a table
    socket.on("getAllData", page => {
        //Base query
        var queryText = 'SELECT id, name, notes FROM public."Notes" ';

        //Position and valus are for parameterization. Help with sql injection.
        //If you want to add filters, you can add them here and follow the pattern
        var position = 1;
        var values = [];

        //Filter by text
        if(page.filters.filterText.length > 0) {
            var fieldsToSearch = ["name", "notes"];
            if(!queryText.includes("WHERE")) queryText += "WHERE ";
            else queryText += "AND ";
            fieldsToSearch.forEach(element => { queryText += element + " ~* $" + position++ + " OR "; values.push(page.filters.filterText)});    //Adds the where statement and prepares teh query to do case insensitive regex search
            queryText = queryText.slice(0, -3);     //Remove OR 
            queryText += " "
        }
        
        queryText += 'ORDER BY id ASC ';

        //Offset and fetch next is needed when the database is huge.
        queryText += "OFFSET $" +position++ + " ROWS FETCH NEXT $" + position++ + " ROWS ONLY;";
        values.push(page.page.offset);
        values.push(page.page.limit);


        pool.query(queryText, values, (err ,res) => {
            if(err) throw err
            socket.emit("allData", res.rows);
        })
    })

    //Get the size of the table
    socket.on("getDataSize", () => {
        pool.query('SELECT COUNT(*) as count FROM public."Notes";', (err ,res) => {
            if(err) throw err
            socket.emit("tableSize", res.rows[0]);
        })
    })
})