const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Naresh12#',
    database: 'cqadb'
  });

client.connect()
.then(() => {
    console.log("connected to database");
const query1 = `
SELECT * FROM posts`;

client.query(query1)
.then((result) => {
    for(let i=0;i<result.rowCount;i++){
        if (!result.rows[i].owner_display_name ){
          const query2 = `
          UPDATE posts SET owner_display_name = (
              SELECT display_name FROM users WHERE id = $1
          ) WHERE id = $2`;
          const values2 = [
              result.rows[i].owner_user_id,
              result.rows[i].id
          ];
          client.query(query2,values2)
        }
        else if (!result.rows[i].owner_user_id){
            const query3 = `
            UPDATE posts SET owner_user_id = (
                SELECT id FROM users WHERE display_name = $1 LIMIT 1
            ) WHERE id = $2`;
            const values3 = [
                result.rows[i].owner_display_name,
                result.rows[i].id
            ];
            client.query(query3,values3)
        }
        else{}
    }
    console.log("success");
});
});