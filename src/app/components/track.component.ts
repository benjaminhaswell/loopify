import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss'] // Corrected here
})
export class TrackComponent {
    @Input() trackName: string | undefined;
}
