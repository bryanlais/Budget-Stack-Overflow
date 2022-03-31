export default class Model {
  constructor() {
    this.data = {
      questions: [
                  {
                    qid: 'q1',
                    title: 'Programmatically navigate using React router',
                    text: 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.',
                    tagIds: ['t1', 't2'],
                    askedBy : 'JoJi John',
                    askedOn: 'Jan 19, 2022',
                    askedAt: '21:25',
                    answers: ['a1', 'a2'],
                    views: 10,
                  },
                  {
                    qid: 'q2',
                    title: 'android studio save string shared preference, start activity and load the saved string',
                    text: 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.',
                    tagIds: ['t3', 't4', 't2'],
                    askedBy : 'saltyPeter',
                    askedOn: 'Jan 01, 2022',
                    askedAt: '01:15',
                    answers: ['a3', 'a4', 'a5'],
                    views: 121,
                  }
                ],
      tags: [
        {
          tid: 't1',
          name: 'react',
        },
        {
          tid: 't2',
          name: 'javascript',
        },
        {
          tid: 't3',
          name: 'android-studio',
        },
        {
          tid: 't4',
          name: 'shared-preferences',
        }
      ],

      answers: [
        {
          aid: 'a1',
          text: 'React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.',
          ansBy: 'hamkalo',
          ansOn: 'Feb 02, 2022',
          ansAt: '10:15',
        },
        {
          aid: 'a2',
          text: 'On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.',
          ansBy: 'azad',
          ansOn: 'Jan 31, 2022',
          ansAt: '10:15',
        },
        {
          aid: 'a3',
          text: 'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.',
          ansBy: 'abaya',
          ansOn: 'Jan 21, 2022',
          ansAt: '21:15',
        },
        {
          aid: 'a4',
          text: 'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);',
          ansBy: 'alia',
          ansOn: 'Feb 05, 2022',
          ansAt: '19:51',
        },
        {
          aid: 'a5',
          text: 'I just found all the above examples just too confusing, so I wrote my own. ',
          ansBy: 'sana',
          ansOn: 'Jan 30, 2022',
          ansAt: '09:29',
        }
      ]
    };
  }

  getQuestionById(qid){
    for(let i = 0; i < this.data.questions.length; i++){
      if(qid == this.data.questions[i].qid){
        return this.data.questions[i];
      }
    }
  }

  getTagById(tid){
    for(let i = 0; i < this.data.tags.length; i++){
      if(tid == this.data.tags[i].tid){
        return this.data.tags[i];
      }
    }
  }

  getAnswerById(aid){
    for(let i = 0; i < this.data.answers.length; i++){
      if(aid == this.data.answers[i].aid){
        return this.data.answers[i];
      }
    }
  }

  tagNameExists(tName){
    for(let i = 0; i < this.data.tags.length;i++){
      if(tName == this.data.tags[i].name){
        return true;
      }
    }
    return false;
  }

  getTagByName(tName){
    for(let i = 0; i < this.data.tags.length;i++){
      if(tName == this.data.tags[i].name){
        return this.data.tags[i];
      }
    }
    return null;
  }

  getQuestionTags(q){
    let tagArr = [];
    for(let t = 0; t < q.tagIds.length; t++){
      tagArr.push(this.getTagById(q.tagIds[t]));
    }
    return tagArr;
  }

  getQuestionAnswers(q){
    let answersArr = [];
    for(let a = 0; a < q.answers.length; a++){
      answersArr.push(this.getAnswerById(q.answers[a]));
    }
    return answersArr;
  }

  getQuestionIdsWithSpecificTagId(tid){
    let questionsArr = [];
    for(let q = 0; q < this.data.questions.length; q++){
      if(this.data.questions[q].tagIds.includes(tid)){
        questionsArr.push(this.data.questions[q].qid);
      }
    }
    return questionsArr;
  }

  getQuestionIdsWithSearchInput(searchInp){
    let qidsArr = [];
    for(let q = 0; q < this.data.questions.length; q++){
      if(this.data.questions[q].text.toLowerCase().split(" ").includes(searchInp) || this.data.questions[q].title.toLowerCase().split(" ").includes(searchInp)){
        qidsArr.push(this.data.questions[q].qid);
      }
    }
    return qidsArr;
  }

  getNumQuestionsWithTagId(tid){
    let num = 0;
    for(let q = 0; q < this.data.questions.length; q++){
      if(this.data.questions[q].tagIds.includes(tid)) num += 1;
    }
    return num;
  }

  sortQuestionAnswers(q, db){
    q.answers.sort(function(a,b){
      var a_obj = "";
      var b_obj = "";
      for(let x = 0; x < db.data.answers.length; x++){
        if(a == db.data.answers[x].aid){
          a_obj = db.data.answers[x];
        }
      }
      for(let y = 0; y < db.data.answers.length; y++){
        if(b == db.data.answers[y].aid){
          b_obj = db.data.answers[y];
        }
      }
      var a_str = a_obj.ansOn.substring(4,6) + " " + a_obj.ansOn.substring(0,3) + " " + a_obj.ansOn.substring(8,12) + " " + a_obj.ansAt + ":00 GMT";
      var b_str = b_obj.ansOn.substring(4,6) + " " + b_obj.ansOn.substring(0,3) + " " + b_obj.ansOn.substring(8,12) + " " + b_obj.ansAt + ":00 GMT";
      console.log("A Date: " + a_str);
      console.log("B Date: " + b_str);
      var a_date = Date.parse(a_str);
      var b_date = Date.parse(b_str);
      return a_date - b_date;
    })
  }

}
