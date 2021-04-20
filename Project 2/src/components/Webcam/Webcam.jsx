import React from 'react';
import Webcam from "react-webcam";
import {Container, Button, TextField, Grid, withStyles} from '@material-ui/core';
import BaseComponent from '../../core/BaseComponent/BaseComponent';

class WebcamRollCall extends BaseComponent{
    constructor(props){
        super(props);
        this.state = {
            openCamera : false,
            fileImage : null
        }
    }
    _handleOpenCam = ()=>{
        console.log('open cam:', this.state.openCamera)
        this.setState({
            openCamera : !this.state.openCamera
        });
    }
    setRef = webcam => {
        this.webcam = webcam;
    };
    capture = () => {
        const imageSrc = this.webcam.getScreenshot();
        // this.setState({
        //   fileImage : imageSrc
        // })
        this.props.updateImage(imageSrc);
      };
    captureForTraining = () =>{
        const imageSrc = this.webcam.getScreenshot();
        this.props.setImage(imageSrc);
    }
    renderBody(){
        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: "user"
          };
        const {classes} = this.props;
        return(
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Button color={this.props.color} 
                        variant="contained"
                        onClick={this._handleOpenCam}>
                        {
                            this.state.openCamera == true ? "Đóng" : "Điểm danh tự động"
                        }
                    </Button>
                </Grid>
                {
                    this.state.openCamera ? (
                        <>
                            <Grid item xs={12} md={6}>
                                <Webcam
                                    mirrored={true}
                                    audio={false}
                                    height={400}
                                    ref={this.setRef}
                                    screenshotFormat="image/jpeg"
                                    width={500}
                                    videoConstraints={videoConstraints}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div className={classes.imagePadding}>
                                    <img src={this.props.fileImage} alt=""/>
                                </div>
                                
                            </Grid>
                            <Grid item xs={12}>
                                <Button color="primary" variant="contained" onClick={this.capture}>
                                    Chụp
                                </Button>
                            </Grid>
                        </>
                    ) : null
                }
                
            </Grid>
        )
        
    }
}
const styleLocalWebcam = {
    imagePadding : {
        verticalAlign : "middle",
        paddingTop : "60px"
    }
}
export default withStyles(styleLocalWebcam)(WebcamRollCall);