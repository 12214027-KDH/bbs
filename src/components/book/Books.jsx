import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Row, Col, Card,InputGroup, Form, Button} from 'react-bootstrap'
import { GiVanillaFlower } from 'react-icons/gi';
import { TiShoppingCart } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import { app } from '../../firebaseInit';
import { getDatabase, ref, set, get } from 'firebase/database';

const Books = () => {
  const db = getDatabase(app);
  const navi = useNavigate();
  const uid = sessionStorage.getItem('uid')
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('도커');
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const callAPI = async() => {
    setLoading(true);
    const url = `https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=12&page=${page}`;
    const config ={
      headers: {"Authorization":"KakaoAK b63f7fcac38c737b722b07b0f94c447b"}
    };
    const res = await axios.get(url,config);
    console.log(res.data);
    setBooks(res.data.documents);
    setLoading(false);
  }

  useEffect(()=> {
    callAPI();
  }, [page])

  const onSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    callAPI();
  }

  const onClickCart = (book) => {
    if(uid) {
      //장바구니에 도서넣기
      if(window.confirm(`"${book.title}"\n도서를 장바구니에 넣으실래요?`)){
        //장바구니 체크
        get(ref(db, `cart/${uid}/${book.isbn}`)).then(snapshot=>{
          if(snapshot.exists()){
            alert("이미 장바구니에 있습니다.");
          }else{
            set(ref(db, `cart/${uid}/${book.isbn}`), {...book});
        alert("성공!");
          }
        });
      }
    }else{
      //로그인
      alert('로그인이 필요한 서비스입니다. 로그인을 해주세요.');
      sessionStorage.setItem('target', '/books');
      navi('/login');
    }
  }

  if(loading) return <h1 className='my-5'>로딩중입니다....</h1>

  return (
    <div>
      <h1 className='my-5'>도서검색</h1>
      <Row className='mb-2'>
        <Col xs={8} md={6} lg={4}>
          <form onSubmit={onSubmit}>
            <InputGroup>
              <Form.Control onChange={(e)=> setQuery(e.target.value)} placeholder = "검색어" value={query}/>
              <Button type="submit">검색</Button>
            </InputGroup>
          </form>
        </Col>
      </Row>
      <Row>
        {books.map(book=>
          <Col key={book.isbn} xs={6} md={3} lg={2} className='mb-2'>
            <Card>
              <Card.Body className='justify-content-center d-flex'>
                <img wdith="90%" src={book.thumbnail || 'http://via.placeholder.com/120x170'}/>
              </Card.Body>
              <Card.Footer>
                <div className='ellipsis'>{book.title}</div>
                <TiShoppingCart onClick={()=>onClickCart(book)} style={{cursor:'pointer', fontSize:'20px', color:'green'}}/>
              </Card.Footer>
            </Card>
          </Col>
        )}
      </Row>
      <div className='text-center my-3'>
        <Button onClick={()=> setPage(page-1)} disabled={page===1}>이전</Button>
        <span className='mx-2'>{page}</span>
        <Button onClick={()=> setPage(page+1)}>다음</Button>
      </div>
    </div>
  )
}

export default Books
