import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import dollarImage from '../images/dollar.png';
import fiveImage from '../images/five.png';
import tenImage from '../images/ten.png';
import twentyImage from '../images/twenty.png';
import quarterImage from '../images/quarter.png';
import dimeImage from '../images/dime.png';
import nickelImage from '../images/nickel.png';
import pennyImage from '../images/penny.png';

// Values are in cents so calculations don't introduce decimal rounding errors.
const currency = [
  { name: 'twenties', label: 'Twenties', value: 2000, image: twentyImage },
  { name: 'tens', label: 'Tens', value: 1000, image: tenImage },
  { name: 'fives', label: 'Fives', value: 500, image: fiveImage },
  { name: 'ones', label: 'Ones', value: 100, image: dollarImage },
  { name: 'quarters', label: 'Quarters', value: 25, image: quarterImage },
  { name: 'dimes', label: 'Dimes', value: 10, image: dimeImage },
  { name: 'nickels', label: 'Nickels', value: 5, image: nickelImage },
  { name: 'pennies', label: 'Pennies', value: 1, image: pennyImage },
];

export default function App() {
  const [due, setDue] = useState('');
  const [received, setReceived] = useState('');
  const [currencyBack, setCurrencyBack] = useState(new Array(8).fill(0));
  const [result, setResult] = useState(null);

  function handleClickCalculate(event) {
    event.preventDefault();

    const change = Math.round(Number(received) * 100) - Math.round(Number(due) * 100);
    let remaining = Math.max(change, 0);
    const counts = currency.map(({ value }) => {
      const count = Math.floor(remaining / value);
      remaining %= value;
      return count;
    });

    setCurrencyBack(counts);
    setResult({
      variant: change < 0 ? 'danger' : 'success',
      message: change < 0
        ? `Additional money owed is $${(Math.abs(change) / 100).toFixed(2)}`
        : `The total change due is $${(change / 100).toFixed(2)}`,
    });
  }

  return (
    <Container className="calculator">
      <header className="calculator-header">
        <h1>Change Calculator</h1>
        <p>Enter the amount due and received to see the change breakdown.</p>
      </header>

      {/* Bootstrap divides a row into 12 units: 4 for inputs, 8 for results. */}
      <Row className="g-4">
        <Col md={4}>
          <Card className="input-panel">
            <Card.Header>Enter Information</Card.Header>
            <Form onSubmit={handleClickCalculate}>
              <Card.Body>
                <Form.Group controlId="amountDue" className="mb-3">
                  <Form.Label>How much is due?</Form.Label>
                  <Form.Control
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="1000000000"
                    step="0.01"
                    required
                    placeholder="0.00"
                    data-testid="amountDue"
                    value={due}
                    onChange={(event) => setDue(event.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="amountReceived">
                  <Form.Label>How much was received?</Form.Label>
                  <Form.Control
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="1000000000"
                    step="0.01"
                    required
                    placeholder="0.00"
                    data-testid="amountReceived"
                    value={received}
                    onChange={(event) => setReceived(event.target.value)}
                  />
                </Form.Group>
              </Card.Body>
              <Card.Footer>
                <Button type="submit" data-testid="calculate" className="w-100">
                  Calculate
                </Button>
              </Card.Footer>
            </Form>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="results-panel">
            <Card.Body>
              <div aria-live="polite" aria-atomic="true">
                <Alert variant={result?.variant ?? 'info'} className="result-alert">
                  {result?.message ?? 'Enter your amounts, then select Calculate.'}
                </Alert>
              </div>

              {/* Each tile takes 3 of this row's 12 units on medium screens. */}
              <Row className="g-3">
                {currency.map(({ name, label, image, value }, index) => (
                  <Col xs={6} md={3} key={name}>
                    <Card className="denomination-card h-100 text-center">
                      <Card.Body>
                        {image && (
                          <img
                            className={`denomination-image${value >= 100 ? ' bill-image' : ''}`}
                            src={image}
                            alt=""
                          />
                        )}
                        <Card.Title as="h2">{label}</Card.Title>
                        <Card.Text data-testid={name} id={`${name}-output`}>
                          {currencyBack[index]}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
