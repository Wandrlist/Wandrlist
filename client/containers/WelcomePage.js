import React, { useState } from 'react';
import { Form, FormGroup, InputGroup, Button, Modal } from 'react-bootstrap';

export default function WelcomePage() {
  const [itinerary, setItinerary] = useState({
    title: '',
    date: '',
    duration: '',
    location: ''
  });
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = e => {
    const { name, value } = e.target;
    setItinerary(prev => {
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const createItinerary = () => {
    setShow(false);
  };

  return (
    <div className='welcomePageContainer'>
      <div className='listItineraries'>
        <h2 className='listItinerariesH2'>List of Itineraries</h2>
      </div>

      <div className='searchItinerary'>
        <InputGroup className='mb-3'>
          <Form.Control
            placeholder='search by title...'
            aria-label='search by title'
            aria-describedby='basic-addon1'
          />
        </InputGroup>
        <div>
          <Button variant='info' className='create' onClick={handleShow}>
            Create Itinerary
          </Button>
          <Button variant='info' className='load'>Load Itinerary</Button>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Itinerary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormGroup>
              <Form.Label>Title</Form.Label>
              <Form.Control
                name='title'
                value={itinerary.title}
                placeholder='title'
                onChange={handleChange}
              />
              <Form.Label>Date</Form.Label>
              <Form.Control
                type='date'
                name='date'
                value={itinerary.date}
                onChange={handleChange}
              />
              <Form.Label>Duration</Form.Label>
              <Form.Control
                name='duration'
                value={itinerary.duration}
                placeholder='duration'
                onChange={handleChange}
              />
              <Form.Label>Duration</Form.Label>
              <Form.Control
                name='location'
                value={itinerary.location}
                placeholder='location'
                onChange={handleChange}
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='primary' onClick={createItinerary}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
