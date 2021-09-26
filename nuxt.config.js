export default {
    components: true,
    head: {
        titleTemplate: 'NuxtBnB: %s',
        htmlAttrs: {
            lang: 'en'
        },
        bodyAttrs: {
            class: ["my-style"]
        },
        meta: [{
            charset: 'utf-8'
        }],
        script: [
            {
                src: "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.min.js"
            },

        ],
        link: [
            {rel: 'stylesheet',
                type: 'text/css',
                href: 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.css'},
        ],
    },

    router:{
        prefetchLinks: false
    },
    modules: [
        '~/modules/auth',
        '~/modules/algolia',
        '~/modules/cloudinary',
        '~/modules/stripe',
        '@nuxtjs/cloudinary',
        'nuxt-leaflet', // The Leaflet 'L' object can be found on vue component: this.$L
    ],
    buildModules: [
      '@nuxtjs/tailwindcss', '@nuxt/image'
    ],
    cloudinary:{
        cloudName: 'dkss6wy6g',
    },
    image: {
        cloudinary: {
            baseURL: 'https://res.cloudinary.com/dkss6wy6g/image/upload/'
        }
    },
    css: [
        '~/assets/sass/app.scss'
    ],
    build: {
        extractCss: true,
        loaders: {
            limit: 0,

        }
    },
    plugins: [
        { src: '~plugins/leaflet.js', mode: 'client', ssr: false },
        '~plugins/dataApi.js',
        '~plugins/auth.client.js',
        '~plugins/vCalendar.client.js',
        '~plugins/stripe.client.js',
    ],
    publicRuntimeConfig:{
        rootUrl: process.env.NODE_ENV === 'production' ? 'https://real-nuxt.vercel.app' : 'http://localhost:3000 ',
        auth:{
            cookieName: 'idToken',
            clientId: '461512088878-2qi65o3t1j84jbm0v2kbn92s9kc3ovng.apps.googleusercontent.com'
        },
        algolia: {
            appId: '7AS43BY7LK',
            key: 'd9b5c7e5d56f32dbde7467129dd40382'
        },
        cloudinary: {
            apiKey: '633412587543188'
        },
        stripe: {
            key: 'pk_test_51JKKYqBHVdI50vyZtg5D6FFJYJ1e6aYNSG0tHPSZSQE4kobVw2eQTP9FeejOaSlYWxh4Y32SZBQAeNEl0EUnHvg200y0bKClgP'
        }
    },
    privateRuntimeConfig:{
        algolia: {
            appId: '7AS43BY7LK',
            key: 'bd848c11b7ce2d227d1ef9a57ee0d43b'
        },
        cloudinary: {
            apiSecret: 'zuqT8tHnIcoJhhrXJNpOK-0R-eM',
        },
        stripe: {
            secretKey: process.env.STRIPE_SK
        }
    },


}