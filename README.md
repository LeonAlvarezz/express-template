## Express Template
This project is my take on an Express.js backend template, it designed to be as simple, minimal, and easy to pick up as possible.

I will give some detail on how it works, why I choose a certain things and some instruction on how to get started. Keep in mind that since Express is extremely unopinionated,  Of course, you’re free to tweak or replace anything,fork it, adapt it, and make it yours.
If you spot areas for improvement, feel free to open a PR. 

I hope this project can help you get start on your project, no matter if you are a senior or someone who just getting started. 🚀

## Project Architecture
The structure of the project is heavily inspired by NestJS, since I really enjoyed how each feature is organized into it own folder. For example: If I'm working on a auth feature, I can put its service, controller, repository into it own folder called "auths". 

In my opinion, In order to make the system robust and easy to use, you will need to set up a few thing: 
- Error Middleware
- Error Exception
- Boostrap or loader
- Input Validation
- Authentication
  
In this template, I've already have all of these thing set in place, of course, you can custom these thing to however you like.

Initially, I wanted to write raw SQL for this project. However, I just find it to be repetitive and extremely prone to failure. So, I opt to use ORM instead, specifically __Drizzle__. So __you will need some basic knowledge__ on how to use Drizzle. You read the docs [here](https://orm.drizzle.team/docs/get-started)

## Authentication
For authentication, I'm not quite fond of JWT as I prefer Session all the way, especially with http-only cookies. I've always love to roll my own auth, but recently I found [Better Auth](https://www.better-auth.com/) to be extremely good. As it handle almost everything that's hectic with rolling your own auth. My recommendation is, you should start with rolling your own auth, once you know the in and out and familliar with it, then use Better Auth.

## Set up 
I like to start my project with Postgres, you can use any other db provider as long as it's supported by *Drizzle*. TO get started, you will need a postgres db. There are many ways to do this but the method that I prefer is through Docker (fast & easy). To get started, pull the postgres image:

``` bash
docker pull postgres
```
Then, start the instance:
``` bash
docker run --name {{CONTAINER_NAME}} -p {{PORT}}:5432 -e POSTGRES_USER={{USERNAME}} -e POSTGRES_PASSWORD={{PASSWORD}} -d {{DB_NAME}}
```
After that, it's done🎉🎉, just add the db credential into the env file. If you need a GUI to view your db, you can use Table Plus, DBeaver, pgAdmin.

Then, you will need to migrate the db by running:
```bash
bun db:migrate
or
bunx drizzle-kit migrate
```
And then, seed the neccessary data into the db:
```bash
bun db:seed
```
Then, it is done. You can now run the backend with:
```bash
bun dev
```

# Data Migration
Migration is a way for us to easily track our DB configuration (Read/Write). So each time you update the schema file, you can run: 
```bash
bun db:push
```
It will immediately update the db without generating a migration file. Once you feel confident that everything is good to go, you can run:

```bash
bun db:migrate --name='{MIGRATION_NAME}'
```
It will generate a migration history record file. This way if we onboard someone to the project, they just need to run migrate cli and it will set up the db for them. 

Whenever you need to generate a migration record, it's recommended to pull the code to the latest version then generate to prevent data drift.