import React, { useEffect, useState } from 'react'
import '../App.css'
import { Card, Spinner, Container, Row, Col } from 'react-bootstrap'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function AboutPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getDocs(collection(db, 'projects'))
      .then(snap => {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        if (mounted) setProjects(items)
      })
      .catch(err => {
        console.error('Error fetching projects:', err)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => { mounted = false }
  }, [])

  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-start py-4">
      <Container className='p-0'>
        <Card className='m-2 p-2'>
          <Card.Body className='text-center'>
            <h2>About</h2>
            <p>Example declarative routing with react-router-dom.</p>
          </Card.Body>
        </Card>

        <h3 className='mt-3'>Projects</h3>

        {loading ? (
          <div className='d-flex justify-content-center my-4'>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className='g-3'>
            {projects.map(p => (
              <Col key={p.id}>
                <Card className='h-100'>
                  <Card.Body>
                    <Card.Title>{p.name}</Card.Title>
                    <Card.Text>{p.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  )
}
