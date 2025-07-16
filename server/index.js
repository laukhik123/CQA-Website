const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const { Client } = require('pg');
const { resourceUsage } = require('process');
const cookieParser = require('cookie-parser');
const session = require("express-session");

const app = express();
const port = 9000;

app.use(bodyParser.json());
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

//middleware for cookies
app.use(cookieParser());



const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Naresh12#',
  database: 'cqadb'
});

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');

// Test
    app.post('/send',(req,res) => {
      console.log("api working");
    })

//Login
app.post('/login', (req,res) => {
  const login = req.body;
  const query1 = `
      SELECT * FROM login WHERE user_name = $1 AND password = $2`;

  const values1 = [
    login.username,
    login.password
  ];
  
  const query2 = `
      UPDATE users SET last_access_date = $1 
      WHERE id = $2 `;

  const values2 = [
    login.formattedDate,
    login.username
  ];

  client.query(query1,values1)
    .then((result) => {
      if(result.rowCount === 0){
        console.log("no user found");
        res.status(400).send({"error":"Invalid Username or Password"});
      }
      else{
        console.table(result.rows);
        client.query(query2,values2);
        // set cookie
        res.cookie('loggedIn', true);
        res.cookie('username', login.username);
        // res.cookie('name', 'geeksforgeeks');

        res.send({"username":login.username});
      }
    })
    .catch((err) => {
      console.error(err);
    });  
});


//create account
    app.post('/create-account', (req, res) => {
      const accountData = req.body;
      const query1 = `
        INSERT INTO users
        VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7) 
        RETURNING *
      `;
      const aboutMe = '<p>' + accountData.aboutMe.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>') + '</p>';
      const values1 = [
        accountData.displayName,
        accountData.location,
        accountData.profileImageUrl,
        accountData.websiteUrl,
        aboutMe,
        accountData.formattedDate,
        accountData.formattedDate
      ];

      const query2 = `
          INSERT INTO login 
          VALUES ($1, $2)`;

      client.query(query1, values1)
        .then((result) => {
          const values2 = [
            result.rows[0].id,
            accountData.password
          ];
          client.query(query2,values2);
          console.table(result.rows);
          res.send({"username":result.rows[0].id});
        })
        .catch((err) => {
          console.error(err);
          res.status(400).send({"error": 'Failed to create account' });
        });
    });

    const requireLogin = (req, res, next) => {
      if (req.cookies.loggedIn == 'true') {
        next();
      } else {
        res.status(402).send({"error": "cookie" });
      }
  };

  // app.use((req, res, next) => {
  //   if (!req.cookies.loggedIn && req.originalUrl !== '/login') {
  //     res.redirect('http://localhost:3000/home');
  //   } else {
  //     next();
  //   }
  // });

//autocompletion
    app.post('/autocompletion',requireLogin,(req,res) => {
      const string = req.body;
      const percent = "%";
      const list = [];
      const values = [string.input.concat(percent)];
      const query = `
      SELECT id,display_name FROM users 
      WHERE display_name ILIKE $1`;
      if(!string.input){
        res.send({"names" : list});
      }
      else{client.query(query,values)
      .then((result) => {
        if(result.rowCount === 0){
          console.log("no users available");
        }
        else {
        for(let i=0;i<result.rowCount;i++){
          list.push(result.rows[i].display_name.concat("(",result.rows[i].id,")"));
        }

        console.log("inserted users into autocompletion");}
        res.send({"names" : list});
        });}
    });

