import React from 'react';

class SfuButton extends React.Component {
  // const openIframe = () => {
  //   alert('clicked')
    
  // }

  render() {
    // TODO let them send in a class and text 
    return (
      <button onClick={this.openIframe}> Upload Files</button>
    ) 
  }
}

export default SfuButton; 