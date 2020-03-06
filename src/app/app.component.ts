import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServerService } from './services/server.service';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  formulario: FormGroup;
  showGif = false;
  showSuccess = false;
  showFail = false;
  clickSend = true;
  contactName = '';

  constructor(
    private fb: FormBuilder,
    private server: ServerService
    ){}

  ngOnInit() {
    this.formulario = this.fb.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      message: [null, Validators.required]
    });
  }

  send(){
    this.clickSend = false;
    this.showGif = true;
    this.server.postServer('email', this.formulario.value).subscribe(res => {
      this.contactName = res.message;
      //this.formulario.reset();
      this.showGif = false;
      this.showSuccess = true;
      this.clickSend = true;
    },
    (err: HttpErrorResponse) => { // STATUS 0 SERVER FORA, 500 RETORNO ERRO
      console.log(err.error);
      console.log(err);
      this.showGif = false;
      this.showFail = true;
      this.clickSend = true;
    },
    () => {
      this.showGif = false;
      this.clickSend = true;
    });
  }
  validOrTouched(field): boolean{
    return !this.formulario.get(field).valid && this.formulario.get(field).touched;
  }
  validForm():boolean {
    return this.formulario.valid && this.clickSend;
  }

}

// :::::::::::::::::::::::: JAVASCRIPT JQUERY
$(function(){
  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 57)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });
    // Closes responsive menu when a scroll trigger link is clicked
    $('.js-scroll-trigger').click(function() {
      $('.navbar-collapse').collapse('hide');
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $('body').scrollspy({
      target: '#mainNav',
      offset: 57
    });

    // Collapse Navbar
    var navbarCollapse = function() {
      if ($("#mainNav").offset().top > 100) {
        $("#mainNav").addClass("navbar-shrink");
      } else {
        $("#mainNav").removeClass("navbar-shrink");
      }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);
});
