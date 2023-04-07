-- settings.sql
CREATE DATABASE blocklands;
CREATE USER blocklandsuser WITH PASSWORD 'blocklands';
GRANT ALL PRIVILEGES ON DATABASE blocklands TO blocklandsuser;