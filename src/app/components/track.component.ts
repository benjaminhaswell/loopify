import { HttpClient } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { SpotifyApiService } from '../services/spotify-api.service';
import { delay } from '../services/helper-methods';

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [],
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent {
    name = input<string>("");
    artist = input<string>("");
    uri = input<string>("");
    startPos = input<number>(0);
    endPos = input<number>(0);

    playing: boolean = false;

    constructor(private http: HttpClient) {}

    spotifyApiService = inject(SpotifyApiService);

    async playLoop(uri: string) {

      // If its not playing, set playing to true, otherwise return
      if (!this.playing) {
        this.playing = true;
      } else {
        return;
      }

      // Queue song
      await this.spotifyApiService.queueSong(uri).then(() => {
        console.log('Song queued successfully');
      }).catch((error) => {
        console.error('Error queuing song:', error);
      });

      // Play the song
      await this.spotifyApiService.playNext().then(() => {
        console.log('Next song played');
      }).catch((error) => {
        console.error('Error playing next song:', error);
      });

      while (this.playing) {

        // Wait until endPos reached
        await delay(this.endPos());

        // Return to startPos
        await this.spotifyApiService.seekTo(this.startPos()).then(() => {
          console.log('Position set successfully');
        }).catch((error) => {
          console.error('Error seeking to startPos:', error);
        });
      }
    }
}
