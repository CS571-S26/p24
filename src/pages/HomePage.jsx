import { use, useState } from 'react'
import '../App.css'
import { Button, Card, Row, Col } from 'react-bootstrap'
import { useEffect } from 'react'

export default function HomePage() {
  const [count, setCount] = useState(0)
  const [movies, setMovies] = useState([])

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/trending/movie/week", {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTZhZmY0YjYxM2UwODk5NmVlZGU3MjBhNDk3MmJhNCIsIm5iZiI6MTc3MjY0NjM0My40OTYsInN1YiI6IjY5YTg2ZmM3ZTViZTg3MGI3YzA4MGIwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DKyhr7pQIkjzpU7k5Y-C16u0q7tNthc7wzXjAFNaGbU"
      }
    })
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
          <h1>Hello World!</h1>
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
                <Card.Title>{movie.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
    </div>

    
  )
}
