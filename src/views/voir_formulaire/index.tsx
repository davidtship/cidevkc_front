import { Button,Col,Dropdown, DropdownDivider, Card, Table, ProgressBar, Row, Stack, Pagination } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useNavigate,useParams  } from 'react-router-dom'
import { useState, useEffect } from 'react'
const style1 ={
marginBottom:'3%'
}


const Formulaire = () => {
  const { id } = useParams();
  const [data,setdata]=useState([]);
  const [title,settitle]=useState([]);
  const [categories,setcategories]=useState([]);
  const [questions,setquestion]=useState([]);
  const [question_title,question_settitle]=useState([]);
  const [options,setoptions]=useState([]);
  
  useEffect(() => {
    async function fetchMyAPI() {

      const res = await fetch('http://localhost:8000/api/getFormbyid/'+id,{
        'method':'GET',
        'headers':{
        'Content-Type':'application/json'
        }
      });
      const resData = await res.json();
      settitle(resData.title);
      setcategories(resData.categories)
    }
    fetchMyAPI()
  }, [])

  return (
    <div>
    
      <h4>{title}</h4>     
          <Col  xl={18}>     
           {categories.map(({questions,title}, index) => (
           <div>
           <p style={{fontSize:'1.3em'}}>Section {index+1} :{title}</p> 
                <ul>
                  <li>{questions.map(({question_type,label,choices}, index) => (
                      <div>
                        <p style={{fontSize:'1.3em'}}>{label}:</p>
                        {choices.map(({option}, index) => (
                      <p style={{fontSize:'1.3em'}}>{index+1}-{option}</p>
                        ))}
                        </div>
                      
                      
                  ))}
                  </li>
                </ul>
            </div>
           ))}
        </Col>
    </div>
  )
}

export default Formulaire
