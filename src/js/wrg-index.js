import { html, css, LitElement } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import initConfig from './config.js';
import { micromark } from "micromark";

/**
 * List archives
 */
customElements.define(
  'wrg-index',
  class extends LitElement {
    static properties = {
      _archives: {
        type: Object
      }  
    };

    static styles = css`
      ul {
        border: var(--sl-panel-border-width) solid var(--sl-panel-border-color);
        border-radius: var(--sl-border-radius-medium);
        margin: 0;
        padding: 0;
        list-style: none;
      }

      li:not(:first-child) {
        border-top: var(--sl-panel-border-width) solid
          var(--sl-panel-border-color);
      }

      a {
        display: block;
        padding: var(--sl-spacing-small);
        line-height: 1;
        color: var(--sl-color-neutral-700);
        text-decoration: none;
      }

      a:hover {
        background-color: var(--sl-color-neutral-50);
      }

      .archive {
        display: flex;
        justify-content: space-between;
        white-space: nowrap;
        flex-direction: column;
      }

      .name {
        flex: 1;
        font-size: 24px;
      }

      .desc {
        margin-top: 10px;
      }
    `;

    async firstUpdated() {
      const config = await initConfig();
      this._archives = config.archives;
    }

    render() {
      if (!this._archives) {
        return '';
      }

      return html`
        <div id="tabs" style="padding-bottom: 1rem;">
            <button onClick="clickTab('all')">All</button>
            <button onClick="clickTab('store')">Store</button>
            <button onClick="clickTab('community')">Community</button>
            <button onClick="clickTab('misc')">Misc</button>
        </div>
        <ul>
          ${this._archives.map(
            (page) => html`
              <li class="${page.tag} archive-list-item">
                <a
                  href="./archive/?source=${encodeURIComponent(page.url)}${(page.deepLinkQuery == '' ?"":"#query=".concat(page.deepLinkQuery))}${(page.deepLink == '' ? "":"#url=".concat(encodeURIComponent(page.deepLink))).concat(page.deepLinkAddition == null ?"":page.deepLinkAddition)}"
                  title=${page.description}
                >
                  <div class="archive">
                    <div class="name">${page.name}</div>
                    <div class="desc">
                    ${staticHtml`${unsafeStatic(micromark(page.description))}`}
                    </div>
                  </div>
                </a>
                <a href="https://${page.downloadLink}">
                    <p>Download archive ${page.downloadSize}</p> 
                </a>
              </li>
            `
          )}
        </ul>
      `;
    }
  }
);