//search-questions
    app.post('/search-questions',requireLogin,(req,res) => {
      const search = req.body;
      function fetchid(str){
        var mySubString = str.substring(
          str.indexOf("(") + 1, 
          str.lastIndexOf(")")
      );
      return mySubString;
      }
      function fetchtag(str){
        var mySubString = str.substring(
          0, 
          str.indexOf("(")
      );
      return mySubString;
      }
      if (search.sort === 0){
        if (search.tags.length === 0 && !search.name){
          res.status(400).send({"error":"Please select atleast one of the fields"})
        }
        else if (search.tags.length === 0){
          const list = [];
          const values = [fetchid(search.name)];
          const query = `
          SELECT id,title FROM posts 
          WHERE owner_user_id = $1 AND post_type_id = 1 `;
          client.query(query,values)
          .then((result) => {
            for (let i=0;i<result.rowCount;i++){
              list.push({"id":result.rows[i].id,"title":result.rows[i].title});
            }
            console.log("Returned questions successfully1");
            res.send({"questions":list});  
          });
        }
        else if (!search.name){
          const list = [];
          let percent = "%";
          for(var x in search.tags){
            search.tags[x] = percent.concat("<",fetchtag(search.tags[x]),">","%");
          }
          let query = `
          SELECT id,title FROM posts 
          WHERE post_type_id = 1 `;
          for(let i=1;i<=search.tags.length;i++){
            query = query.concat("AND tags LIKE $",i.toString()," ");
          }
          client.query(query,search.tags)
          .then((result) => {
            for (let i=0;i<result.rowCount;i++){
              list.push({"id":result.rows[i].id,"title":result.rows[i].title});
            }
            console.log("Returned questions successfully2");
            res.send({"questions":list});  
          });
        }
        else{
          const list = [];
          let percent = "%";
          for(var x in search.tags){
            search.tags[x] = percent.concat("<",fetchtag(search.tags[x]),">","%");
          }
          const name = [
            fetchid(search.name)
          ];
          const values = name.concat(search.tags);
          let query = `
          SELECT id,title FROM posts 
          WHERE post_type_id = 1 AND owner_user_id = $1 `;
          for(let i=2;i<=search.tags.length+1;i++){
            query = query.concat("AND tags LIKE $",i.toString()," ");
          }
          client.query(query,values)
          .then((result) => {
            for (let i=0;i<result.rowCount;i++){
              list.push({"id":result.rows[i].id,"title":result.rows[i].title});
            }
            console.log("Returned questions successfully3");
            res.send({"questions":list});  
          });
        }
      }
      else if (search.sort === 1){
        if (search.tags.length === 0 && !search.name){
          res.status(400).send({"error":"Please select atleast one of the fields"})
        }
        else if (search.tags.length === 0){
          const list = [];
          const values = [fetchid(search.name)];
          const query = `
          SELECT id,title FROM posts 
          WHERE owner_user_id = $1 AND post_type_id = 1 
          ORDER BY score DESC,creation_date DESC`;
          client.query(query,values)
          .then((result) => {
            for (let i=0;i<result.rowCount;i++){
              list.push({"id":result.rows[i].id,"title":result.rows[i].title});
            }
            console.log("Returned questions successfully4");
            res.send({"questions":list});  
          });
        }
        else if (!search.name){
          const list = [];
          let percent = "%";
          for(var x in search.tags){
            search.tags[x] = percent.concat("<",fetchtag(search.tags[x]),">","%");
          }
          let query = `
          SELECT id,title FROM posts 
          WHERE post_type_id = 1 `;
          for(let i=1;i<=search.tags.length;i++){
            query = query.concat("AND tags LIKE $",i.toString()," ");
          }
          query = query.concat("ORDER BY score DESC,creation_date DESC");
          client.query(query,search.tags)
          .then((result) => {
            for (let i=0;i<result.rowCount;i++){
              list.push({"id":result.rows[i].id,"title":result.rows[i].title});
            }
            console.log("Returned questions successfully5");
            res.send({"questions":list});  
          });
        }
        else{
          const list = [];
          let percent = "%";
          for(var x in search.tags){
            search.tags[x] = percent.concat("<",fetchtag(search.tags[x]),">","%");
          }
          const name = [
            fetchid(search.name)
          ];
          const values = name.concat(search.tags);
          let query = `
          SELECT id,title FROM posts 
          WHERE post_type_id = 1 AND owner_user_id = $1 `;
          for(let i=2;i<=search.tags.length+1;i++){
            query = query.concat("AND tags LIKE $",i.toString()," ");
          }
          query = query.concat("ORDER BY score DESC,creation_date DESC");
          client.query(query,values)
          .then((result) => {
            for (let i=0;i<result.rowCount;i++){
              list.push({"id":result.rows[i].id,"title":result.rows[i].title});
            }
            console.log("Returned questions successfully6");
            res.send({"questions":list});  
          });
        }
      }
      else {
        if (search.tags.length === 0 && !search.name){
          res.status(400).send({"error":"Please select atleast one of the fields"})
        }
        else if (search.tags.length === 0){
          const list = [];
          const values = [fetchid(search.name)];
          const query = `
          SELECT id,title FROM posts 
          WHERE owner_user_id = $1 AND post_type_id = 1 `;
          client.query(query,values)
          .then((result) => {
            for (let i=0;i<result.rowCount;i++){
              list.push({"id":result.rows[i].id,"title":result.rows[i].title});
            }
            console.log("Returned questions successfully7");
            res.send({"questions":list});  
          });
        }
        else if (!search.name){
          const list = [];
          let percent = "%";
          for(var x in search.tags){
            search.tags[x] = percent.concat("<",fetchtag(search.tags[x]),">","%");
          }
          let query = `
          SELECT id,title FROM posts 
          WHERE post_type_id = 1 `;
          for(let i=1;i<=search.tags.length;i++){
            query = query.concat("AND tags LIKE $",i.toString()," ");
          }
          query = query.concat("ORDER BY creation_date DESC,score DESC");
          client.query(query,search.tags)
          .then((result) => {
            for (let i=0;i<result.rowCount;i++){
              list.push({"id":result.rows[i].id,"title":result.rows[i].title});
            }
            console.log("Returned questions successfully8");
            res.send({"questions":list});  
          });
        }
        else{
          const list = [];
          let percent = "%";
          for(var x in search.tags){
            search.tags[x] = percent.concat("<",fetchtag(search.tags[x]),">","%");
          }
          const name = [
            fetchid(search.name)
          ];
          const values = name.concat(search.tags);
          let query = `
          SELECT id,title FROM posts 
          WHERE post_type_id = 1 AND owner_user_id = $1 `;
          for(let i=2;i<=search.tags.length+1;i++){
            query = query.concat("AND tags LIKE $",i.toString()," ");
          }
          query = query.concat("ORDER BY creation_date DESC,score DESC");
          client.query(query,values)
          .then((result) => {
            for (let i=0;i<result.rowCount;i++){
              list.push({"id":result.rows[i].id,"title":result.rows[i].title});
            }
            console.log("Returned questions successfully9");
            res.send({"questions":list});  
          });
        }
      }
    });

