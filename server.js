require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const movieData = require('./movieDb')

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

function validateBearerToken(req, res, next) {
  const key = req.get('Authorization').split(' ')[1];
  if (!(key === process.env.API_TOKEN)){
    return res
      .status(401)
      .send('You do not have authorization');
  }
  next();
}

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())
app.use(validateBearerToken)

app.get('/movie', (req, res) => {
  let {genre, country, avg_vote} = req.query;
  
  let returnData = movieData;
  
  if (avg_vote) {
    avg_vote = Number(avg_vote);
    if (!avg_vote || avg_vote > 10 || avg_vote < 0) {
      return res
        .status(400)
        .send('avg_vote must be a valid number between 0 and 10');
    }    
    returnData = returnData.filter(movie => movie.avg_vote >= Number(avg_vote));
  }

  if (country) {
    returnData = returnData.filter(data => data.country.toLowerCase().includes(country.toLowerCase()));
  }
  if (genre) {
    returnData = returnData.filter(data => data.genre.toLowerCase().includes(genre.toLowerCase()));
  }



  if (returnData.length === 0) {
      return res
        .json('No results found');
  }
  return res.json(returnData);
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Server on port ${PORT}!`));
