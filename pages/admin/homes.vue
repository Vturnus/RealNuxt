<template>
  <div>
  <span v-for="home in homeList" :key="home.objectID">{{ home.title }}:
    <button class="text-red-800"
            @click="deleteHome(home.objectID)">Delete</button><br/>
  </span>
    <h2 class="text-xl bold">Add a home</h2>
    <form class="form" @submit.prevent="onSubmit">
      Images:<br/>
      <image-uploader @file-uploaded="imageUpdated($event,0)"/>
      <image-uploader @file-uploaded="imageUpdated($event,1)"/>
      <image-uploader @file-uploaded="imageUpdated($event,2)"/>
      <image-uploader @file-uploaded="imageUpdated($event,3)"/>
      <image-uploader @file-uploaded="imageUpdated($event,4)"/>
      Title: <br/>
      <input type="text" v-model="home.title" class="w-60"><br/>
      Description<br/>
      <textarea v-model="home.description" class="w-104"></textarea><br/>
      Note<br/>
      <textarea v-model="home.note" class="w-104"></textarea><br/>
      Features<br/>
      <input type="text" v-model="home.features[0]" class="w-26">
      <input type="text" v-model="home.features[1]" class="w-26">
      <input type="text" v-model="home.features[2]" class="w-26">
      <input type="text" v-model="home.features[3]" class="w-26">
      <input type="text" v-model="home.features[4]" class="w-26"><br/>
      Price Per Night<br/>
      <input type="number" v-model="home.pricePerNight" class="w-14"><br/>
      Guests / Rooms / Beds / Baths<br/>
      <input type="number" v-model="home.guests" class="w-14">
      <input type="number" v-model="home.bedrooms" class="w-14">
      <input type="number" v-model="home.beds" class="w-14">
      <input type="number" v-model="home.bathrooms" class="w-14"><br/>
      <client-only>
        <mapbox-geocoder
            :access-token=this.token
            @mb-created="instance => control = instance"
            @mb-result="changed"
            placeholder="Select a location"
            :limit=this.limit
        />
        <br/>
      </client-only>
      Address: <input type="text" v-model="home.location.address"
                      class="w-60"><br/>
      City: <input type="text" v-model="home.location.city" class="w-26"><br/>
      State: <input type="text" v-model="home.location.state" class="w-26"><br/>
      Postal Code: <input type="text" v-model="home.location.postalCode"
                          class="w-26"><br/>
      Country: <input type="text" v-model="home.location.country"
                      class="w-26"><br/>
      <date-picker v-for="(range, index) in home.availabilityRanges"
                   :key="index"
                   v-model="home.availabilityRanges[index]"
                   is-range
                   timezone="UTC"
                   :modelConfig="{timeAdjust: '00:00:00'}"
      >
        <template v-slot="{inputValue, inputEvents}">
          <input :value="inputValue.start" v-on="inputEvents.start"/>
          to
          <input :value="inputValue.end" v-on="inputEvents.end"/><br/>
        </template>
      </date-picker>
      <button class="border px-4 py-2 border-gray-400">Add</button>
    </form>
  </div>
</template>

<script>
import {unWrap} from "~/utils/fetchUtils";

export default {
  name: "homes",
  data() {
    return {
      token: 'pk.eyJ1IjoidnR1cm51cyIsImEiOiJja3F1MTIyZnMwMDQ4MnVyeXhqYmh1cml3In0.ODOteH5_h84FJzvGOXHJsQ',
      limit: 10,
      homeList: [],
      home: {
        title: '',
        description: '',
        note: '',
        pricePerNight: '',
        guests: '',
        bedrooms: '',
        beds: '',
        bathrooms: '',
        features: ['', '', '', '', ''],
        location: {
          address: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        },
        _geoloc: {
          lat: '',
          lng: '',
        },
        images: [],
        availabilityRanges: [
          {
            start: '', end: '',
          },
          {
            start: '', end: ''
          }
        ]
      }
    }
  },
  mounted() {
    this.setHomeList()
  },
  methods: {
    async deleteHome(homeId) {
      await fetch(`/api/homes/${homeId}`, {
        method: 'DELETE',
      })
      const index = this.homeList.findIndex(obj => obj.objectID === homeId)
      this.homeList.splice(index, 1)
    },
    async setHomeList() {
      this.homeList = (await unWrap(await fetch('/api/homes/user/'))).json
    },
    imageUpdated(imageUrl, index) {
      this.home.images[index] = imageUrl
    },
    async onSubmit() {
      const response = await unWrap(await fetch('/api/homes', {
        method: 'POST',
        body: JSON.stringify(this.home),
        headers: {
          'Content-Type': 'application/json',
        }
      }))
      this.homeList.push({
        title: this.home.title,
        objectID: response.json.homeId
      })
    },
    changed(event) {
      const addressParts = event.result.context

      this.home.location.address = event.result.place_name
      this.home.location.city = this.getAddressPart(addressParts, 'place')
      this.home.location.state = this.getAddressPart(addressParts, 'region')
      this.home.location.country = this.getAddressPart(addressParts, 'country')
      this.home.location.postalCode = this.getAddressPart(addressParts, 'postcode')

      const geo = event.result.geometry.coordinates
      this.home._geoloc.lat = geo[1]
      this.home._geoloc.lng = geo[0]
    },
    getAddressPart(parts, id) {
      const i = parts.find(part => part.id.includes(id))
      if (i !== undefined) return i.text
    }
  }
}
</script>
<style scoped>
.form input,
.form textarea {
  @apply p-1 m-1 bg-gray-200;
}
</style>