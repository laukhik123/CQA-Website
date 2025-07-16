--Users
ALTER TABLE users DROP COLUMN account_id;
ALTER TABLE users DROP COLUMN views;
ALTER TABLE users DROP COLUMN reputation;
ALTER TABLE users DROP COLUMN down_votes;
ALTER TABLE users DROP COLUMN up_votes;

--Posts
ALTER TABLE posts DROP COLUMN last_editor_user_id;
ALTER TABLE posts DROP COLUMN accepted_answer_id;
ALTER TABLE posts DROP COLUMN comment_count;
ALTER TABLE posts DROP COLUMN last_editor_display_name;
ALTER TABLE posts DROP COLUMN favorite_count;
ALTER TABLE posts DROP COLUMN community_owned_date;
ALTER TABLE posts DROP COLUMN closed_date;

--Votes
ALTER TABLE votes DROP COLUMN bounty_amount;

--Tags
ALTER TABLE tags DROP COLUMN excerpt_post_id;
ALTER TABLE tags DROP COLUMN wiki_post_id;