import * as React from 'react';
import styles from './StudentInfo.module.scss';
import { IStudentInfoProps } from './IStudentInfoProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { APIStates } from "./states";
import { SPGet, SPPost, SPUpdate, SPDelete } from "./SPOHelper";
import { SPComponentLoader } from "@microsoft/sp-loader";
// import { PrimaryButton } from "office-ui-fabric-react/lib/button";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { SPPermission } from "@microsoft/sp-page-context";
import CommonUtility from "./CommonUtility";
import { getListItems, postData, getValues } from './Apis';
import {
  mergeStyleSets, Modal, TextField, Dialog, DialogFooter, DialogType, Dropdown, Button, PrimaryButton, Icon, IconButton, DirectionalHint
} from 'office-ui-fabric-react';
// import { SPComponentLoader } from '@microsoft/sp-loader';
// import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
// import { Label, ILabelStyles } from 'office-ui-fabric-react/lib/Label';
// import { React15Tabulator, reactFormatter } from "react-tabulator";
// import Form from './Form';

let siteURL = "";
const studentList = "StudentInformation";
var rootUrl = window.location.origin;
var currentLoginUserInfo;
var loggedInUserReadPermission;
var generatepath;
var Files = [];
const CU: CommonUtility = new CommonUtility();

export default class StudentInfo extends React.Component<IStudentInfoProps, APIStates> {
  constructor(props) {
    super(props);
    siteURL = props.siteAbsoluteUrl;
    generatepath = siteURL.split(rootUrl)[1];
    //SPComponentLoader.loadCss(siteURL + "/Style%20Library/LMS/css/style.css");
    let permission = new SPPermission(this.props.userPermissions.value);
    loggedInUserReadPermission = permission.hasPermission(
      SPPermission.manageLists
    );
    this.setFNTextValues = this.setFNTextValues.bind(this);
    this.setLNTextValues = this.setLNTextValues.bind(this);
    this.state = {
      allStudentData: [],
      title: "",
      error: "",
      isLoaded: false,
      SSC_Doc: "",
      HSC_Doc: "",
      FirstName: "",
      LastName: ""
    };
    // SPComponentLoader.loadCss(window.location.origin + "/sites/contentTypeHub/Style%20Library/Community%20WebPart/css/CommunityWebPart.css");
    // SPComponentLoader.loadCss(escape(this.props.webURL) + "/Style%20Library/CSS/style.css");
  }

  public componentDidMount() {
    // get current login user detail
    currentLoginUserInfo = this.props.context.pageContext.legacyPageContext;
    this.getAllStudentInfo();
  }

  public getAllStudentInfo() {

  }

  // public getAllAPSNumber(loggedInUser) {
  //   promise = new Promise<any>((resolve, reject) => {
  //     SPGet(
  //       siteURL +
  //       `/_api/Lists/getbytitle('` +
  //       empTraingList +
  //       `')/items?$select=Author/Title,Title&$expand=Author&$filter=(Author/Title ne '` +
  //       loggedInUser +
  //       `')`
  //     ).then(r => resolve(r));
  //   });
  //   promise
  //     .then(r => {
  //       {
  //         if (r.value.length > 0) {
  //           this.setState({
  //             allAPSNumber: r.value[0]
  //           });
  //         }
  //       }
  //     })
  //     .catch(reject => {
  //       //console.log(reject);
  //     });
  // }

  // public handleComplateClick(ID, Title) {
  //   var allAPSInfo = this.state.allAPSNumber;
  //   var IsAPSNumberExit;
  //   if (this.state.APS.length == 6) {
  //     if (loggedInUserReadPermission == true) {
  //       var alltraing = this.state.allTrainingData;
  //       for (var prop in allAPSInfo) {
  //         if (allAPSInfo.hasOwnProperty(prop)) {
  //           if (allAPSInfo[prop] === this.state.APS) {
  //             IsAPSNumberExit = true;
  //           }
  //         }
  //       }
  //       if (IsAPSNumberExit != true) {
  //         SPPost({
  //           url:
  //             siteURL + `/_api/Lists/getbytitle('` + empTraingList + `')/items`,
  //           payload: {
  //             Title: this.state.APS,
  //             TrainingId: ID,
  //             Status: "Completed",
  //             ManagerId: managerId
  //           }
  //         }).then(r => {
  //           this.setState({
  //             APS: this.state.APS,
  //             completeMessage: true,
  //             allTrainingData: alltraing,
  //             errorMessage: false,
  //             isReadOnly: true,
  //             isCompleted: true,
  //             requiredFieldMessage: false,
  //             checkAnotherUserAPS: false,
  //             readUserPermissionMessage: false
  //           });
  //         });
  //       } else {
  //         //alert("error");
  //         this.setState({
  //           completeMessage: false,
  //           errorMessage: false,
  //           isCompleted: false,
  //           requiredFieldMessage: false,
  //           checkAnotherUserAPS: true,
  //           readUserPermissionMessage: false
  //         });
  //       }
  //     } else {
  //       this.setState({
  //         completeMessage: false,
  //         errorMessage: false,
  //         isCompleted: false,
  //         requiredFieldMessage: false,
  //         checkAnotherUserAPS: false,
  //         readUserPermissionMessage: true
  //       });
  //     }
  //   } else if (this.state.APS.length == 0) {
  //     this.setState({
  //       completeMessage: false,
  //       errorMessage: false,
  //       isCompleted: false,
  //       requiredFieldMessage: true,
  //       checkAnotherUserAPS: false,
  //       readUserPermissionMessage: false
  //     });
  //   } else {
  //     this.setState({
  //       completeMessage: false,
  //       errorMessage: true,
  //       isCompleted: false,
  //       requiredFieldMessage: false,
  //       checkAnotherUserAPS: false,
  //       readUserPermissionMessage: false
  //     });
  //   }
  // }

