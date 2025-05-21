import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpotifyApiService {

    /**
     * Queues a song to the Spotify playback queue.
     * @param uri 
     * @returns void
     */
    queueSong(uri: string): Promise<void> {
        const url = "http://localhost:3000/api/queue";
        const accessToken = localStorage.getItem('access_token');
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uri, accessToken })
        })
        .then(response => {
            if (response.ok) {
                return;
            } else {
                return response.json().then(err => { throw new Error(err.error || 'Failed to queue song'); });
            }
        });
    }
}