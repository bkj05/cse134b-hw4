// Required exception: log only; do not modify the DOM.
class HelloWorld extends HTMLElement {
  connectedCallback() { console.log("Hello World!"); }
}
customElements.define("hello-world", HelloWorld);
