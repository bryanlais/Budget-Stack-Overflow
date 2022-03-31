import React, {useState} from 'react'
import '../index.css';

function QuestionsPage(props){
  let data = props.db.data;
  let qArr = data.questions;
  let qlength = qArr.length;
  let questionRows = []

  for(let q = 0; q < qlength; q++){
    let dynamicid = 'link' + qArr[q].qid
    let qkeyid = 'qkey' + qArr[q].qid
    let tags = props.db.getQuestionTags(qArr[q]);
    let tagHtml = [];
    for(let t = 0; t < tags.length; t++){
      if(t % 4 == 0 && t > 1) {
        tagHtml.push(<br/>);
      }
      let tkeyid = 'tkey' + qArr[q].qid + '_' + tags[t].tid;
      tagHtml.push(<button class="tag" key={tkeyid}> {tags[t].name} </button>);
    }
    questionRows.push(
      <tr key={qkeyid}>
        <td class = "left">
        {qArr[q].views} Views <br /> {qArr[q].answers.length} Answers
        </td>
        <td class ="middle">
        <a id={dynamicid} onClick={()=>props.statehandler('answerspage'+dynamicid)}> {qArr[q].title} </a> <br />
        {tagHtml}
        </td>
        <td class ="right">
        Asked By <span class="asked"> {qArr[q].askedBy} </span> <br /> On <span class="on"> {qArr[q].askedOn} </span> <br /> At <span class="at"> {qArr[q].askedAt} </span>
        </td>
      </tr>
    )
  }
  return (
    <div clas="main">
    <div class="row" id="qpagerow">
      <div class="column"> {qlength} Questions </div>
      <div class="column"> All Questions </div>
      <div class="column" id="askquestion" onClick={()=>props.statehandler('qaskpage')}> <button> Ask A Question </button> </div>
    </div>
    <br/>
    <table id="qtable">
    <tbody>
    {questionRows}
    </tbody>
    </table>
    </div>
  );
}

function TagLinkPage(props){
  let tid = props.tid;
  let tag = props.db.getTagById(tid);
  let tagName = tag.name;
  let q_ids = []
  if(props.db.getTagByName(tagName)){
    q_ids = q_ids.concat(props.db.getQuestionIdsWithSpecificTagId(props.db.getTagByName(tagName).tid));
  }

  let qlength = q_ids.length;
  let questionRows = []
  for(let q = 0; q < qlength; q++){
    let question = props.db.getQuestionById(q_ids[q]);
    let dynamicid = 'link' + q_ids[q]
    let qkeyid = 'qkey' + q_ids[q]
    let tags = props.db.getQuestionTags(question);
    let tagHtml = [];
    for(let t = 0; t < tags.length; t++){
      if(t % 4 == 0 && t > 1) {
        tagHtml.push(<br/>);
      }
      let tkeyid = 'tkey' + question.qid + '_' + tags[t].tid;
      tagHtml.push(<button class="tag" key={tkeyid}> {tags[t].name} </button>);
    }
    questionRows.push(
      <tr key={qkeyid}>
        <td class = "left">
        {question.views} Views <br /> {question.answers.length} Answers
        </td>
        <td class ="middle">
        <a id={dynamicid} onClick={()=>props.statehandler('answerspage'+dynamicid)}> {question.title} </a> <br />
        {tagHtml}
        </td>
        <td class ="right">
        Asked By <span class="asked"> {question.askedBy} </span> <br /> On <span class="on"> {question.askedOn} </span> <br /> At <span class="at"> {question.askedAt} </span>
        </td>
      </tr>
    )
  }
  //If no questions, render HTML to say NO QUESTIONS FOUND.
  if(qlength == 0){
    questionRows.push(<div class="column full"> No Questions Found </div>);
  }
  return (
    <div clas="main">
    <div class="row" id="searchrow">
      <div class="column"> {qlength} Questions </div>
      <div class="column"> Questions Tagged [{tagName}] </div>
      <div class="column" id="askquestion" onClick={()=>props.statehandler('qaskpage')}> <button> Ask A Question </button> </div>
    </div>
    <br/>
    <table id="qtable">
    <tbody>
    {questionRows}
    </tbody>
    </table>
    </div>
  );
}

