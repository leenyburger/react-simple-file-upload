# react-simple-file-upload

> This is the React Component for simple file upload. 
> Check it out (and sign up for a free trial) at [Simple File Upload](https://www.simplefileupload.com/).

[![NPM](https://img.shields.io/npm/v/react-simple-file-upload.svg)](https://www.npmjs.com/package/react-simple-file-upload) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Tutorial Blog Post
https://www.simplefileupload.com/blog/easy-react-file-upload

## Sample Repo
https://github.com/leenyburger/simple-file-upload-react-demo

## Install

```bash
npm install --save react-simple-file-upload
```

## Usage

```jsx
import SimpleFileUpload from 'react-simple-file-upload';

function App() {
  function handleUpload(url) {
    // url of cdn backed file returned
    console.log(url)
  }

  function handleMultipleUpload(files) {
    // Array of file objects returned
  }


  return (
    // Example of single uploader
    <div className="App">
      <main>
        <div className="upload-wrapper">
          <SimpleFileUpload
            apiKey=yourAPIKEY
            onSuccess={handleUpload}
            onDrop={handleOnDrop}
          />
        </div>
      </main>
      
      // Example of multi uploader
      <main>
        <div className="upload-wrapper">
          <SimpleFileUpload
            apiKey="e8557605f1b5ac9b18c913603d29a8c8"
            onSuccess={handleMultipleUpload}
            onDrop={handleOnDrop}
            preview={false}
            multiple={true}
            maxFiles= {5}
            removeLinks={true}
            buttonClass="upload-button"
            buttonText="Upload Images"
          />
        </div>
      </main>
    </div>
  );
}

export default App;

```

## Props Accepted
{ onSuccess, onDrop, width, height, preview, text, resizeWidth, resizeHeight, resizeMethod, tag, accepted, maxFileSize, multiple, maxFiles, removeLinks, buttonText, buttonClass }

## License

MIT © [Simple File Upload](https://www.simplefileupload.com)
