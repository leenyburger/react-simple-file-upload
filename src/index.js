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

const SimpleFileUpload = ({ apiKey, onSuccess, onDrop, width, height, preview, text, resizeWidth, resizeHeight, resizeMethod, tag, accepted, maxFileSize, multiple, maxFiles, removeLinks, buttonText, buttonClass }) => {
  const sfu = useSimpleFileUpload()
  const key = sfu.apiKey || apiKey
  width = width || sfu.width
  height = height || sfu.height
  text = text || "Drop file to upload"
  resizeMethod = resizeMethod || "contain"
  buttonText = buttonText || "Upload Files"
  maxFiles = maxFiles || 10

  let small = "false"

  if (parseInt(width) < 120) {
    small = "true"
  }

  const [isMultipleUploader, setMultipleUploader] = useState(multiple)
  const [isModalVisible, setModalVisible] = useState(false)
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

    if (e.data.event == 'fileUploadSuccess') {
      if(typeof onSuccess === 'function') {
        // Single uploader - return URL only for backwards compatibility
        if (!isMultipleUploader && e.data.files.length == 1) {
          onSuccess(e.data.url)
        } else {
          onSuccess(e.data.files)
        }
      }

      console.log("The uploaded files are listed as an Array of File Objects below")
      console.dir(e.data.files)

      // Only call close iframe if the Add Files button was clicked. Explicitly sent via the "close" parameter 
      // File count has to be recalculated, hence the null value
      if(e.data.close === true) {
        setModalVisible(false)
        setNumberOfFiles(e.data.files.length)
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

  let modalStyle;

  // Multiple Uploader has a different set of styles than Single Uploader
  if (isMultipleUploader) {
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
  // Single Uploader
  } else {
    display: 'block'
  }

  return (
    <>
      {multiple && (
        <button onClick={handleOpenClick} className = {buttonClass}>
          {numberOfFiles > 0 ? `${numberOfFiles} uploaded` : buttonText}
        </button>
      )}

      <iframe
        title={`Simple File Upload ${widgetId.current}`}
        src={`https://app.simplefileupload.com/buckets/${key}?widgetId=${widgetId.current}&preview=${preview}&text=${text}&small=${small}&resizeWidth=${resizeWidth}&resizeHeight=${resizeHeight}&resizeMethod=${resizeMethod}&tag=${tag}&accepted=${accepted}&maxFileSize=${maxFileSize}&multiple=${multiple}&maxFiles=${maxFiles}&removeLinks=${removeLinks}`}
        className='widgetFrame'
        width={isMultipleUploader ? '100%' : width}
        height={isMultipleUploader ? '100%' : height}
        style={modalStyle}
        frameBorder="no"
      />
    </>
  );
}


export default SimpleFileUpload