function TagsPage(props){
  let data = props.db.data;
  let tArr = data.tags;
  let tlength = tArr.length;
  let tagHtml = [];
  for(let t = 0; t < props.db.data.tags.length; t++){
    if(t % 3 == 0){
      tagHtml.push(<br/>);
    }
    let tid = props.db.data.tags[t].tid;
    let tName = props.db.data.tags[t].name;
    let numQuestions = props.db.getNumQuestionsWithTagId(tid);
    let qText = numQuestions == 1 ? "Question" : "Questions"
    tagHtml.push(<div class="column tagcard"> <a id={tid} onClick={()=>props.statehandler('taglinkpage'+tid)}> {tName} </a> <br /> <br /> {numQuestions} {qText} </div>);
  }
  return(<div class="main">
    <div class="row" id="tpagerow">
    <div class="column"> {tlength} Tags </div>
    <div class="column"> All Tags </div>
    <div class="column" id="tagaskquestion" onClick={()=>props.statehandler('qaskpage')}> <button> Ask A Question </button> </div>
    {tagHtml}
    </div>
  </div>);
}


/*Asking Questions Page**/
let errArr = [];

function useForceUpdate() {
  let [value, setState] = useState(true);
  return () => setState(!value);
}

function QuestionsAskPage(props){
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [qtags, setTags] = useState('');
  const [user, setUser] = useState('');
  let forceUpdate = useForceUpdate();

  const handleTitleChange = event => {
    setTitle(event.target.value);
  }
  const handleTextChange = event => {
    setText(event.target.value);
  }
  const handleTagsChange = event => {
    setTags(event.target.value);
  }
  const handleUserChange = event => {
    setUser(event.target.value);
  }
  const handleQuestionSubmit = event => {
    event.preventDefault();
    errArr = []
    let errors = false;
    if(title.length > 100){
      errArr.push(<p> Error: There are more than 100 characters in the Question Title. </p>);
      errors = true;
    }
    if(title.length == 0){
      errArr.push(<p> Error: Question Title cannot be empty. </p>);
      errors = true;
    }
    if(!text){
      errArr.push(<p> Error: Question Text cannot be empty. </p>);
      errors = true;
    }
    if(!qtags) {
      errArr.push(<p> Error: Tags cannot be empty. </p>);
      errors = true;
    }
    if(user.length > 15) {
      errArr.push(<p> Error: Username cannot exceed 15 characters! </p>);
      errors = true;
    }
    if(user.length == 0) {
      errArr.push(<p> Error: Username cannot be empty! </p>);
      errors = true;
    }
    if(!errors){
      let tag_ids = [];
      let tagz = qtags.split(" ");
      //Removes all whitespace
      tagz = tagz.filter(function(s) {
      return /\S/.test(s.toLowerCase());
      });
      for(let i = 0; i < tagz.length; i++){
        let tName = tagz[i].toLowerCase();
        //If the tag exists in the database, add the tag id to the array if not added already.
        if(props.db.tagNameExists(tName)){
          if(!tag_ids.includes(props.db.getTagByName(tName).tid)){
            console.log("what");
            tag_ids.push(props.db.getTagByName(tName).tid);
          }
        }
        //If the tag does not exist in the database, create a new tag, add to the array and the database.
        else{
          const tag = {
            tid: 't' + props.db.data.tags.length + 1,
            name: tagz[i]
          }
          tag_ids.push(tag.tid);
          props.db.data.tags.push(tag);
        }
      }

      //Creating the Question
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let today = new Date();
      let minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
      //Create the question
      const question = {
        qid: 'q' + (props.db.data.questions.length + 1),
        title: title,
        text: text,
        tagIds: tag_ids,
        askedBy : user,
        askedOn: months[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear(),
        askedAt: today.getHours() + ':' + minutes,
        answers: [],
        views: 0,
      }
      props.db.data.questions.unshift(question);
      props.statehandler('qpage');
    }
    /*alert(`State values: \n
        title: ${title} \n
        text: ${text} \n
        tags: ${tags} \n
        user: ${user} \n
        You can replace this alert with your process`);*/
  };
  return(
    <div class="main">
    <form onSubmit={handleQuestionSubmit}>
    <div class="row errors">
    {errArr}
    </div>
    <div class="row lt"> <div class="subtitle"> Question Title </div> <br /> <textarea id="qtitle" type="title" name="title" onChange={handleTitleChange} value={title} placeholder="Note: Your title should not be more than 100 characters!"></textarea></div>
    <div class="row lt"> <div class="subtitle"> Question Text </div> <br /> <textarea id="qtext" type="text" name="text" onChange={handleTextChange} value={text} placeholder="Note: Make sure to add important details to your question."></textarea></div>
    <div class="row lt"> <div class="subtitle"> Tags </div> <br /> <textarea id="qtags" type="qtags" name="qtags" onChange={handleTagsChange} value={qtags} placeholder="Note: Add tags/keywords separated by whitespace, this cannot be empty!"></textarea></div>
    <div class="row lt"> <div class="subtitle"> Username </div> <br /> <textarea id="quser" type="user" name="user" onChange={handleUserChange} value={user} placeholder="Note: Your username cannot be empty or greater than 15 characters."></textarea></div>
    <div class="row"> <button type="submit" id="postquestion"> Post Question </button> </div>
    <br />
    </form>
    </div>
  );
}

/*Asking Answers page*/
function AnswerQuestionsPage(props){

  const [text, setText] = useState('');
  const [user, setUser] = useState('');
  const handleTextChange = event => {
    setText(event.target.value);
  }
  const handleUserChange = event => {
    setUser(event.target.value);
  }
  const handleAnswerSubmit = event => {
    event.preventDefault();
    errArr = []
    let errors = false;
    if(!text){
      errArr.push(<p> Error: Answer Text cannot be empty. </p>);
      errors = true;
    }
    if(user.length > 15) {
      errArr.push(<p> Error: Username cannot exceed 15 characters! </p>);
      errors = true;
    }
    if(user.length == 0) {
      errArr.push(<p> Error: Username cannot be empty! </p>);
      errors = true;
    }
    if(!errors){
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let today = new Date();
      let minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
      //Get the corresponding question and create answer object for it.
      let question = props.db.getQuestionById(props.qid);
      const answer_obj = {
        aid: 'a' + (props.db.data.answers.length + 1),
        text: text,
        ansBy: user,
        ansOn: months[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear(),
        ansAt: today.getHours() + ':' + minutes,
      }
      props.db.data.answers.unshift(answer_obj);
      question.answers.push(answer_obj.aid);
      question.views -= 1;
      props.statehandler('answerspagelink'+question.qid);
    }
  }
  //alert(props.qid);
  return(
    <div class="main">
    <form onSubmit={handleAnswerSubmit}>
      <div class="row errors"> {errArr} </div>
      <div class="row lt"> <div class="subtitle"> Answer Text </div> <br /> <textarea id="atext" type="text" name="text" onChange={handleTextChange} value={text} placeholder="Note: Make sure you actually give a decent response, it has to be something."></textarea></div>
      <div class="row lt"> <div class="subtitle"> Username </div> <br /> <textarea id="auser" type="user" name="user" onChange={handleUserChange} value={user} placeholder="Note: Your username cannot be empty or greater than 15 characters."></textarea> </div>
      <div class="row"> <button type="submit" id="postanswer"> Post Answer </button> </div>
    </form>
    </div>
  );
}



/*Answers Page*/
function AnswersPage(props){
  //Start rendering answers
  let question = props.db.getQuestionById(props.qid);
  //Increase # of views when going to answer page:
  question.views += 1;
  props.db.sortQuestionAnswers(question, props.db);
  let answers = props.db.getQuestionAnswers(question);
  let aLength = answers.length;
  let aArr = [];
  for(let a = 0; a < aLength; a++){
    let qakeyid = 'q' + props.qid + 'akey' + answers[a].aid
    aArr.push(
      <tr key={qakeyid}>
        <td class="answer text">
        {answers[a].text}
        </td>
        <td class="tright">
        Ans By <span class="asked"> {answers[a].ansBy} </span> <br /> On <span class="on"> {answers[a].ansOn} </span> <br /> At <span class="at"> {answers[a].ansAt} </span>
        </td>
      </tr>
    )
  }

  return (
    <div class="main">
    <div class="row" id="apagerow">
    <div class="column"> {answers.length} Answers </div>
    <div class="column size-25"> {question.title} </div>
    <div class="column" id="answeraskquestion" onClick={()=>props.statehandler('qaskpage')}> <button> Ask A Question </button> </div>
    </div>
    <div class="row" id="apagerow2">
    <div class="column bold"> {question.views} Views </div>
    <div class="column text"> {question.text} </div>
    <div class="column right"> Asked By <span class="asked"> {question.askedBy} </span> <br /> On <span class="on"> {question.askedOn} </span> <br /> At <span class="at"> {question.askedAt} </span></div>
    </div>
    <hr />
    <table id="atable">
    <tbody>
    {aArr}
    </tbody>
    </table>
    <div class="row"> <button type="submit" id="answerquestionpage" onClick={()=>props.statehandler('answerquestionspage'+props.qid)}> Answer Question </button> </div>'
    </div>
  );
}

function SearchPage(props){
  let search_string = props.searchinp.toLowerCase();
  let q_ids = []
  //Split search terms and do not include empty spaces as input.
  const search_arr = search_string.split(" ").filter(function(x) {
    return x != '';
  });
  console.log("All Search Terms: " + search_arr);
  for(let s = 0; s < search_arr.length; s++){
    //Search for tags:
    if(search_arr[s].charAt(0) == '[' && search_arr[s].charAt(search_arr[s].length - 1) == ']' && search_arr[s].length > 2){
      let tagName = search_arr[s].substring(1,search_arr[s].length - 1).toLowerCase();
      console.log("TagName: " + tagName);
      if(props.db.getTagByName(tagName)){
        q_ids = q_ids.concat(props.db.getQuestionIdsWithSpecificTagId(props.db.getTagByName(tagName).tid));
      }
    }
    else{
      q_ids = q_ids.concat(props.db.getQuestionIdsWithSearchInput(search_arr[s]));
    }
  }
  //Remove duplicate qids.
  q_ids = q_ids.filter(function(item, pos) {
    return q_ids.indexOf(item) == pos;
  })

  let qlength = q_ids.length;
  let questionRows = []
  for(let q = 0; q < qlength; q++){
    let question = props.db.getQuestionById(q_ids[q]);
    let dynamicid = 'link' + q_ids[q]
    let qkeyid = 'qkey' + q_ids[q]
    let tags = props.db.getQuestionTags(question);
    let tagHtml = [];
    for(let t = 0; t < tags.length; t++){
      if(t % 4 == 0 && t > 1) {
        tagHtml.push(<br/>);
      }
      let tkeyid = 'tkey' + question.qid + '_' + tags[t].tid;
      tagHtml.push(<button class="tag" key={tkeyid}> {tags[t].name} </button>);
    }
    questionRows.push(
      <tr key={qkeyid}>
        <td class = "left">
        {question.views} Views <br /> {question.answers.length} Answers
        </td>
        <td class ="middle">
        <a id={dynamicid} onClick={()=>props.statehandler('answerspage'+dynamicid)}> {question.title} </a> <br />
        {tagHtml}
        </td>
        <td class ="right">
        Asked By <span class="asked"> {question.askedBy} </span> <br /> On <span class="on"> {question.askedOn} </span> <br /> At <span class="at"> {question.askedAt} </span>
        </td>
      </tr>
    )
  }
  //If no questions, render HTML to say NO QUESTIONS FOUND.
  if(qlength == 0){
    questionRows.push(<div class="column full"> No Questions Found </div>);
  }
  return (
    <div clas="main">
    <div class="row" id="searchrow">
      <div class="column"> {qlength} Questions </div>
      <div class="column"> Search Results </div>
      <div class="column" id="askquestion" onClick={()=>props.statehandler('qaskpage')}> <button> Ask A Question </button> </div>
    </div>
    <br/>
    <table id="qtable">
    <tbody>
    {questionRows}
    </tbody>
    </table>
    </div>
  );
}

function RenderPage(props){
  let statehandler = props.statehandler;
  //Conditionals for Page:
  if(props.page == "qpage") return(<QuestionsPage db={props.db} statehandler={statehandler}> </QuestionsPage>);
  if(props.page == "tpage") return(<TagsPage db={props.db} statehandler={statehandler}> </TagsPage>);
  if(props.page =="qaskpage") return(<QuestionsAskPage db={props.db} statehandler={statehandler}> </QuestionsAskPage>);
  if(props.page.includes("answerspage")) return(<AnswersPage db={props.db} statehandler={statehandler} qid={props.page.slice(15)}> </AnswersPage>);
  if(props.page.includes("answerquestionspage")) return(<AnswerQuestionsPage db={props.db} statehandler={statehandler} qid={props.page.slice(19)}> </AnswerQuestionsPage>);
  if(props.page.includes("searchpage")) return(<SearchPage db={props.db} statehandler={statehandler} searchinp={props.page.slice(10)}> </SearchPage>)
  if(props.page.includes("taglinkpage")) return(<TagLinkPage db={props.db} statehandler={statehandler} tid={props.page.slice(11)}> </TagLinkPage>);
  return("");
}

export default class Mainbody extends React.Component {
  constructor(props){
    super(props);
    //States for pages:
    //qpage,answerspage,tpage,searchpage,qerrors,aerrors,qaskpage,tlinkpage
    this.state = {page: props.page};
  }

  render() {
    let statehandler = this.props.statehandler;
    return(
      <RenderPage db={this.props.db} page={this.props.page} statehandler={statehandler} />);
  }


}
