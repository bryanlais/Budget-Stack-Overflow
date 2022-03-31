import React from 'react';
import Banner from './banner.js'
import Mainbody from './mainbody.js'
import Model from '../models/model.js';

export default class FakeStackOverflow extends React.Component {

  constructor(props){
    super(props);
    //States for pages:
    //qpage,answerspage,tpage,searchpage,qerrors,aerrors,qaskpage,tlinkpage
    this.state = {page: "qpage"};
    var statehandler = this.statehandler.bind(this);
    this.db = new Model();
  }

  statehandler(pageType){
    //alert('We pass argument from Child to Parent: ' + pageType);
    this.setState({page: pageType});
  }

  render() {
    var statehandler = this.statehandler;
    return (
      <div>
      <Banner page={this.state.page} statehandler={statehandler.bind(this)}>  </Banner>
      <Mainbody db={this.db} page={this.state.page} statehandler={statehandler.bind(this)}> </ Mainbody>
      </div>
    );
  }
}
