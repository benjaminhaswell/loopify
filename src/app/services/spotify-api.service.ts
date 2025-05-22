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

    /**
     * Plays the next song in the Spotify playback queue.
     * @returns void
     */
    playNext(): Promise<void> {
        const url = "http://localhost:3000/api/next";
        const accessToken = localStorage.getItem('access_token');
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ accessToken })
        })
        .then(response => {
            if (response.ok) {
                return;
            } else {
                return response.json().then(err => { throw new Error(err.error || 'Failed to queue song'); });
            }
        });
    }

    /**
     * Plays the next song in the Spotify playback queue.
     * @returns void
     */
    seekTo(position: number): Promise<void> {
        const url = "http://localhost:3000/api/seek";
        const accessToken = localStorage.getItem('access_token');
        return fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ position, accessToken })
        })
        .then(response => {
            if (response.ok) {
                return;
            } else {
                return response.json().then(err => { throw new Error(err.error || 'Failed to seek'); });
            }
        });
    }
}