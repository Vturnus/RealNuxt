<template>
  <div class="app-container">
    <property-gallery :images="home.images"/>
    <property-details :home="home"/>
    <property-description :home="home"/>

    <!-- Map -->

    <div class="app-wrapper app-padded-vertical">
      <h2 class="app-subtitle">Location</h2>
      <p class="app-description">
        {{ home.location.address }}
        {{ home.location.city }}
        {{ home.location.state }}
        {{ home.location.country }}
      </p>
      <client-only>
        <div class="app-map">
          <l-map ref="myMap"
                 :center="coordinates" :zoom="18">
            <l-tile-layer :url="url"></l-tile-layer>
            <l-marker :lat-lng="coordinates"></l-marker>
          </l-map>
        </div>
      </client-only>
    </div>

    <!-- End of Map -->

    <property-reviews :reviews="reviews"/>
    <property-host :user="user"/>
  </div>
</template>

<script>

export default {
  head() {
    return {
      title: this.home.title,
      meta: [
        {hid: 'og-type', property: 'og:type', content: 'website'},
        {hid: 'og-title', property: 'og:title', content: this.home.title},
        {
          hid: 'og-desc',
          property: 'og:description',
          content: this.home.description
        },
        {
          hid: 'og-img',
          property: 'og:image',
          content: this.$img(this.home.images[0], {width: 1200}, {provider: 'cloudinary'})
        },
        {
          hid: 'og-url',
          property: 'og:url',
          content: `${this.$config.rootUrl}/home/${this.home.objectID}`
        },
        { hid: 't-type', name: 'twitter:card', content: 'summary_large_image'}
      ]
    }
  },
  async asyncData({params, $dataApi, error}) {
    const responses = await Promise.all([
      $dataApi.getHome(params.id),
      $dataApi.getReviewsByHomeId(params.id),
      $dataApi.getUserByHomeId(params.id)
    ])

    const badResponse = responses.find((response) => !response.ok)
    if (badResponse) return error({
      statusCode: badResponse.status,
      message: badResponse.statusText
    })

    const coordinates = [responses[0].json._geoloc.lat, responses[0].json._geoloc.lng]
    const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'


    return {
      home: responses[0].json,
      reviews: responses[1].json.hits,
      user: responses[2].json.hits[0],
      coordinates,
      url
    }

  },
}
</script>