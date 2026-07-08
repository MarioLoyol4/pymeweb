import React from 'react';
import { Logo } from './Logo';
import '../styles/components/Footer.css';

export default function SharedFooter() {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <Logo width="40px" height="40px" className="logo-img" />
        <span>PymeWeb</span>
      </div>
      <p className="footer-copyright">Derechos reservados @ 2026 PymeWeb</p>
    </footer>
  );
}