import React from "react";
import Dropzone from "react-dropzone";
import "../css/Upload.css";
import request from "superagent";

const imageMaxSize = 10000000; //bytes
const noClick = e => e.stopPropagation();

class UploadDrop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSrc: null,
      title: "filename"
    };
  }

  handleOnDrop = (files, rejectedFiles) => {
    const req = request.post("http://52.151.113.157/upload_a_file");

    files.forEach(file => {
      req
        .field("type", "new")
        .field("file_name", file.name)
        .attach("file", file);
    });
    req.end();

    if (rejectedFiles && rejectedFiles.length > 0) {
      const currentRejectFile = rejectedFiles[0];
      const currentRejectFileSize = currentRejectFile.size;
      if (currentRejectFileSize > imageMaxSize) {
        alert("This file is too big.");
        console.log("Rejected file:", rejectedFiles);
      }
    } else {
      // console.log(files, " has been uploaded.");

      const currentFile = files[0];
      const fileItem = new FileReader();
      fileItem.addEventListener(
        "load",
        () => {
          console.log(files[0].name, "has been uploaded.");
          this.setState({
            imgSrc: fileItem.result,
            title: files[0].name
          });
        },
        false
      );

      fileItem.readAsDataURL(currentFile);
    }
  };

  render() {
    const { imgSrc, title } = this.state;
    return (
      <div className="dropZone">
        <Dropzone
          onDrop={this.handleOnDrop}
          multiple={true}
          maxSize={imageMaxSize}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div className="dropInput" {...getRootProps()} onClick={noClick}>
                <input {...getInputProps()} />
              </div>
            </section>
          )}
        </Dropzone>

        <div className="displayFile">
          {imgSrc !== null ? (
            <div>
              <img src={imgSrc} alt="uploadedFile" /> <p>{title}</p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default UploadDrop;
