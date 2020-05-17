# sockets.io-and-postgres
Combine socket.io and Postgres for a real time application

Backend written in Node, Front-end written in Vue

My environment:
* Node Version: 14.2.0
* Vue Version: 2
* Postgres Version: 12
* Ubuntu 20

---
### Setup
Import the database (realtimedb.sql) from node-backend folder. Then copy and rename teh sample.env file to .env and fill in the database info.

---
### Usage: 

Frontend (real-time-db-app)
```
npm run serve
```

Backend (node-backend)
```
node index.js
```

---
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