//fetch-answers
    app.post('/fetch-answers',requireLogin,(req,res) => {
      const post = req.body;
      values = [post.id];
      const query1 = `
      UPDATE posts SET view_count = view_count+1 
      WHERE id = $1`;
      client.query(query1,values);

      const query2 = `
      SELECT id,owner_user_id,body,score,owner_display_name 
      FROM posts 
      WHERE parent_id = $1 
      ORDER BY score DESC`;
      const list_answers = [];
      let obj = {};
      client.query(query2,values)
      .then((result) => {
        for (let i=0;i<result.rowCount;i++){
            obj = {
                "id" : result.rows[i].id,
                "owneruserid" : result.rows[i].owner_user_id,
                "ownername" : result.rows[i].owner_display_name,
                "body" : result.rows[i].body,
                "score" : result.rows[i].score
            };
            list_answers.push(obj);
        }
        console.log("list of answers created successfully");
      })

      const query3 = `
      SELECT * FROM posts WHERE id = $1`;
      client.query(query3,values)
      .then((result) => {
        console.log("Got post info successfully");
        let tags = result.rows[0].tags.replace(/></g,"&");
        tags = tags.replace(/</g,"");
        tags = tags.replace(/>/g,"");
        tags = tags.split("&");
        obj = {
            "id" : result.rows[0].id,
            "owneruserid" : result.rows[0].owner_user_id,
            "ownername" : result.rows[0].owner_display_name,
            "title" : result.rows[0].title,
            "body" : result.rows[0].body,
            "tags" : tags,
            "score" : result.rows[0].score,
            "views" : result.rows[0].view_count,
            "answers" : list_answers
        };
        res.send(obj);
      })
      .catch((err) => {
        console.error("Failed to fetch post info");
      });
    });

