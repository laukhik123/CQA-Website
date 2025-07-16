--Users
COPY "users" FROM 'C:\Users\Naresh Bandaru\OneDrive\Desktop\database\Users.csv' WITH (FORMAT csv);

--Posts
COPY "posts" FROM 'C:\Users\Naresh Bandaru\OneDrive\Desktop\database\Posts.csv' WITH (FORMAT csv);

--PostLinks
CREATE TABLE post_links_dummy (
	id SERIAL PRIMARY KEY,
	related_post_id INTEGER NOT NULL,
	post_id INTEGER NOT NULL,
	link_type_id SMALLINT NOT NULL,
	creation_date TIMESTAMP(3) NOT NULL
);
COPY "post_links_dummy" FROM 'C:\Users\Naresh Bandaru\OneDrive\Desktop\database\PostLinks.csv' WITH (FORMAT csv);
INSERT INTO post_links 
(SELECT * FROM post_links_dummy 
WHERE related_post_id IN (SELECT id FROM posts) AND post_id IN (SELECT id FROM posts));
DROP TABLE post_links_dummy;

--Votes
CREATE TABLE votes_dummy (
	id SERIAL PRIMARY KEY,
	user_id INTEGER,
	post_id INTEGER NOT NULL,
	vote_type_id SMALLINT NOT NULL,
	bounty_amount SMALLINT,
	creation_date TIMESTAMP(3) NOT NULL
);
COPY "votes_dummy" FROM 'C:\Users\Naresh Bandaru\OneDrive\Desktop\database\Votes.csv' WITH (FORMAT csv);
INSERT INTO votes 
(SELECT * FROM votes_dummy 
WHERE user_id IN (SELECT id FROM users) AND post_id IN (SELECT id FROM posts));
DROP TABLE votes_dummy;

--Badges
CREATE TABLE badges_dummy (
	id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL,
	class SMALLINT NOT NULL,
	name VARCHAR(64) NOT NULL,
	tag_based BOOL NOT NULL,
	date TIMESTAMP(3) NOT NULL
);
COPY "badges_dummy" FROM 'C:\Users\Naresh Bandaru\OneDrive\Desktop\database\Badges.csv' WITH (FORMAT csv);
INSERT INTO badges 
(SELECT * FROM badges_dummy 
WHERE user_id IN (SELECT id FROM users));
DROP TABLE badges_dummy;

--Tags
COPY "tags" FROM 'C:\Users\Naresh Bandaru\OneDrive\Desktop\database\Tags.csv' WITH (FORMAT csv);

--login
INSERT INTO login (SELECT id,id FROM users);