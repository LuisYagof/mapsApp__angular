import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl'

interface CustomMarker {
  color: string;
  marker?: mapboxgl.Marker;
  center?: [number, number];
  id?: number;
}

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styleUrls: ['./markers.component.css']
})
export class MarkersComponent implements AfterViewInit {

  @ViewChild('mapid') mapDiv!: ElementRef;
  map!: mapboxgl.Map;
  zoomLvl: number = 10;
  mapCenter: [number, number] = [-3.7156301588934686, 40.4314967801423]
  markers: CustomMarker[] = []

  constructor() { }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.mapDiv.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.mapCenter,
      zoom: this.zoomLvl
    });

    this.getMarkersLS()

    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'MARK';

    // const marker = new mapboxgl.Marker(
    //   // { element: markerHtml }
    // )
    //   .setLngLat([-3.72, 40.43])
    //   .addTo(this.map);
  }

  addMarker() {
    const newColor = "#xxxxxx".replace(/x/g, y => (Math.random() * 16 | 0).toString(16))
    const newId = Date.now()
    const newMarker = new mapboxgl.Marker({
      draggable: true,
      color: newColor
    })
      .setLngLat(this.map.getCenter())
      .addTo(this.map);

    this.markers.push({
      color: newColor,
      marker: newMarker,
      id:  newId
    })

    this.saveMarkersLS()

    newMarker.on('dragend', () => {
      this.saveMarkersLS()
    })

  }

  goMarker(marker: CustomMarker) {
    this.map.flyTo({ center: marker.marker!.getLngLat(), zoom: 11 })
  }

  deleteMarker(marker: CustomMarker, i: number) {
    // this.markers[i].marker?.remove()
    // this.markers = this.markers.filter(el => el.color !== marker.color)
    // this.markers = this.markers.filter(el => el.marker?.getLngLat() !== marker.marker?.getLngLat())
    marker.marker?.getElement().remove()
    this.markers = this.markers.filter(el => el.id !== marker.id)
    this.saveMarkersLS()
  }

  saveMarkersLS() {
    const coordArr: CustomMarker[] = []

    this.markers.forEach(m => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();
      coordArr.push({ color, center: [lng, lat], id: m.id })
    })

    localStorage.setItem('markers', JSON.stringify(coordArr))
  }

  getMarkersLS() {
    if (!localStorage.getItem('markers')) {
      return;
    }
    const coordArr: CustomMarker[] = JSON.parse(localStorage.getItem('markers')!)

    coordArr.forEach(m => {
      const newMarker = new mapboxgl.Marker({
        draggable: true,
        color: m.color
      })
        .setLngLat(m.center!)
        .addTo(this.map);

      this.markers.push({ marker: newMarker, color: m.color, id: m.id })

      newMarker.on('dragend', () => {
        this.saveMarkersLS()
      })
    })
  }

}
