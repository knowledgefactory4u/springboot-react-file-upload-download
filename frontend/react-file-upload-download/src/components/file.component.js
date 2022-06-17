import React, { Component } from "react";
import UploadService from "../services/file.service";

export default class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);

    this.state = {
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: "",
      textValue: "Choose File",
      fileInfos: [],
    };
  }

  componentDidMount() {
    UploadService.getFiles().then((response) => {
      this.setState({
        fileInfos: response.data,
      });
    });
  }

  selectFile(event) {
    this.setState({
      selectedFiles: event.target.files,
    });
  }


  upload() {
    let currentFile = this.state.selectedFiles[0];

    this.setState({
      progress: 0,
      currentFile: currentFile,
    });

    UploadService.upload(currentFile, (event) => {
      this.setState({
        progress: Math.round((100 * event.loaded) / event.total),
      });
    })
      .then((response) => {
        this.setState({
          message: response.data.message,
        });
        return UploadService.getFiles();
      })
      .then((files) => {
        this.setState({
          fileInfos: files.data
        });
      })
      .catch(() => {
        this.setState({
          progress: 0,
          message: "Failed to upload the file!",
          currentFile: undefined,
        });
      });

    this.setState({
      selectedFiles: undefined,
    });
  }

  render() {
    const {
      selectedFiles,
      currentFile,
      progress,
      message,
      fileInfos,
    } = this.state;

    return (
      <div>
        <div class="form-group">
          <input class="form-control"
            name="file" onChange={this.selectFile} type="file" />
        </div>
        <div class="form-group">
          <button class="btn btn-dark"
            disabled={!selectedFiles}
            onClick={this.upload} type="submit">Upload</button>
        </div>

        {currentFile && (
          <div className="progress">
            <div
              className="progress-bar bg-success"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: progress + "%" }}
            >
              {progress}%
            </div>
          </div>
        )}
        <div className="alert alert-light" role="alert">
          <p class="text-danger">{message}</p>
        </div>

        <div className="card">
          <div class="btn-group mx-auto">
            <h4 class="card-header ">Download the file
            </h4>
          </div>
          <ul className="list-group">
            {fileInfos &&
              fileInfos.map((file) => (

                <a href={`http://localhost:8080/download/${file}`} class="list-group-item list-group-item-action ">
                  <li>{file}</li></a>

              ))}
          </ul>
        </div>
      </div>
    );
  }
}
