import React, { useState,useRef,useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table,Row,Container,Col,Button,Modal,Form } from 'react-bootstrap';
import './App.css';

function App() {
  const ApiEndPoint = 'http://localhost:8080/LaravelCrudApi/api/products';
  const Headers = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

 const [products, setProducts] = useState([])
  useEffect(() => {
    GetProducts();
  },[]);

  const ProductName = useRef();
  const Slug = useRef();
  const Description = useRef();
  const Price = useRef();

  const UpdateProductName = useRef();
  const UpdateSlug = useRef();
  const UpdateDescription = useRef();
  const UpdatePrice = useRef();

  const ProductID = useRef();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showUpdate, setShowUpdate] = useState(false);
  const handleCloseUpdate = () => setShowUpdate(false);
  const handleShowUpdate = () => setShowUpdate(true);

  const CreateData = () => {
      const data = {
        name: ProductName.current.value,
        slug: Slug.current.value,
        description: Description.current.value,
        price: Price.current.value,
      }
      
      if(data.name === '' || data.slug === '' || data.description === '' || data.price === '') {
         alert('All fields are required!');
         return false;
      }

      axios.post(ApiEndPoint, JSON.stringify(data), Headers).then(result => {
         if(result.data) {
            alert('Successfully Created!')
            GetProducts();
            handleClose();
         }
      }).catch(err => {
        console.log(err);
      })
  };

  const GetProducts = () => {
     axios.get(ApiEndPoint).then(result => {
       setProducts(result.data);
     }).catch(err => {
       console.log(err);
     })
  };

  const DeleteData = (id) => {
    if(window.confirm('Are you sure you want to delete this data?') === false) {
      return false;
    }
    axios.delete(`${ApiEndPoint}/${id}`).then(result => {
      if(result.data === 1) {
        alert('Successfully Deleted!')
        GetProducts();
      }
    }).then(err => {
      console.log(err);
    })
  }

  const ShowData = (data) => {
    
    setTimeout(() => {
      UpdateProductName.current.value = data.name;
      UpdateSlug.current.value = data.slug;
      UpdateDescription.current.value = data.description;
      UpdatePrice.current.value = data.price;
      ProductID.current.value = data.id;
    },500);

    handleShowUpdate();
  }

  const UpdateData = () => {

    const data = {
      name: UpdateProductName.current.value,
      slug: UpdateSlug.current.value,
      description: UpdateDescription.current.value,
      price: UpdatePrice.current.value,
    }
    const id = ProductID.current.value;
    
    if(data.name === '' || data.slug === '' || data.description === '' || data.price === '') {
       alert('All fields are required!');
       return false;
    }

    axios.put(`${ApiEndPoint}/${id}`, JSON.stringify(data), Headers).then(result => {
       if(result.data) {
          alert('Successfully Updated!')
          GetProducts();
          handleCloseUpdate();
       }
    }).catch(err => {
      console.log(err);
    })
  };

  return (
    <div className="App">
       <Container>
          <h3 className='text-center'>CRUD APPLICATION</h3>
           <Row>
               <Col md={12}>
                  <Button variant="primary" className='mt-3' onClick={handleShow}>Create</Button>
                  <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>Slug</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Created At</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                           {products.map((data, key) =>
                             <tr key={key}>
                                <td>{data.id}</td>
                                <td>{data.name}</td>
                                <td>{data.slug}</td>
                                <td>{data.description}</td>
                                <td>{data.price}</td>
                                <td>{data.created_at}</td>
                                <td>
                                  <Button variant="primary" className='btn-sm' onClick={() => ShowData(data)}>Update</Button>
                                  <Button variant="danger" className='mr-3 btn-sm' onClick={() => DeleteData(data.id)}>Delete</Button>
                                </td>
                             </tr>
                           )}
                        </tbody>
                    </Table>

               </Col>
           </Row>
       </Container>

       <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control type="text" placeholder="Product Name" ref={ProductName}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Slug</Form.Label>
              <Form.Control type="text" placeholder="Slug" ref={Slug}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} ref={Description}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" placeholder="Price" ref={Price}/>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={CreateData}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showUpdate} onHide={handleCloseUpdate}>
          <Modal.Header closeButton>
            <Modal.Title>Update Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form.Group className="mb-3">
              <Form.Label>#</Form.Label>
              <Form.Control type="text" readOnly placeholder="Product Name" ref={ProductID}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control type="text" placeholder="Product Name" ref={UpdateProductName}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Slug</Form.Label>
              <Form.Control type="text" placeholder="Slug" ref={UpdateSlug}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} ref={UpdateDescription}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" placeholder="Price" ref={UpdatePrice}/>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseUpdate}>
              Close
            </Button>
            <Button variant="primary" onClick={UpdateData}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
    </div>
  );
}

export default App;
