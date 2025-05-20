import { Component, inject, OnInit } from '@angular/core';
import { TrackComponent } from "./components/track.component";
import { PkceAuthorizationService } from './services/pkce-authorization.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TrackComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  authService = inject(PkceAuthorizationService);

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      this.authService.getToken(code).then(() => {
        console.log('Access token retrieved successfully.');
      }).catch((error) => {
        console.error('Error retrieving access token:', error);
      });
    }
  }

  loginWithSpotify(): void {
    this.authService.authenticate();
  }
}
