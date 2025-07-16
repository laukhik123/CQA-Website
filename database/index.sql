--users
CREATE INDEX users_index ON users(id);

--posts
CREATE INDEX posts_index ON posts(id,owner_user_id,title);

--postlinks
CREATE INDEX postlinks_index ON post_links(post_id);

--votes
CREATE INDEX votes_index ON votes(post_id,user_id,vote_type_id);

--badges
CREATE INDEX badges_index ON badges(user_id,class);

--login
CREATE INDEX login_index ON login(user_name,password);