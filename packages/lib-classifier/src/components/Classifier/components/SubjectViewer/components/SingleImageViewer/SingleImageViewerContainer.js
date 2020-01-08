import asyncStates from '@zooniverse/async-states'
import { inject, observer } from 'mobx-react'
import React from 'react'
import PropTypes from 'prop-types'

import SVGContext from '@plugins/drawingTools/shared/SVGContext'
import SingleImageViewer from './SingleImageViewer'
import locationValidator from '../../helpers/locationValidator'

function storeMapper (stores) {
  const {
    enableRotation,
    rotation
  } = stores.classifierStore.subjectViewer

  return {
    enableRotation,
    rotation
  }
}

@inject(storeMapper)
@observer
class SingleImageViewerContainer extends React.Component {
  constructor () {
    super()
    this.imageViewer = React.createRef()
    this.subjectImage = React.createRef()
    this.state = {
      img: {}
    }
  }

  componentDidMount () {
    this.props.enableRotation()
    this.onLoad()
  }

  fetchImage (url) {
    const { ImageObject } = this.props
    return new Promise((resolve, reject) => {
      const img = new ImageObject()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
      return img
    })
  }

  async preload () {
    const { subject } = this.props
    if (subject && subject.locations) {
      // TODO: Add polyfill for Object.values for IE
      const imageUrl = Object.values(subject.locations[0])[0]
      const img = await this.fetchImage(imageUrl)
      this.setState({ img })
      return img
    }
    return {}
  }

  async getImageSize () {
    const img = await this.preload()
    const svg = this.imageViewer.current || {}
    return {
      clientHeight: svg.clientHeight,
      clientWidth: svg.clientWidth,
      naturalHeight: img.naturalHeight,
      naturalWidth: img.naturalWidth
    }
  }

  async onLoad () {
    const { onError, onReady } = this.props
    try {
      const { clientHeight, clientWidth, naturalHeight, naturalWidth } = await this.getImageSize()
      const target = { clientHeight, clientWidth, naturalHeight, naturalWidth }
      onReady({ target })
    } catch (error) {
      console.error(error)
      onError(error)
    }
  }

  render () {
    const { loadingState, onError, rotation, subject } = this.props
    const { img } = this.state
    const { naturalHeight, naturalWidth, src } = img
    const subjectImageElement = this.subjectImage.current
    let scale = 1
    if (subjectImageElement) {
      const { width: clientWidth, height: clientHeight } = subjectImageElement.getBoundingClientRect()
      scale = clientWidth / naturalWidth
    }

    if (loadingState === asyncStates.error) {
      return (
        <div>Something went wrong.</div>
      )
    }

    if (!src) {
      return null
    }

    const svg = this.imageViewer.current
    const getScreenCTM = () => svg.getScreenCTM()
    
    return (
      <SVGContext.Provider value={{ svg, getScreenCTM }}>
        <SingleImageViewer
          ref={this.imageViewer}
          height={naturalHeight}
          rotate={rotation}
          scale={scale}
          width={naturalWidth}
        >
          <image
            ref={this.subjectImage}
            height={naturalHeight}
            width={naturalWidth}
            xlinkHref={src}
          />
        </SingleImageViewer>
      </SVGContext.Provider>
    )
  }
}

SingleImageViewerContainer.wrappedComponent.propTypes = {
  enableRotation: PropTypes.func,
  loadingState: PropTypes.string,
  onError: PropTypes.func,
  onReady: PropTypes.func,
  subject: PropTypes.shape({
    locations: PropTypes.arrayOf(locationValidator)
  })
}

SingleImageViewerContainer.wrappedComponent.defaultProps = {
  enableRotation: () => null,
  ImageObject: window.Image,
  loadingState: asyncStates.initialized,
  onError: () => true,
  onReady: () => true
}

export default SingleImageViewerContainer
