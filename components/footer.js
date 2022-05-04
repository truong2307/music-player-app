class Footer extends HTMLElement {
    constructor() {
        super();
} 

connectedCallback() {
    this.innerHTML = `
        <div class="footer">
        <div class="footer-list-items" >
            <div class="footer-item">
                <i class="fas fa-home"></i>
            </div>
            <div class="footer-item">
                <i class="fas fa-headphones"></i>
            </div>
            <div class="footer-item active">
                <i class="fas fa-play"></i>
            </div>
            <div class="footer-item">
                <i class="fas fa-search"></i>
            </div>
            <div class="footer-item">
                <i class="fas fa-bars"></i>
            </div>
        </div>
    </div>
    `;
  }
}

customElements.define('footer-component', Footer);