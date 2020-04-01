/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.0-beta2): offcanvas.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { getjQuery, getSelectorFromElement, getTransitionDurationFromElement } from './util/index'
import Data from './dom/data'
import EventHandler from './dom/event-handler'
import SelectorEngine from './dom/selector-engine'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'offcanvas'
const VERSION = '5.0.0-alpha1'
const DATA_KEY = 'bs.offcanvas'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const ESCAPE_KEY = 'Escape'
const DATA_BODY_ACTIONS = 'data-body'

const SELECTOR_DATA_DISMISS = '[data-dismiss="offcanvas"]'
const SELECTOR_DATA_TOGGLE = '[data-toggle="offcanvas"]'

const EVENT_SHOW = `show${EVENT_KEY}`
const EVENT_SHOWN = `shown${EVENT_KEY}`
const EVENT_HIDE = `hide${EVENT_KEY}`
const EVENT_HIDDEN = `hidden${EVENT_KEY}`
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`
const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`

const CLASS_NAME_BACKDROP_BODY = 'offcanvas-backdrop'
const CLASS_NAME_DISABLED = 'disabled'
const CLASS_NAME_OPEN = 'offcanvas-open'
const CLASS_NAME_TOGGLING = 'offcanvas-toggling'
const CLASS_NAME_SHOW = 'show'
const CLASS_NAME_STOP_OVERFLOW = 'offcanvas-freeze'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class OffCanvas {
  constructor(element) {
    this._element = element
    this._isShown = element.classList.contains(CLASS_NAME_SHOW)
    this._bodyOptions = element.getAttribute(DATA_BODY_ACTIONS)

    this._handleClosing()
    Data.setData(element, DATA_KEY, this)
  }

  // Getters

  static get VERSION() {
    return VERSION
  }

  // Public

  toggle(relatedTarget) {
    return this._isShown ? this.hide(relatedTarget) : this.show(relatedTarget)
  }

  show(relatedTarget) {
    if (this._isShown) {
      return
    }

    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW, { relatedTarget })

    if (showEvent.defaultPrevented) {
      return
    }

    this._isShown = true
    document.body.classList.add(CLASS_NAME_TOGGLING)

    if (this._bodyOptions === 'backdrop') {
      document.body.classList.add(CLASS_NAME_BACKDROP_BODY)
    }

    if (this._bodyOptions !== 'scroll') {
      document.body.classList.add(CLASS_NAME_STOP_OVERFLOW)
    }

    this._element.removeAttribute('aria-hidden')
    this._element.classList.add(CLASS_NAME_SHOW)

    setTimeout(() => {
      this._element.setAttribute('aria-expanded', true)
      this._element.setAttribute('aria-offcanvas', true)

      document.body.classList.add(CLASS_NAME_OPEN)
      document.body.classList.remove(CLASS_NAME_TOGGLING)
      this._enforceFocus()
      EventHandler.trigger(this._element, EVENT_SHOWN, { relatedTarget })
    }, getTransitionDurationFromElement(this._element))
  }

  hide(relatedTarget) {
    if (!this._isShown) {
      return
    }

    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE, { relatedTarget })

    if (hideEvent.defaultPrevented) {
      return
    }

    this._isShown = false

    if (!document.body.classList.contains(CLASS_NAME_TOGGLING)) {
      document.body.classList.remove(CLASS_NAME_OPEN)
    }

    if (this._bodyOptions === 'backdrop') {
      document.body.classList.remove(CLASS_NAME_BACKDROP_BODY)
    }

    if (this._bodyOptions !== 'scroll') {
      document.body.classList.remove(CLASS_NAME_STOP_OVERFLOW)
    }

    document.body.classList.add(CLASS_NAME_TOGGLING)
    this._element.classList.remove(CLASS_NAME_SHOW)
    this._element.blur()

    setTimeout(() => {
      document.body.classList.remove(CLASS_NAME_TOGGLING)
      this._element.setAttribute('aria-hidden', true)
      this._element.setAttribute('aria-expanded', false)
      this._element.removeAttribute('aria-offcanvas')

      EventHandler.trigger(this._element, EVENT_HIDDEN, { relatedTarget })
    }, getTransitionDurationFromElement(this._element))
  }

  // Private
  _enforceFocus() {
    this._element.setAttribute('tabindex', '0')
    this._element.focus()
    this._element.setAttribute('tabindex', 1)
  }

  _handleClosing() {
    EventHandler.on(this._element, EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, event => this.hide(event))

    EventHandler.on(document, 'keydown', event => {
      if (event.key === ESCAPE_KEY) {
        this.hide(event.target)
      }
    })

    EventHandler.on(document, EVENT_CLICK_DATA_API, event => {
      const target = SelectorEngine.findOne(getSelectorFromElement(event.target))
      if (!this._element.contains(event.target) && target !== this._element) {
        this.hide(event.target)
      }
    })
  }

  // Static

  static jQueryInterface(config) {
    return this.each(function () {
      const data = Data.getData(this, DATA_KEY) || new OffCanvas(this)

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`)
        }

        data[config](this)
      }
    })
  }

  static getInstance(element) {
    return Data.getData(element, DATA_KEY)
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  if (['A', 'AREA'].indexOf(this.tagName) > -1) {
    event.preventDefault()
  }

  if (this.disabled || this.classList.contains(CLASS_NAME_DISABLED)) {
    return
  }

  const target = SelectorEngine.findOne(getSelectorFromElement(this))
  const data = Data.getData(target, DATA_KEY) || new OffCanvas(target)

  data.toggle(this)
})

const $ = getjQuery()

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
 */
/* istanbul ignore if */
if ($) {
  const JQUERY_NO_CONFLICT = $.fn[NAME]
  $.fn[NAME] = OffCanvas.jQueryInterface
  $.fn[NAME].Constructor = OffCanvas
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return OffCanvas.jQueryInterface
  }
}

export default OffCanvas