import { Component, inject, OnInit } from '@angular/core';
import { TrackComponent } from "./components/track.component";
import { PkceAuthorizationService } from './services/pkce-authorization.service';
import { tracks } from './tracks';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TrackComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  authService = inject(PkceAuthorizationService);

  /**
   * Whether or not an access token has been retrieved.
   */
  authenticated: boolean = false;

  /**
   * List of hardcoded tracks.
   */
  tracks = tracks;

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      this.authService.getToken(code).then(() => {
        console.log('Access token retrieved successfully.');
        this.authenticated = true;
      }).catch((error) => {
        console.error('Error retrieving access token:', error);
      });
    }
  }

  /**
   * Initiates the Spotify authentication process.
   */
  loginWithSpotify(): void {
    this.authService.authenticate();
  }
}
