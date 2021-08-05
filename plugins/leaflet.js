import Vue from 'vue';
import { latLngBounds, latLng, icon, divIcon } from "leaflet";
import { LMap, LTileLayer, LMarker, LIcon } from 'vue2-leaflet';
import VueMapbox from '@studiometa/vue-mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import 'mapbox-gl/dist/mapbox-gl.css';

Vue.use(VueMapbox);
Vue.use(latLng)
Vue.use(latLngBounds)
Vue.use(icon)
Vue.use(divIcon)
Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-icon', LIcon);





export  default function (context, inject){
    inject('leaflet',{
    })
}


