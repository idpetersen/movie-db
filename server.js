const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'password',
      database: 'movie_db'
    },
    console.log(`Connected to the courses_db database.`)
  );

app.get('/api/movies', (req, res) =>
  db.query("SELECT * FROM movies", (err, data)=>{
      if(err){
          throw err;
      }
      res.json(data);
  })
);

app.get('/api/movie-reviews', (req, res) =>
  db.query("SELECT movies.movie_name, reviews.review FROM movies RIGHT JOIN reviews ON reviews.movie_id = movies.id", (err, data)=>{
      if(err){
          throw err;
      }
      res.json(data);
  })
);

app.post('/api/add-movie', (req, res) => {
    const {movie_name} = req.body
    if (req.body){
    db.query("INSERT INTO movies SET ?", {movie_name: movie_name}, (err, data)=>{
        if(err){
            throw err
        }
        res.json(data);
    })
}
});

app.put('/api/update-review/:id', (req, res) =>{
    if(req.body.review && req.params.id){
        db.query('UPDATE reviews SET review = ? WHERE id = ?', [req.body.review, req.params.id], (err, data)=>{
            if (err){
                throw err;
            }
            res.json(data)
        })
    }
});

app.delete('/api/movie/:id', (req, res) =>{
    db.query("DELETE FROM movies WHERE id = ?", req.params.id, (err, data)=>{
        if (err){
            throw err;
        }
        res.json('deleted')
    })
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:PORT`)
);