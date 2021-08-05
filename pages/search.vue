<template>
  <div class="app-search-results-page">
    <div class="app-search-results">
      <div class="app-search-results-listing">
        <h2 class="app-title">Stays in {{label}}</h2>
        <nuxt-link v-for="home in homes" :key="home.objectID" :to="`/home/${home.objectID}`">
          <home-row  class="app-house" :home="home" @mouseover.native="highlightMarker(home.objectID, true)"
                     @mouseout.native="highlightMarker(home.objectID, false)"/>
        </nuxt-link>
      </div>
      <div class="app-search-results-map">
        <div class="app-map">
          <client-only>
            <l-map ref="myMap"
                   :center="center"
                   :zoom="15">
              <l-tile-layer :url="url"></l-tile-layer>
              <l-marker v-for="marker in homes" :options="options" :key="marker.objectID" :lat-lng="[marker._geoloc.lat, marker._geoloc.lng]">
                <l-icon icon-url="https://maps.gstatic.com/mapfiles/transparent.png" :class-name="'marker home-'+marker.objectID">${{marker.pricePerNight}}</l-icon>
              </l-marker>
            </l-map>
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  head(){
    return{
      title: `Homes around ${this.label}`
    }
  },
  name: "search",
  data(){
    return{
      options: {
          interactive: false
      }
    }
  },

  async asyncData({query, $dataApi}){
    const data = await $dataApi.getHomesByLocation(query.lat, query.lng, query.start, query.end)
    return {
      homes: data.json.hits,
      label: query.label,
      center: [query.lat, query.lng],
      lat: query.lat,
      lng: query.lng,
      //
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    }
  },

  async beforeRouteUpdate(to, from, next){
    const data = await this.$dataApi.getHomesByLocation(to.query.lat, to.query.lng, to.query.start,
    to.query.end)
    this.homes = data.json.hits
    this.label = to.query.label
    this.center = [to.query.lat, to.query.lng]
    this.lat = to.query.lat
    this.lng = to.query.lng
    // this.price = data.json.hits[0]
    if(this.homes) {
      let bounds = new this.$L.latLngBounds()
      this.homes.forEach((home) => {
        bounds.extend(new this.$L.LatLng(home._geoloc.lat, home._geoloc.lng))
      })
      this.$refs.myMap.mapObject.fitBounds(bounds)
    }
    else {
      let bounds = new this.$L.latLngBounds()
      bounds.extend(this.center)

      this.$refs.myMap.mapObject.fitBounds(bounds)
    }
    this.url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    next()

  },

  mounted() {
    this.$nextTick(async ()=>{
     if(this.homes) {
        let bounds = new this.$L.latLngBounds()
       await this.homes.forEach((home) => {
          bounds.extend(new this.$L.LatLng(home._geoloc.lat, home._geoloc.lng))
        })
        this.$refs.myMap.mapObject.fitBounds(bounds)
      }
      else {
        let bounds = new this.$L.latLngBounds()
       await bounds.extend(this.center)
        this.$refs.myMap.mapObject.fitBounds(bounds)
      }
    })

  },
  methods: {
    highlightMarker(homeId, isHighlighted){
      document.getElementsByClassName(`home-${homeId}`)[0]?.classList?.toggle('marker-highlight', isHighlighted)
    }
  }
}
</script>

<style>
.marker{
  background-color: white;
  border: 1px solid lightgray;
  font-weight: bold;
  color: black;
  border-radius: 20px;
  padding: 10px 20px;
}

.marker-highlight{
  color: white !important;
  background-color: black;
  border-color: black;
}

</style>