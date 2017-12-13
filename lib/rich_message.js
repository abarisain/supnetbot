class RichMessageField {
  constructor(
    /** @type {string} */ title,
    /** @type {string} */ value,
    /** @type {boolean} */ inline
  ) {
    this.title = name;
    this.value = value;
    this.inline = inline;
  }
}

class RichMessage {
  constructor(/** @type {string} */ basicText) {
    /**
     * Markdown formatted rich content
     * @type {string|null}
     */
    this.content = null;
    /**
     * Embed title
     * @type {string|null}
     */
    this.title = null;
    /**
     * Embed description
     * @type {string|null}
     */
    this.description = null;
    /** @type {string|null} */
    this.footer = null;
    /** @type {string|null} */
    this.color = null;
    /** @type {boolean} */
    this.preventLinkEmbed = false;
    /** @type {[RichMessageField]} */
    this.fields = null;

    /**
     * Fallback for outputs not supporting rich formatting
     * @type {string}
     */
    this.basicText = basicText;
  }
}

module.exports = { RichMessage, RichMessageField };
