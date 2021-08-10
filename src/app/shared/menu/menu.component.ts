import { Component } from '@angular/core';

interface MenuItem {
  name: string,
  route: string
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [
    `
      li {
        cursor: pointer
      }
    `
  ]
})
export class MenuComponent {

  menuItems: MenuItem[] = [
    {
      name: 'FullScreen',
      route: '/maps/fullscreen'
    },
    {
      name: 'Zoom Range',
      route: '/maps/zoom-range'
    },
    {
      name: 'Markers',
      route: '/maps/markers'
    },
    {
      name: 'Properties',
      route: '/maps/properties'
    },
  ]

}