  public async onFileInputChange(ev, tagName, stateName) {
    console.log(ev);
    console.log(tagName);
    let state = {};
    if (ev.target.files.length > 0) {
      if (ev.target.files[0].type === "video/mp4" || ev.target.files[0].type === "audio/mp3" || ev.target.files[0].type === "image/gif") {
        alert("File Extensions like .gif, .mp4, .mp3 is not allowed");
        ev.target.value = "";
        //state[stateName] = "";
        //ev.preventDefault();
      }
      else {
        state[stateName] = tagName + "_" + ev.target.files[0].name;
        // this.validatingFileInput(state);
        this.setState(state);
        Files.push(ev.target.files[0]);
        console.log(state)
        console.log(Files)
      }
    }

    else {
      state[stateName] = "";
      this.setState(state);
    }
  }

  public onFileInputClick(ev, stateName) {
    //this. validatingFileInput(ev.target.files[0].name);

    console.log(ev);

    let fileLength = ev.target.files.length;
    let state = {};
    state[stateName] = "";
    this.setState(state);
    if (fileLength > 0) {
      let Filename = ev.target.files[0].name;

      for (var i = 0; i < Files.length; i++) {
        if (Filename === Files[i].name) {
          Files.splice(i, 1);
        }
      }
    }
  }

  private GetFileName(fullFileName) {
    var splitName = fullFileName.split("_")[0];
    var removeSplitName = splitName + "_";
    var acutalFileName = fullFileName.replace(removeSplitName, "");
    return acutalFileName;
  }

  public setFNTextValues(e) {
    let Event = e.target.value;
    this.setState({
      FirstName: Event
    })
  }

  public setLNTextValues(e) {
    let Event = e.target.value;
    this.setState({
      LastName: Event
    })
  }

  public async handleSubmit() {
    console.log(this.state.FirstName);
    console.log(this.state.LastName);
    console.log(this.state);
    var requestDigestData = await getValues(escape(this.props.siteAbsoluteUrl));
    var requestDigestValue = requestDigestData.d.GetContextWebInformation.FormDigestValue;
    var bodyArray = await this.getBody(this.state);
    var body = JSON.stringify(bodyArray[0]);
    var url = escape(this.props.siteAbsoluteUrl) + "/_api/web/lists/GetByTitle('StudentInformation')/items";
    var responseResult = postData(escape(this.props.siteAbsoluteUrl), url, body, requestDigestValue, Files);
    if (responseResult) {
      alert("Form has been successfully submitted.");
    }
    console.log(responseResult);
  }

  public getBody = (state) => {
    var bodyArray = [];
    bodyArray.push(
      {
        //left side parameters are actual list names            
        Title: state.FirstName,
        Attachments: true,
        LastName: state.LastName,
        SSC_Doc: state.SSC_Doc,
        HSC_Doc: state.HSC_Doc
      }
    );
    return bodyArray;
  };

  public render(): React.ReactElement<IStudentInfoProps> {
    return (
      <div>
        <div>
          <TextField label="FirstName"
            type="text"
            name="FirstName"
            id="txtFN"
            value={this.state.FirstName}
            onChange={e => this.setFNTextValues(e)}
          />
        </div>
        <div>
          <TextField
            label="LastName"
            type="text"
            name="LastName"
            id="txtLN"
            value={this.state.LastName}
            onChange={e => this.setLNTextValues(e)}
          />
        </div>
        <div>
          <label>SSC MarkSheet</label>
          <div><input type="file" className="sel_file" id="chooseFileSSC" placeholder="Select SSC Marksheet" onClick={e => this.onFileInputClick(e, "SSC_Doc")} onChange={e => this.onFileInputChange(e, "SSC", "SSC_Doc")} />
            <div id="SSC_Doc" className="input_group_label"><label><span title={this.GetFileName(this.state.SSC_Doc)}></span></label></div>
          </div>
        </div>
        <div>
          <label>HSC MarkSheet</label>
          <div><input type="file" className="sel_file" id="chooseFileHSC" placeholder="Select HSC Marksheet" onClick={e => this.onFileInputClick(e, "HSC_Doc")} onChange={e => this.onFileInputChange(e, "HSC", "HSC_Doc")} />
            <div id="HSC_Doc" className="input_group_label"><label><span title={this.GetFileName(this.state.HSC_Doc)}></span></label></div>
          </div>
        </div>
        <div>
          <button onClick={() => this.handleSubmit()}>Submit</button>
        </div>
      </div>
      // <div className={styles.studentInfo}>
      //   <div className={styles.container}>
      //     <div className={styles.row}>
      //       <div className={styles.column}>
      //         <span className={styles.title}>Welcome to SharePoint!</span>
      //         <p className={styles.subTitle}>Customize SharePoint experiences using Web Parts.</p>
      //         <p className={styles.description}>{escape(this.props.description)}</p>
      //         <a href="https://aka.ms/spfx" className={styles.button}>
      //           <span className={styles.label}>Learn more</span>
      //         </a>
      //       </div>
      //     </div>
      //   </div>
      // </div>
    );
  }
}
