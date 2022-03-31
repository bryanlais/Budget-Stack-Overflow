import React from 'react';
import '../index.css';

export default class Banner extends React.Component {
  constructor(props){
    super(props);
    //States for pages:
    //qpage,answerspage,tpage,searchpage,qerrors,aerrors,qaskpage,tlinkpage
    this.state = {page: props.page};
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(event){
    if(event.key === 'Enter'){
      this.props.statehandler('searchpage'+event.target.value);
    }
  }

  render(){
    var statehandler = this.props.statehandler;
    this.state = {page: this.props.page}; //Set state to parent.
  return(
    <div class="banner">
      <a id="questions" class={(this.state.page == "qpage" ? "clicked" : "")} onClick={()=>statehandler('qpage')}> Questions </a>
      <a id="tags" class={(this.state.page == "tpage" ? "clicked" : "")} onClick={()=>statehandler('tpage')}> Tags </a>
      Fake Stack Overflow
      <input type="text" id="search" placeholder="Search..." onKeyPress={this.handleKeyPress}></input>
    </div>
    );
  }
}
