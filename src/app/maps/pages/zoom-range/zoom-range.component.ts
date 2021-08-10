import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl'

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
      .mapWrapper {
        width: 100%;
        height: 100%;
      }

      .row {
        background-color: whitesmoke;
        border-radius: 5px;
        bottom: 50px;
        left: 50px;
        padding: 10px;
        position: fixed;
        width: 400px;
        z-index: 999;
      }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapid') mapDiv!: ElementRef;
  map!: mapboxgl.Map;
  zoomLvl: number = 10;
  mapCenter: [number, number] = [-3.7156301588934686, 40.4314967801423]

  constructor() { }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.mapDiv.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.mapCenter,
      zoom: this.zoomLvl
    });

    this.map.on('zoom', () => this.zoomLvl = this.map.getZoom())

    this.map.on('zoomend', () => {
      if (this.map.getZoom() > 18) {
        this.map.zoomTo(18)
      }
    })

    // MAP MOVEMENT
    this.map.on('move', (ev) => {
      const { lng, lat } = ev.target.getCenter()
      this.mapCenter = [lng, lat]
    })
  }

  ngOnDestroy(): void {
    this.map.off('zoom', () => { })
    this.map.off('zoomend', () => { })
    this.map.off('move', () => { })
  }

  zoomIn() {
    this.map.zoomIn()
  }

  zoomOut() {
    this.map.zoomOut()
  }

  zoomChanged(val: string) {
    this.map.zoomTo(Number(val))

  }

}
