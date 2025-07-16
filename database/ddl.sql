-- Users
CREATE SEQUENCE users_id;
ALTER SEQUENCE users_id RESTART WITH 423930;
CREATE TABLE users (
	id INT DEFAULT NEXTVAL('users_id') PRIMARY KEY,
	account_id INTEGER,
	reputation INTEGER NOT NULL,
	views INTEGER DEFAULT 0,
	down_votes INTEGER DEFAULT 0,
	up_votes INTEGER DEFAULT 0,
	display_name VARCHAR(255) NOT NULL,
	location VARCHAR(512),
	profile_image_url VARCHAR(255),
	website_url VARCHAR(255),
	about_me TEXT,
	creation_date TIMESTAMP(3) NOT NULL,
	last_access_date TIMESTAMP(3) NOT NULL
);

-- Posts
CREATE SEQUENCE posts_id;
ALTER SEQUENCE posts_id RESTART WITH 442650;
CREATE TABLE posts (
	id INT DEFAULT NEXTVAL('posts_id') PRIMARY KEY,
	owner_user_id INTEGER,
	last_editor_user_id INTEGER,
	post_type_id SMALLINT NOT NULL,
	accepted_answer_id INTEGER,
	score INTEGER NOT NULL,
	parent_id INTEGER,
	view_count INTEGER,
	answer_count INTEGER DEFAULT 0,
	comment_count INTEGER DEFAULT 0,
	owner_display_name VARCHAR(64),
	last_editor_display_name VARCHAR(64),
	title VARCHAR(512),
	tags VARCHAR(512),
	content_license VARCHAR(64) DEFAULT 'CC BY-SA 2.5',
	body TEXT,
	favorite_count INTEGER,
	creation_date TIMESTAMP(3) NOT NULL,
	community_owned_date TIMESTAMP(3),
	closed_date TIMESTAMP(3),
	last_edit_date TIMESTAMP(3),
	last_activity_date TIMESTAMP(3),
	FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (parent_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- PostLinks
CREATE SEQUENCE post_links_id;
ALTER SEQUENCE post_links_id RESTART WITH 12571246;
CREATE TABLE post_links (
	id INT DEFAULT NEXTVAL('post_links_id') PRIMARY KEY,
	related_post_id INTEGER NOT NULL,
	post_id INTEGER NOT NULL,
	link_type_id SMALLINT NOT NULL,
	creation_date TIMESTAMP(3) NOT NULL,
	FOREIGN KEY (related_post_id) REFERENCES posts(id) ON DELETE CASCADE,
	FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Votes
CREATE SEQUENCE votes_id;
ALTER SEQUENCE votes_id RESTART WITH 3154767;
CREATE TABLE votes (
	id INT DEFAULT NEXTVAL('votes_id') PRIMARY KEY,
	user_id INTEGER,
	post_id INTEGER NOT NULL,
	vote_type_id SMALLINT NOT NULL,
	bounty_amount SMALLINT,
	creation_date TIMESTAMP(3) NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Badges
CREATE SEQUENCE badges_id;
ALTER SEQUENCE badges_id RESTART WITH 659113;
CREATE TABLE badges (
	id INT DEFAULT NEXTVAL('badges_id') PRIMARY KEY,
	user_id INTEGER NOT NULL,
	class SMALLINT NOT NULL,
	name VARCHAR(64) NOT NULL,
	tag_based BOOL NOT NULL,
	date TIMESTAMP(3) NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tags
CREATE SEQUENCE tags_id;
ALTER SEQUENCE tags_id RESTART WITH 4882;
CREATE TABLE tags (
	id INT DEFAULT NEXTVAL('tags_id') PRIMARY KEY,
	excerpt_post_id INTEGER,
	wiki_post_id INTEGER,
	tag_name VARCHAR(255) NOT NULL,
	count INTEGER DEFAULT 0
);

--Login
CREATE TABLE login (
    user_name SERIAL PRIMARY KEY,
	password VARCHAR(255) NOT NULL,
	FOREIGN KEY (user_name) REFERENCES users(id) ON DELETE CASCADE
);