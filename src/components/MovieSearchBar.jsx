import { Form, Button, InputGroup } from 'react-bootstrap'

export default function MovieSearchBar({
  query,
  onQueryChange,
  onSearch,
  isSearching,
}) {
  return (
    <Form onSubmit={onSearch} className="mb-3">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Search for a movie title..."
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          aria-label="Search movie"
        />
        <Button variant="warning" type="submit" disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </InputGroup>
    </Form>
  )
}
