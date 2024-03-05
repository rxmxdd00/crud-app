import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  ngOnInit(): void {
    document.addEventListener('DOMContentLoaded', this.initApp);
  }

 
  initApp () {
    const hamburgerBtn = document.getElementById('hamburger-button');
    const mobileMenu = document.getElementById('mobile-menu');

    const toggleMenu = () => {
      mobileMenu?.classList.toggle('hidden')
      mobileMenu?.classList.toggle('flex')
      hamburgerBtn?.classList.toggle('toggle-btn')
    }

    hamburgerBtn?.addEventListener('click', toggleMenu);
    mobileMenu?.addEventListener('click', toggleMenu)
  }
}