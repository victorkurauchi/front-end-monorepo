import { expect } from 'chai'
import sinon from 'sinon'
import cookie from 'cookie'
import stringHash from '@sindresorhus/string-hash'

import initStore from './initStore'

import UI from './UI'

const PROJECT = {
  configuration: {
    announcement: 'Nunc interdum justo fusce mi'
  },
  id: '2',
  display_name: 'Hello',
  slug: 'test/project'
}

const ANNOUNCEMENT_HASH = stringHash(PROJECT.configuration.announcement)

describe('Stores > UI', function () {
  it('should export an object', function () {
    expect(UI).to.be.an('object')
  })

  describe('mode', function () {
    let store

    beforeEach(function () {
      store = UI.create()
    })

    it('should contain a mode property', function () {
      expect(store.mode).to.be.ok()
    })

    it('should default to the light mode', function () {
      expect(store.mode).to.equal('light')
    })

    it('should have a `setDarkMode` action', function () {
      expect(store.mode).to.equal('light')
      store.setDarkMode()
      expect(store.mode).to.equal('dark')
    })

    it('should have a `setLightMode` action', function () {
      expect(store.mode).to.equal('light')
      store.setDarkMode()
      expect(store.mode).to.equal('dark')
      store.setLightMode()
      expect(store.mode).to.equal('light')
    })

    it('should have a `toggleMode` action', function () {
      expect(store.mode).to.equal('light')
      store.toggleMode()
      expect(store.mode).to.equal('dark')
      store.toggleMode()
      expect(store.mode).to.equal('light')
    })
  })

  describe('when using the mode cookie', function () {
    let setModeCookieSpy
    let store

    beforeEach(function () {
      document.cookie = 'mode=; max-age=-99999999;'
      store = UI.create()
      setModeCookieSpy = sinon.spy(store, 'setModeCookie')
    })

    afterEach(function () {
      setModeCookieSpy.restore()
    })

    it('should not set the cookie on instantiation', function () {
      expect(setModeCookieSpy).to.not.have.been.called()
    })

    it('should default to the stored mode in the cookie', function () {
      store.setDarkMode()
      expect(setModeCookieSpy).to.have.been.calledOnce()
      setModeCookieSpy.resetHistory()
      store = UI.create({
        mode: cookie.parse(document.cookie).mode
      })
      expect(store.mode).to.equal('dark')
      expect(setModeCookieSpy).to.not.have.been.called()
    })

    it('should not update the cookie on instantiation if there is already one', function () {
      document.cookie = 'mode=light; path=/; max-age=31536000'
      store = UI.create()
      expect(setModeCookieSpy).to.not.have.been.called()
    })

    it('should update the cookie if the store mode does not equal the stored cookie mode', function () {
      store.setLightMode()
      expect(setModeCookieSpy).to.not.have.been.called()
      store.setDarkMode()
      expect(setModeCookieSpy).to.have.been.calledOnce()
    })
  })

  describe('dismissedAnnouncementBanner', function () {
    let rootStore
    let store

    beforeEach(function () {
      rootStore = initStore(true, { project: PROJECT })
      store = rootStore.ui
    })

    it('should contain a dismissedAnnouncementBanner property', function () {
      expect(store.dismissedAnnouncementBanner).to.be.undefined()
    })

    it('should have a `dismissAnnouncementBanner` action', function () {
      const expectedValue = stringHash(PROJECT.configuration.announcement)
      expect(store.dismissedAnnouncementBanner).to.equal(undefined)
      store.dismissAnnouncementBanner()
      expect(store.dismissedAnnouncementBanner).to.equal(expectedValue)
    })

    it('should have a showAnnouncement view', function () {
      expect(store.showAnnouncement).to.be.true()
      store.dismissAnnouncementBanner()
      expect(store.showAnnouncement).to.be.false()
    })
  })

  describe('when using the dismissedAnnouncementBanner cookie', function () {
    let rootStore
    let store
    let originalURL
    let setAnnouncementBannerCookieSpy

    before(function () {
      originalURL = document.URL
      dom.reconfigure({
        url: `https://localhost/projects/${PROJECT.slug}`
      })
    })

    after(function () {
      dom.reconfigure({
        url: originalURL
      })
    })

    beforeEach(function () {
      rootStore = initStore(true, { project: PROJECT })
      store = rootStore.ui
      setAnnouncementBannerCookieSpy = sinon.spy(store, 'setAnnouncementBannerCookie')
    })

    afterEach(function () {
      setAnnouncementBannerCookieSpy.restore()
    })

    it('should not set the cookie on instantiation', function () {
      expect(setAnnouncementBannerCookieSpy).to.not.have.been.called()
    })

    it('should not update the cookie if it already matches the store value', function () {
      document.cookie = cookie.serialize('dismissedAnnouncementBanner', ANNOUNCEMENT_HASH, {
        path: `/projects/${PROJECT.slug}`
      })

      store.dismissAnnouncementBanner()
      expect(setAnnouncementBannerCookieSpy).to.not.have.been.called()
    })

    it(`should update the cookie if it doesn't match the store value`, function () {
      document.cookie = cookie.serialize('dismissedAnnouncementBanner', 1234567890, {
        path: `/projects/${PROJECT.slug}`
      })
      store.dismissAnnouncementBanner()
      expect(setAnnouncementBannerCookieSpy).to.have.been.calledOnce()
      const parsedCookie = cookie.parse(document.cookie) || {}
      const cookieHash = parseInt(parsedCookie.dismissedAnnouncementBanner, 10)
      expect(cookieHash).to.equal(ANNOUNCEMENT_HASH)
    })
  })
})
