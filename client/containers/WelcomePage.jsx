import React, { useState} from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Form, FormGroup, InputGroup, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

export default function WelcomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  if (!location.state) navigate("/");
  const { email, itineraries } = location.state;
  console.log(location.state);
  const [itinerary, setItinerary] = useState({
    title: '',
    dateStart: '',
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
    axios
      .post('/api/itinerary', itinerary)
      .then(res => {
        console.log('data successfuly created');
        navigate('/itinerary');
      })
      .catch(err => console.log('error occured in createItinerary axios', err));
  };

  const loadItinerary = () => {
    
  } 

  console.log(itineraries);
  const itinDetail = [];
  for (let i = 0; i < itineraries.length; i++) {
    itinDetail.push(
    <Link to='/itinerary' state = {{...itineraries[i]}}>
    <div>
      <h2>{itineraries[i].title}</h2>
      <ul>
      <li> Date: {itineraries[i].dateStart.split("T", 1)} </li>
      <li> Days: {itineraries[i].duration} </li>
      <li> Location: {itineraries[i].location || 'N/A'} </li>
      </ul>
      {/* <Button variant='info' onClick={loadItinerary}>Load </Button> */}
    </div>
    </Link>
    )
  }



  return (
    <div className='welcomePageContainer'>
      <div className='listItineraries'>
        <h2 className='listItinerariesH2'>List of Itineraries</h2>
        <div>{itinDetail}</div>
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
                placeholder='title (optional)'
                onChange={handleChange}
              />
              <Form.Label>Date</Form.Label>
              <Form.Control
                type='date'
                name='dateStart'
                value={itinerary.date}
                onChange={handleChange}
              />
              <Form.Label>Duration (days)</Form.Label>
              <Form.Control
                name='duration'
                value={itinerary.duration}
                placeholder='duration'
                onChange={handleChange}
              />
              <Form.Label>Location</Form.Label>
              <Form.Control
                name='location'
                value={itinerary.location}
                placeholder='location (optional)'
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
