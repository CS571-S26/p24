import { useState } from 'react'
import { Card, Container, Form, Button } from 'react-bootstrap'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
  }

  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-start py-4 px-3">
      <Container className="p-0" style={{ maxWidth: '500px' }}>
        <Card className="m-2 p-2">
          <Card.Body>
            <h2 className="mb-3">Sign In</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="signinEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="signinPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button type="submit" variant="warning">Sign In</Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}
