import { HttpClient } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { SpotifyApiService } from '../services/spotify-api.service';

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
    position = input<number>(0);

    constructor(private http: HttpClient) {}

    spotifyApiService = inject(SpotifyApiService);

    playLoop(uri: string) {
      this.spotifyApiService.queueSong(uri).then(() => {
        console.log('Song queued successfully');
      }).catch((error) => {
        console.error('Error queuing song:', error);
      });
    }
}
