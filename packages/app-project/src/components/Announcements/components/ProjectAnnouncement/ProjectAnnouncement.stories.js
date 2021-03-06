import { withKnobs, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import zooTheme from '@zooniverse/grommet-theme'
import { Grommet } from 'grommet'
import React from 'react'

import { ProjectAnnouncementContainer } from './ProjectAnnouncementContainer'
import readme from './README.md'

const ANNOUNCEMENT = 'Neque magnis massa cum elementum dignissim nibh congue facilisis suscipit dictumst, porta hac porttitor praesent purus velit nullam nascetur eu ultricies libero, ipsum viverra molestie orci mollis faucibus habitant a placerat.'

storiesOf('Project App / Screens / Project Home / Announcements / ProjectAnnouncement', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Grommet theme={zooTheme}>
      <ProjectAnnouncementContainer
        announcement={text('Announcement', ANNOUNCEMENT)}
        color='neutral-4'
        dismissBanner={() => {}}
        isVisible
      />
    </Grommet>
  ), {
    notes: {
      markdown: readme
    }
  })
