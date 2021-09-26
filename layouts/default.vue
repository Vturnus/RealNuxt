<template>
  <div class="app">
    <header class="app-header">
      <nuxt-link to="/" class="app-logo">
        <img src="/images/logo.svg" alt="logo" />
      </nuxt-link>
      <div  class="app-search">
        <client-only>
          <mapbox-geocoder
              :access-token=this.token
              @mb-created="instance => control = instance"
              @mb-result="changed"
              placeholder="Enter your address"
              :limit=this.limit
          />
        <template #placeholder>
          <input class="datepicker"/>
          <span class="-ml-6 mr-2">to</span>
          <input class="datepicker"/><br/>
        </template>
          <date-picker  v-model="range"
                       is-range
                       timezone="UTC"
                       :modelConfig="{timeAdjust: '00:00:00'}"
          >
            <template v-slot="{inputValue, inputEvents}">
              <input :value="inputValue.start" v-on="inputEvents.start" class="datepicker"/>
              <span class="-ml-6 mr-2">to</span>
              <input :value="inputValue.end" v-on="inputEvents.end" class="datepicker"/><br/>
            </template>
          </date-picker>
        </client-only>
        <button @click="search">
          <img src="/images/icons/search.svg" alt="searchImage"/>
        </button>
      </div>
      <div class="app-user-menu">
        <template v-if="isLoggedIn">
          <img src="/images/icons/house.svg" alt="main"/>
          <div class="name">Host</div>
          <img :src="user.profileUrl" class="avatar" :alt="user.fullName"/>
        </template>
        <div v-show="!isLoggedIn" id="googleButton" class="ml-8"></div>
      </div>
    </header>
    <nuxt/>
  </div>
</template>

<script>

export default {
  data(){
    return {
      token: 'pk.eyJ1IjoidnR1cm51cyIsImEiOiJja3F1MTIyZnMwMDQ4MnVyeXhqYmh1cml3In0.ODOteH5_h84FJzvGOXHJsQ',
      limit: 10,
      range: {
        start: new Date(),
        end: new Date(),
      },
      location: {
        lat: 0,
        lng: 0,
        label: '',
      }
    }
  },
  computed:{
    user(){
      return this.$store.state.auth.user
    },
    isLoggedIn(){
      return this.$store.state.auth.isLoggedIn
    }
  },
  methods: {
    search(){
      if(!this.location.label) return
      this.$router.push({
        name: 'search',
        query: {
          ...this.location,
          start: this.range.start.getTime() / 1000,
          end: this.range.end.getTime() / 1000,
        }
      })
   },
    changed(event){
      const place = event.result
      if(!place.geometry) return
      this.location.lat = place.center[1]
      this.location.lng= place.center[0]
      this.location.label= place.place_name
    }
  }

}
</script>