//view-profile
    app.post('/view-profile',requireLogin,(req,res) => {
      const id = req.body.logged_user_id;
      const query1 = `
      SELECT COUNT(*) as count FROM badges 
      WHERE user_id = $1 AND class = $2 `;
      let gold = 0;
      let silver = 0;
      let bronze = 0;
      client.query(query1,[id,1])
      .then((result) => {
        gold = result.rows[0].count;
        client.query(query1,[id,2])
        .then((result) => {
          silver = result.rows[0].count;
          client.query(query1,[id,3])
          .then((result) => {
            bronze = result.rows[0].count;
            const badges = {
              "Gold" : gold,
              "Silver" : silver,
              "Bronze" : bronze
            };
            const list_q = [];
            const query2 = `
            SELECT id,title FROM posts 
            WHERE (post_type_id = 1 AND owner_user_id = $1) OR 
            id in (SELECT parent_id FROM posts 
              WHERE post_type_id = 2 AND owner_user_id = $2)`;
            client.query(query2,[id,id])
            .then((result) => {
              for (let i=0;i<result.rowCount;i++){
                list_q.push({"id":result.rows[i].id,"title":result.rows[i].title});
              }
              const query3 = `
              SELECT * FROM users WHERE id = $1`;
              client.query(query3,[id])
              .then((result) => {
                 console.log("fetched user details successfully");
                 res.send({
                  "id" : result.rows[0].id,
                  "display_name" : result.rows[0].display_name,
                  "location" : result.rows[0].location,
                  "profileImageURL" : result.rows[0].profile_image_url,
                  "websiteURL" : result.rows[0].website_url,
                  "aboutMe" : result.rows[0].about_me,
                  "creationDate" : result.rows[0].creation_date,
                  "lastAccessDate" : result.rows[0].last_access_date,
                  "badges" : badges,
                  "questions" : list_q
                 });
              });
            });  
          });
        });
      });
    });

//post-question
    app.post('/post-question',requireLogin,(req,res) => {
      const questionData = req.body;
      const query1 = `
      SELECT display_name FROM users 
      WHERE id = $1`;
      client.query(query1,[questionData.userid])
      .then((result) => {
        let displayName = result.rows[0].display_name;
        let tags = "";
        if(questionData.tags.length === 0){ tags = null;}
        else{for (var x in questionData.tags){
          tags = tags.concat("<",questionData.tags[x],">");
        }}
        const query2 = `
        INSERT INTO posts 
        VALUES (DEFAULT,$1,1,0,NULL,0,0,$2,$3,$4,DEFAULT,$5,$6,$7,$8)`;
        const values = [
          questionData.userid,
          displayName,
          questionData.title,
          tags,
          questionData.body,
          questionData.formattedDate,
          questionData.formattedDate,
          questionData.formattedDate
        ];
        client.query(query2,values)
        .then(() => {
          console.log("posted successfully");
          res.send({"message": "Posted successfully"});
        })
        .catch((err) => {
          console.error(err);
          res.status(400).send({"error": 'Failed to create post' });
        });
      });
    });
    
