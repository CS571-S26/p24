import React, { useEffect, useState } from 'react'
import '../App.css'
import { Card, Spinner, Container, Row, Col } from 'react-bootstrap'


export default function AboutPage() {

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
      </Container>
    </div>
  )
}
