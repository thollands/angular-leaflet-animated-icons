import { Component } from '@angular/core';
import { Map, MapOptions, tileLayer, LatLng, divIcon, marker, geoJSON } from 'leaflet';
import { FeatureCollection, Feature, Geometry, GeoJsonProperties } from 'geojson';
import { IAppSymbology } from './symbology';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  // map options
  public baseLayer = tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png');
  public mapOptions = {
    center: [0, 0],
    zoom: 4,
  } as MapOptions;

  // map object
  public map!: Map;

  // dummy data FeatureCollection
  readonly data: FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        "type": "Feature",
        "properties": { },
        "geometry": {
          "coordinates": [
            15.887259826195844,
            -1.9123582851803036
          ],
          "type": "Point"
        },
        "id": 1
      },
      {
        "type": "Feature",
        "properties": { },
        "geometry": {
          "coordinates": [
            -6.887543697112704,
            8.833062813665634
          ],
          "type": "Point"
        },
        "id": 2
      },
      {
        "type": "Feature",
        "properties": { },
        "geometry": {
          "coordinates": [
            20.113042190422988,
            7.169236944483231
          ],
          "type": "Point"
        },
        "id": 3
      },
      {
        "type": "Feature",
        "properties": { },
        "geometry": {
          "coordinates": [
            18.937693750697576,
            -11.177597113118466
          ],
          "type": "Point"
        },
        "id": 4
      },
      {
        "type": "Feature",
        "properties": { },
        "geometry": {
          "coordinates": [
            10.352244413199145,
            16.802957535698198
          ],
          "type": "Point"
        },
        "id": 5
      }
    ]
  };

  readonly symbology: IAppSymbology[] = [
    {
      label: '0 to 1',
      colour: '#7b3294',
      minRange: 0,
      maxRange: 1
    },
    {
      label: '1 to 2',
      colour: '#c2a5cf',
      minRange: 1,
      maxRange: 2
    },
    {
      label: '2 to 3',
      colour: '#f7f7f7',
      minRange: 2,
      maxRange: 3
    },
    {
      label: '3 to 4',
      colour: '#a6dba0',
      minRange: 3,
      maxRange: 4
    },
    {
      label: '4 to 5',
      colour: '#008837',
      minRange: 4,
      maxRange: 5
    }
  ]

  readonly symbology2: IAppSymbology[] = [
    {
      label: '0 to 1',
      colour: '#d7191c',
      minRange: 0,
      maxRange: 1
    },
    {
      label: '1 to 2',
      colour: '#fdae61',
      minRange: 1,
      maxRange: 2
    },
    {
      label: '2 to 3',
      colour: '#ffffbf',
      minRange: 2,
      maxRange: 3
    },
    {
      label: '3 to 4',
      colour: '#a6d96a',
      minRange: 3,
      maxRange: 4
    },
    {
      label: '4 to 5',
      colour: '#1a9641',
      minRange: 4,
      maxRange: 5
    }
  ]

  /**
   * Callback function for when Leaflet map ready
   * @param map $event from callback (Leaflet Map object)
   */
  public onMapReady(map: Map): void {
    // save map object to component
    this.map = map;
  }

  /**
   * Take value, and look in symbology2 object to find the correct symbol
   * i.e. value <= max and value > min (including the top of the range but not the bottom)
   * @param value attribute value to symbolise
   * @returns IAppSymbology item, which defines the colour
   */
  private getSymbolByValue(value: number | undefined): IAppSymbology | undefined {
    
    // return nothing if no value
    if(!value) return undefined;
    // find symbol that matches value
    const symbol = this.symbology2.find((item: IAppSymbology) => item.maxRange >= value && item.minRange < value)
    // TODO add handling for null values
    return symbol
  }

  /**
     * pointToLayer function for point layer:
     *   - update style
     * @param feature geojson feature
     * @param latlng latlng of point
     */
  private pointLayerStyle = (feature: Feature<Geometry, GeoJsonProperties>, latlng: LatLng) => {

    // grab feature id
    const id = feature.id as number;

    // create main div element, add classes and set text
    const el = document.createElement('div');
    el.classList.add('custom-div-icon');
    el.classList.add('pulse');
    el.innerText = `${id}`;

    const symbol = this.getSymbolByValue(id) as IAppSymbology;

    // add colours
    el.style.borderColor = symbol.colour;
    el.style.backgroundColor = symbol.colour;

    // calc random delay in ms
    const delay = Math.floor(Math.random() * 1000);

    // apply custom delay to this marker
    el.style.animationDelay = `${delay}ms`;

    // Create a custom DivIcon for each feature
    const customDivIcon = divIcon({
      html: el, // set element
      iconSize: [40, 40], // set size
      iconAnchor: [20, 20], // center the icon on the point
    });

    // return a marker at the given latlng and set its icon to the custom icon we just created
    return marker(latlng, { icon: customDivIcon });
  };

  // make point layer
  readonly pointLayer = geoJSON(this.data, {
    pointToLayer: this.pointLayerStyle
  });

}
