# sockets.io-and-postgres
Combine socket.io and Postgres for a real time application

Backend written in Node, Front-end written in Vue

* Node Version: 14.2.0
* Vue Version: 2
* Postgres Version: 12

### Setup


### Usage: 

Frontend (real-time-db-app)
```
npm run serve
```

Backend (node-backend)
```
node 
```


#### Misc
Dump database schema
```
pg_dump -U postgres -s dbname > outputfile.db
```

Export Database
```
pg_dump dbname > outputfile.sql
```

Import Database
```
psql dbname < importfile.sql
```

