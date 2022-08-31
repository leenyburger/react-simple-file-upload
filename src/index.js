import React, { useRef, useEffect, createContext, useContext } from 'react'
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
    // Handle errors (Need iframe to emit an uploadResult of error)
    if (e.data.uploadResult === 'success') {
      if (e.data.widgetId !== widgetId.current) {
        debug('Ignoring because widgetId does not match')
        return
      }
      if (e.data.widgetId === widgetId.current) {
        debug('Success: %O', e.data)
        onSuccess(e.data.url)
      }
    }

    if (e.data.event === 'dropStarted') {
      if (e.data.widgetId !== widgetId.current) {
        debug('Ignoring because widgetId does not match')
        return
      }
      if (e.data.widgetId === widgetId.current) {
        debug('Success: %O', e.data)
        if(typeof onDrop === 'function') { onDrop(e.data.url); }
      }
    }
  }
  return (
    <iframe
      title={`Simple File Upload ${widgetId.current}`}
      src={`https://app.simplefileupload.com/buckets/${key}?widgetId=${widgetId.current}&preview=${preview}&text=${text}&small=${small}&resizeWidth=${resizeWidth}&resizeHeight=${resizeHeight}&resizeMethod=${resizeMethod}&tag=${tag}&accepted=${accepted}&maxFileSize=${maxFileSize}&multiple=${multiple}&maxFiles=${maxFiles}&removeLinks=${removeLinks}`}
      className='widgetFrame'
      width={width}
      height={height}
      style={{
        border: 0
      }}
    />
  )
}


export default SimpleFileUpload