//post-answer
    app.post('/post-answer',requireLogin,(req,res) => {
      const answerData = req.body;
      const query1 = `
      SELECT display_name FROM users 
      WHERE id = $1`;
      client.query(query1,[answerData.userid])
      .then((result) => {
        let displayName = result.rows[0].display_name;
        const query2 = `
        INSERT INTO posts 
        VALUES (DEFAULT,$1,2,0,$2,NULL,NULL,$3,NULL,NULL,DEFAULT,$4,$5,$6,$7)`;
        const values2 = [
          answerData.userid,
          answerData.parentid,
          displayName,
          answerData.body,
          answerData.formattedDate,
          answerData.formattedDate,
          answerData.formattedDate
        ];
        client.query(query2,values2)
        .then(() => {
          const query3 = `UPDATE posts SET last_activity_date = $1, 
          answer_count=answer_count+1 WHERE id = $2`;
          const values3 = [
            answerData.formattedDate,
            answerData.parentid
          ];
          client.query(query3,values3)
          .then(() => {
            console.log("posted successfully");
            res.send({"message" : "Posted successfully"});
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(400).send({"error": 'Failed to post answer' });
        });
      });
    });

//delete-post
    app.post('/delete-post',requireLogin,(req,res) => {
      const postData = req.body;
      const query1 = `
      SELECT * FROM posts 
      WHERE id = $1 AND owner_user_id = $2`;
      client.query(query1,[postData.id,postData.userid])
      .then((result) => {
        if (result.rowCount > 0){
          const query2 = `
          DELETE FROM posts 
          WHERE id = $1`;
          client.query(query2,[postData.id])
          .then(() => {
            res.send({"message" : "Deleted successfully"});
          });
        }
        else{
          res.status(400).send({"error" : "No authorisation to delete"});
        }
      });
    });

//edit-question
    app.post('/edit-question',requireLogin,(req,res) => {
      const questionData = req.body;
      const query1 = `
      SELECT * FROM posts 
      WHERE id = $1 AND owner_user_id = $2`;
      client.query(query1,[questionData.id,questionData.userid])
      .then((result) => {
        if (result.rowCount > 0){
          const query = `
          UPDATE posts SET title = $1,
          tags = $2,body = $3,last_edit_date = $4,last_activity_date = $5 
          WHERE id = $6`;
          let tags = "";
          if(questionData.tags.length === 0){ tags = null;}
          else{for (var x in questionData.tags){
            tags = tags.concat("<",questionData.tags[x],">");
          }}
          const values = [
            questionData.title,
            tags,
            questionData.body,
            questionData.formattedDate,
            questionData.formattedDate,
            questionData.id
          ];
          client.query(query,values)
          .then(() => {
            console.log("edited successfully");
            res.send({"message" : "Edited post successfully"});
          });
        }
        else{
          res.status(400).send({"error" : "No authorisation to edit"});
        }
      });
    });

//edit-answer
    app.post('/edit-answer',requireLogin,(req,res) => {
      const answerData = req.body;
      const query1 = `
      SELECT * FROM posts 
      WHERE id = $1 AND owner_user_id = $2`;
      client.query(query1,[answerData.id,answerData.userid])
      .then((result) => {
        if (result.rowCount > 0){
          const query1 = `
          UPDATE posts SET body = $1,
          last_edit_date = $2,last_activity_date = $3 
          WHERE id = $4`;
          const values1 = [
            answerData.body,
            answerData.formattedDate,
            answerData.formattedDate,
            answerData.id,
          ];
          client.query(query1,values1)
          .then(() => {
            const query2 = `
            UPDATE posts SET last_activity_date = $1 
            WHERE id = $2`;
            const values2 = [
              answerData.formattedDate,
              answerData.parentid
            ];
            client.query(query2,values2)
            .then(() => {
              console.log("edited successfully");
              res.send({"message" : "Answer edited successfully"});
            });
          });
        }
        else{
          res.status(400).send({"error" : "No authorisation to edit"});
        }
      });
    });

//rest
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });