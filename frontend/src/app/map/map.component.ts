import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import tt from '@tomtom-international/web-sdk-maps';

const apiKey = 'GqHS4XnIJLDYWw21i3da0pWr7MG0Qx9r';

export const environment = {
  production: false
}

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input() address: string;
  map: any;

  constructor(private client: HttpClient) { }

  ngOnInit(): void {
    this.client.get(`https://api.tomtom.com/search/2/geocode/${this.address}.json?key=${apiKey}`).subscribe({
      next: (res: any) => {

        this.map = tt.map({
          key: apiKey,
          container: "map",
          zoom: 1.6
        });

        this.map.addControl(new tt.FullscreenControl());
        this.map.addControl(new tt.NavigationControl());

        this.map.flyTo({
          center: {
            lat: res.results[0].position.lat,
            lng: res.results[0].position.lon
          },
          zoom: 15
        });


        const marker = new tt.Marker().setLngLat({
          lat: res.results[0].position.lat,
          lng: res.results[0].position.lon,
        }).addTo(this.map);
      }
    });
  }

  ngAfterViewInit() {

  }
}
