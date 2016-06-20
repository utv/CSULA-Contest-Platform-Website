Organizations = new Mongo.Collection("organizations");
Games = new Mongo.Collection("games", {idGeneration: 'MONGO'});
Players = new Mongo.Collection("players", {idGeneration: 'MONGO'});
Tournaments = new Mongo.Collection("tournaments", {idGeneration: 'MONGO'});
Matches = new Mongo.Collection("matches", {idGeneration: 'MONGO'});
TempUsers = new Mongo.Collection("temp_users", {idGeneration: 'MONGO'});
