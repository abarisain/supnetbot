class RichMessageField {
  constructor(/** @type {string} */ title, /** @type {string} */ value) {
    this.title = name;
    this.value = value;
  }
}

class RichMessage {
  constructor(/** @type {string} */ basicText) {
    /** @type {string|null} */
    this.title = null;
    /**
     * Markdown formatted rich text
     * @type {string|null}
     */
    this.richText = null;
    /** @type {string|null} */
    this.footer = null;
    /** @type {string|null} */
    this.color = null;
    /** @type {boolean} */
    this.preventLinkEmbed = false;
    /**
     * Fallback for outputs not supporting rich formatting
     * @type {string}
     */
    this.basicText = basicText;
  }
}

module.exports = { RichMessage, RichMessageField };
