import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from "./ui/Button";
import {SurveyItem} from './ui/SurveyItem';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; 
import SurveyComplete from './SurveyComplete';
import Styles from '../pages/css/SurveyItem.module.css';
import Dropdown from "./ui/Dropdown";
import { Grid, TextField } from "@mui/material";
import  { questionList } from "./ui/Dropdown";
import styled from "styled-components";


const token = localStorage.getItem("ACCESS_TOKEN");



const Wrapper = styled.div`
    padding: 16px;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    background-color : #A0D3F9;
    overflow:hidden;
    height:auto;
    min-height:100vh;
    margin: auto;
    flex-grow: 1;
`;

const Box = styled.div`
  background-color: #A0D3F9;
    margin: auto;
    justify-content: center;
    width: 100%;
    flex-grow: 1;
    overflow: hidden;
    height:auto;
    padding-bottom:100px;
    min-width: 780px;
    max-width: 780px;  
    & > * {
        :not(:last-child) {
            margin-bottom: 16px;
        }
    }
`;


const Container = styled.div`
  background-color: white;
    width: 100%;
    margin: auto;
    height: auto;
    padding-bottom:10px;
    justify-content: center;
    align-items:center;
    max-width: 780px;
`;

const Card = styled.div`
  background-color: white;
  margin-bottom: 10px;
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;


function SurveyModify() {
  const { surveyId } = useParams();
  const [surveyData, setSurveyData] = useState("");
  const navigate = useNavigate();

  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`${surveyId} !!!`);
        const response = await axios.get(`/api/ques/${surveyId}`);
        setSurveyData(response.data);
        console.log("response",response.data);
      } catch (error) {
        console.error('Error fetching survey questions:', error);
      }
    };
    fetchData();
  }, [surveyId]);
  

  console.log("시벌"+surveyData);

  const handleAfterSubmit = async (event) => {
    event.preventDefault();
    
    // 서버로 데이터를 보내는 로직 작성

    // 설문 관리 페이지로 이동
    navigate("/managesurvey");
  }

 

 

  // const history = useHistory();



  const handleSubmit = async (event) => {
    event.preventDefault();
    // 서버로 데이터를 보내는 로직 작성
    // ...
    console.log(globalTitle);
    //console.log(savedquestion);

    let savedquestion = questionList ? questionList.filter(item => 'num' in item) : [];
    let newquestion = questionList ? questionList.filter(item => !('num' in item)) : [];
    
    console.log("합", questionList);
    console.log("원래 있던거", savedquestion);
    console.log("새로 만든거", newquestion);

    console.log("visibility: ", visibilityTemp);
    console.log("wearable: ", wearableTemp);

    const min = 1;
    const max = 1000;
    var randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    
    const token = localStorage.getItem("ACCESS_TOKEN");
    console.log("token", token);

    let result = await axios.patch("/api/patchQuestion", {
      title: globalTitle,
      questionList: questionList,
     //newquestionList : newquestion,

      visibility: visibilityTemp,
      wearable: wearableTemp,
      // surveyId : randomInt
    }, {
      headers: {
        'Content-Type': 'application/json', // 요청 본문의 타입을 지정합니다.
        Authorization: `Bearer ${token}` // JWT 토큰을 헤더에 추가합니다.
      }
    });

    //console.log(result);
  
    if (result.status === 200) {
      alert("success to create new question");
      const baseUrl = "http://localhost:3000/check-password/";
      const uniqueUrl = `${baseUrl}${result.data}`;
      navigate("/survey-gen-complete", { state: { uniqueUrl } });
      
    } else {
      alert("failed to create new Car");
    }
    // 다른 페이지로 이동
    // history.push("/home");
    
  };

  if (!surveyData) {
    return <div>Loading...</div>;
  }
 const sortedQuestions = [...surveyData.yesOrNoQuestions, ...surveyData.multipleChoiceQuestions, ...surveyData.subjectiveQuestions].sort((a, b) => a.num - b.num);


  console.log("sortedQuestions: ", sortedQuestions);




  
  return (
    <Wrapper>
      <Box>
        <Card>
        <Container>
        {surveyData && <TitleInput title={surveyData.title} />}
       
        </Container>
        </Card>
        <Dropdown pushlist = {sortedQuestions}/>
        
        <Card>
        <Container>
        <h3 htmlFor="title-input">완료 설정</h3>
        <br/>
        <Grid container>
          <Grid item xs={12} md={4}>
            <VisibilitySelector />
          </Grid>
          <Grid item xs={12} md={4}>
            <WearableSelector />
          </Grid>
          <Grid item xs={12} md={4} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
            <form onSubmit={handleSubmit}>
              <Button type="submit" title="설문 생성 완료"></Button>
            </form>
          </Grid>
        </Grid>
        </Container>
        </Card>
        {console.log("왜?",questionList)}
      </Box>
    </Wrapper>
  );
};




const HorizonLine = ({ text }) => {
  return (
    <div
      style={{
        width: "100%",
        textAlign: "center",
        borderBottom: "1px solid #aaa",
        lineHeight: "0.1em",
        margin: "10px 0 20px",
      }}
    >
      <span style={{ background: "#fff", padding: "0 10px" }}>{text}</span>
    </div>
  );
};

let globalTitle ;


function TitleInput(props) { // 제목
  console.log(props.title);
  const [title, setTitle] = useState(String(props.title));

  //console.log(surveyData.title + "제목이다");
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  


  return (
    <div>
      {/* <h3 htmlFor="title-input">설문 제목</h3>  // 참고
      <input
        type="text"
        id="title-input"
        value={title}
        onChange={handleTitleChange}
      /> */}

      <Grid container style={{ marginTop: 10 }}>
        <h3 htmlFor="title-input">설문 제목</h3>
        <Grid xs={11} md={11} item style={{ paddingRight: 16 }}>
          <TextField placeholder="제목을 입력하세요" fullWidth value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              globalTitle = event.target.value;
            }}
            InputProps={{
              style: {
                width:720,
                borderRadius: "10px",
              }
            }}
            />
        </Grid>
      </Grid>
    </div>
  );
}

let visibilityTemp = null;
function VisibilitySelector() { //  공개 여부
  const [visibility, setVisibility] = useState("public");

  const handleVisibilityChange = (event) => {
    setVisibility(event.target.value);
  };
  visibilityTemp = visibility;  // **
  return (
    <div>
      <p> [공개 여부]</p>
      <label>
        공개 <span> </span> 
        <input
          type="radio"
          value="public"
          checked={visibility === "public"}
          onChange={handleVisibilityChange}
        />

      </label>
      <label>
        비공개<span> </span> 
        <input
          type="radio"
          value="private"
          checked={visibility === "private"}
          onChange={handleVisibilityChange}
        />
      </label>
      
    </div>
  );
}
let wearableTemp = null;

function WearableSelector() { // 기기 착용 여부
  const [wearable, setWearable] = useState("worn");

  const handleWearableChange = (event) => {
    setWearable(event.target.value);
  };
  wearableTemp = wearable;
  return (
    <div>
      <p> [기기 착용 필수 여부]</p>
      <label>
        착용<span> </span> 
        <input
          type="radio"
          value="worn"
          checked={wearable === "worn"}
          onChange={handleWearableChange}
        />
      </label>
      <label>
        미착용<span> </span> 
        <input
          type="radio"
          value="not-worn"
          checked={wearable === "not-worn"}
          onChange={handleWearableChange}
        />
      </label>
    </div>
  );
}








export default SurveyModify;