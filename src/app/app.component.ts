import { Component, inject, OnInit } from '@angular/core';
import { TrackComponent } from "./components/track.component";
import { PkceAuthorizationService } from './services/pkce-authorization.service';
import { tracks } from './tracks';
import { FormsModule } from '@angular/forms';
import { SpotifyApiService } from './services/spotify-api.service';
import { delay } from './services/helper-methods';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TrackComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  authService = inject(PkceAuthorizationService);
  spotifyApiService = inject(SpotifyApiService);

  /**
   * Whether or not an access token has been retrieved.
   */
  authenticated: boolean = false;

  /**
   * List of hardcoded tracks.
   */
  tracks = tracks;

  /**
   * Variables for the playground.
   */
  playgroundStartPos: any;
  playgroundEndPos: any;
  looping: boolean = false;

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

  async testPlaygroundStart() {
    await this.spotifyApiService.seekTo(this.playgroundStartPos).then(() => {
      console.log('Position set successfully');
    }).catch((error) => {
      console.error('Error seeking to startPos:', error);
    });
  }

  async testLoop() {

    this.looping = true;

    while (this.looping) {

      await this.spotifyApiService.seekTo(this.playgroundStartPos).then(() => {
        console.log('Position set successfully');
      }).catch((error) => {
        console.error('Error seeking to startPos:', error);
      });

      await delay(this.playgroundEndPos - this.playgroundStartPos);

    }


  }

  async endLoop() {
    this.looping = false;
  }
}
