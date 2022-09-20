import React, { useRef, useEffect, createContext, useContext, useState, Fragment } from 'react'
import shortid from 'shortid'
import makeDebug from 'debug'

export const SimpleFileUploadContext = createContext({
  apiKey: '',
  width: 160,
  height: 160
})

export const useSimpleFileUpload = () => useContext(SimpleFileUploadContext)

export const SimpleFileUploadProvider = ({
  apiKey,
  width,
  height,
  children
}) => {
  const value = {
    apiKey,
    width: +width,
    height: +height
  }

  return (
    <SimpleFileUploadContext.Provider value={value}>
      {children}
    </SimpleFileUploadContext.Provider>
  )
}

// Add a localStorage entry with the key `debug` and value `SimpleFileUpload` to see debug messages
const debug = makeDebug('SimpleFileUpload')

const SimpleFileUpload = ({ apiKey, onSuccess, onDrop, width, height, preview, text, resizeWidth, resizeHeight, resizeMethod, tag, accepted, maxFileSize, multiple, maxFiles, removeLinks, buttonText }) => {
  const sfu = useSimpleFileUpload()
  const key = sfu.apiKey || apiKey
  width = width || sfu.width
  height = height || sfu.height
  text = text || "Drop file to upload"
  resizeMethod = resizeMethod || "contain"
  buttonText = buttonText || "Upload Files"

  let small = "false"

  if (parseInt(width) < 120) {
    small = "true"
  }

  const [isModalVisible, setModalVisible] = useState(!multiple)
  const [numberOfFiles, setNumberOfFiles] = useState(0)
  const widgetId = useRef(shortid.generate())

  useEffect(() => {
    window.addEventListener('message', handleIframeMessage, false)
    return () => {
      window.removeEventListener('message', handleIframeMessage)
    }
  })
  const handleIframeMessage = (e) => {
    if (e.origin !== 'https://app.simplefileupload.com') {
      return
    }

    if (e.data.widgetId !== widgetId.current) {
      debug('Ignoring because widgetId does not match')
      return
    }

    // Handle errors (Need iframe to emit an uploadResult of error)
    if (e.data.uploadResult === 'success') {
      if(typeof onSuccess === 'function') {
        onSuccess(e.data.url)
      }
    }

    if (e.data.event === 'closeWidget') {
      // Only called when the X is clicked. Not called on "Add" button
      setNumberOfFiles(e.data.numberOfFiles || 0)
      setModalVisible(false)
    }

    if (e.data.event === 'dropStarted') {
      if(typeof onDrop === 'function') {
        onDrop(e.data.url);
      }
    }
  }

  const handleOpenClick = () => {
    setModalVisible(true)
  }

  // If multiple: true, the iframe will try to render "full size" using a different html layout. 
  // To make this happen in pure js I have to do the following: 
  // 1. If multiple == true (ln 147)
  //    - Create the iframe with specific CSS to be full screen (CSS ln 76). Keep it hidden
  //    - Create a button and give it a unique ID 
  //    - Add a event listener to the button that opens the widget 
  //    - The widget.open call open the iframe which loaded in the background 
  //    - Listen for emitCloseWidget event 
  //    - Close the iframe (just add class hidden)
  //    - Get the initial "Add Files" button and hide it 
  //    - Create or hook into "existing" file list button with an event listener to reshow iframe ajnd show on page 

  let modalStyle;
  if(isModalVisible) {
    modalStyle = {
      border: 'none',
      display: 'block',
      background: 'transparent',
      position: 'fixed',
      zIndex: 1000000,
      top: 0,
      left: 0
    }
  } else {
    modalStyle = {
      border: 0,
      display: 'none'
    }
  }

  return (
    <>
      {multiple && (
        <button onClick={handleOpenClick}>
          {numberOfFiles > 0 ? `${numberOfFiles} uploaded` : 'Add Files'}
        </button>
      )}

      {isModalVisible && <iframe
          title={`Simple File Upload ${widgetId.current}`}
          src={`https://app.simplefileupload.com/buckets/${key}?widgetId=${widgetId.current}&preview=${preview}&text=${text}&small=${small}&resizeWidth=${resizeWidth}&resizeHeight=${resizeHeight}&resizeMethod=${resizeMethod}&tag=${tag}&accepted=${accepted}&maxFileSize=${maxFileSize}&multiple=${multiple}&maxFiles=${maxFiles}&removeLinks=${removeLinks}`}
          className='widgetFrame'
          width={isModalVisible ? '100%' : width}
          height={isModalVisible ? '100%' : height}
          style={modalStyle}
          frameBorder="no"
        />}
    </>
  );
}


export default SimpleFileUpload
