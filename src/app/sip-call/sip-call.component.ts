import { Component, OnInit } from '@angular/core';
import { CredentialService } from '../services/credential.service';

declare var SIPml: any;

let sipStack;
let callSession;

@Component({
  selector: 'app-sip-call',
  template: '<button id="btnSip" type="button" (click)="callSip()" [disabled]="btnCallDisabled"  class="btn btn-primary" > {{btnCall}} </button>',
  styleUrls: ['./sip-call.component.css']
})
export class SipCallComponent implements OnInit {

  btnCall = 'Iniciando';
  btnCallDisabled = true;
  oncall = false;
  btn: HTMLButtonElement;

  eventsListener = (e) => {
    switch (e.type) {
      case 'started':
        this.btnCall = 'Ligue';
        this.btnCallDisabled = false;
        this.btn.setAttribute('class', 'btn btn-primary');
        break;
      case 'm_permission_accepted':
        this.btnCallDisabled = true;
        this.btnCall = 'Chamando';
        break;
      case 'terminating':
        this.btnCallDisabled = true;
        this.btnCall = 'Desligando';
        break;
      case 'terminated':
        this.btnCallDisabled = false;
        this.btnCall = 'Ligue';
        break;
      case 'connected':
        this.btnCallDisabled = false;
        this.oncall = true;
        this.btn.setAttribute('class', 'btn btn-danger');
        this.btnCall = 'Desligar';
        break;
      case 'i_new_message':
        console.log('::::::::::::::::: EVENTO NOVA MENSAGEM: ' + e.type);
        break;
      case 'i_new_call':
        console.log('::::::::::::::::: EVENTO LIGACAO DE ENTRADA: ' + e.type);
        break;
      default:
        console.log('::::::::::::::::::::: EVENTO ACONTECEU = ' + e.type);
        break;
    }
  }

  constructor(
    private credentials: CredentialService
  ) { }

  ngOnInit() {
    this.createSipStack();
    sipStack.start();
    console.log(sipStack)
    this.btn = document.querySelector('#btnSip');
  }

  createSipStack(){
    sipStack = new SIPml.Stack({
        realm: this.credentials.domain,
        impi: this.credentials.user,
        impu: 'sip:' + this.credentials.user + '@' + this.credentials.domain,
        password: this.credentials.password,
        display_name: 'Site JPBX', // optional
        websocket_proxy_url: 'wss://' + this.credentials.domain + ':8089/ws',
        ice_servers: [{url: 'stun:stun.l.google.com:19302' }],
        enable_rtcweb_breaker: false, // optional
        events_listener: { events: '*', listener: this.eventsListener }, // optional: '*' means all events
        sip_headers: [ // optional
          { name: 'User-Agent', value: 'WEBPHONE JPBX' },
          { name: 'Organization', value: 'JPBX PBX' }
        ]
      }
    );
  }

  callSip(){
    if (this.oncall) {
      callSession.hangup();
      this.oncall = false;
      return;
    }

    this.btnCallDisabled = true;
    this.btn.setAttribute('class', 'btn btn-warning');
    this.btnCall = 'Conectando';
    callSession = sipStack.newSession('call-audio', {
        video_local: document.getElementById('video-local'),
        video_remote: document.getElementById('video-remote'),
        audio_remote: document.getElementById('audio-remote'),
        events_listener: { events: '*', listener: this.eventsListener } // optional: '*' means all events
    });
    callSession.call('123456');
  }

}
