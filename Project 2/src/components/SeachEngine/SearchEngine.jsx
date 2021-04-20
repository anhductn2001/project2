import React from 'react';
import axios from 'axios';
import lodash from 'lodash';
import TextField from '@material-ui/core/TextField';
import * as httpClient from '../../core/HttpClient';
import {Typography, withStyles} from '@material-ui/core';
import {sensitiveStorage} from '../../core/services/SensitiveStorage';

const searchAPi = async (text)  => axios.get("https://country.register.gov.uk/records.json?page-size=5000");
class SearchEngine extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value : "",
            listClass : [],
            selected : "",
            isShowSelect : false
        }
        this.searchAsync = lodash.debounce(this.searchEngineAsync, 1000);
    }
    componentDidMount(){
      document.addEventListener("click", this._closeSelected);
    }
    searchEngineAsync = async()=>{
      let data = {
        className : this.state.value,
        teacherId : sensitiveStorage.getUserId()
      }
        let response = await httpClient.sendPost('/search-class', data);
        console.log("response :", response);
        this.setState({
          listClass : response.data.Data
        })
    }
    handleChange = async(e) =>{
        await this.setState({
            value : e.target.value,
            isShowSelect : true
        })
        await this.searchAsync();
    }
    _hanldeSelected = (e)=>{
      this.setState({
        selected : e.target.value
      })
    }
    _closeSelected = () =>{
      this.setState({
        isShowSelect : false
      })
    }
    _onClickSelect=(item)=>{
      console.log('item :', item)
      this.setState({
        value : item.ten_mon,
        isShowSelect : false
      })
      this.props.updateDataClass(item)
    }
    render(){
      const {classes} = this.props;
      return(
        <div className={classes.wrapperSearch}>
          <TextField
            fullWidth
            id="outlined-select-currency-native"
            label="Nhập lớp học"
            value={this.state.value}
            onChange={(e) => this.handleChange(e)}
            SelectProps={{
              native: true,
            }}
            variant="outlined"
          >
          </TextField>
          { 
            this.state.isShowSelect ? (
            <div className={classes.autoComplete}>
              {
                this.state.listClass.map((item,index) => {
                  return(
                    <Typography key={index} onClick={()=> this._onClickSelect(item)}>
                      {item.ten_mon}
                    </Typography>
                  )
                })
              }
            </div>) : null
          }
        </div>
      );
    }
}
const style={
  autoComplete: {
    border: "1px solid gray",
    borderRadius : "5px",
    backgroundColor:"white",
    cursor:"pointer",
    position : "absolute",
    minWidth : "238px",
    zIndex : 999
  },
  wrapperSearch : {
    position : "relative"
  }
}
export default withStyles(style)(SearchEngine);