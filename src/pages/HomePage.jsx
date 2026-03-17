import { use, useState } from 'react'
import '../App.css'
import { Button, Card, Row, Col } from 'react-bootstrap'
import { useEffect } from 'react'

export default function HomePage() {
  const [count, setCount] = useState(0)
  const [movies, setMovies] = useState([])

  const API_KEY = "3cfa185115784f1fd64cccd534a20c13";

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        setMovies(data.results)
        console.log(data)
      })
      .catch(err => console.log(err))

  }, [])

  return (
    <div className="w-100 h-100 d-flex flex-column align-items-center">
      <Card className='m-4 p-2 mb-4'>
        <Card.Body className='text-center'>
          <h1>Count Movie!</h1>
          <Button onClick={() => setCount(o => o + 1)}>Count: {count}</Button>
        </Card.Body>
      </Card>

      <h2>Trending Movies</h2>

      <Row className="w-100">
        {movies.map(movie => (
          <Col key={movie.id} md={3} className="mb-4">
            <Card>
              <Card.Img 
                variant="top" 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
              />
              <Card.Body>
                <Card.Title>{movie.name ? movie.name : movie.title}</Card.Title>
                <div>Rating: {movie.vote_average}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
    </div>

    
  )
}
