import React, { useState } from 'react'
import './index.css'

import SimpleFileUpload, {
  SimpleFileUploadProvider
} from 'react-simple-file-upload'

const API_KEY = '...'

export default function App() {
  const [file, setFile] = useState()
  const [file2, setFile2] = useState()
  const [file3, setFile3] = useState()
  return (
    <div className='App'>
      <h1>Simple File Upload Demo</h1>
      <h2>Basic Example</h2>
      <SimpleFileUpload apiKey={API_KEY} onSuccess={setFile} />
      {file && <p> Uploaded: {file}</p>}
      <h2>Provider Example</h2>
      <p>
        Let's you define common settings once (just API Key for now) and have
        these settings used in all SimpleFileUpload components
      </p>
      <SimpleFileUploadProvider apiKey={API_KEY} width='300' height='300'>
        <SimpleFileUpload onSuccess={setFile2} />
        {file2 && <p> Uploaded: {file2}</p>}
        <p>Settings passed into the component take precedence</p>
        <SimpleFileUpload onSuccess={setFile3} width='150' height='150' />
        {file3 && <p> Uploaded: {file3}</p>}
      </SimpleFileUploadProvider>
    </div>
  )
}
