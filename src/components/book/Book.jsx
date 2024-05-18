import React from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Book = ({book}) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

  return (
    <div>
       <>
       <img wdith="90%" src={book.thumbnail || 'http://via.placeholder.com/120x170'} onClick={handleShow} style={{cursor:'pointer'}} width="90%"/>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>상세보기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <div>제목: {book.title}</div>
         <div>가격: {book.price}</div>
         <div>저자: {book.authors}</div>
         <div>출판사: {book.publisher}</div>
         <hr/>
         <div>{book.contents}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
    </div>
  )
}

export default Book
