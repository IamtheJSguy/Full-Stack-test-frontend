<template>
  <div v-if="render">
    <div class="map-container">
      <el-row :grid="20">
        <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
          <div class="map-main" align="center">
            <div class="location-search-field-con">
              <input
                type="text"
                v-model="manualAddress"
                placeholder="Enter manual address"
                @keyup="handleTyping"
              />
              <button @click="fetchGeoLocation">
                <i class="el-icon-search"></i>
              </button>
            </div>
          </div>
          <gmap-map
            :center="center"
            :zoom="10"
            style="width: 100%; height: 80vh"
          >
            <gmap-marker
              :key="index"
              v-for="(gmp, index) in locations"
              :position="gmp"
              @click="center = gmp"
            ></gmap-marker>
          </gmap-map>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
          <div align="center">
            <h2>Places</h2>
          </div>
          <div v-if="places.length > 0" class="places-scroll-con">
            <div
              v-for="(place, index) in places"
              :key="'places-' + index"
              class="detail-con"
            >
              <p class="heading">{{ place.properties.name }}</p>
              <p>{{ place.properties.contact_details.phone }}</p>
              <p>{{ place.properties.address_components.address }}</p>
            </div>
          </div>
          <div align="center" v-else>
            <p>No places found!</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "PlacesIndex",
  data() {
    return {
      places: [],
      center: {
        lat: 45.511,
        lng: -73.582,
      },
      locations: [],
      render: false,
      manualAddress: "",
    };
  },
  beforeCreate() {},
    computed: {
    ...mapState({
      user: state => state.user
    })
  },
  created() {
    if(!this.user.id){
        this.$router.push('/')
      }
  },
  mounted() {
    this.geolocate();
    setTimeout(() => {
      this.getPlacesAuto();
      setTimeout(() => {
        this.render = true;
      });
    }, 1000);
  },
  methods: {
    geolocate() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },
    fetchGeoLocation() {
      this.$store
        .dispatch("manualSearchGeoLocation", this.manualAddress)
        .then((response) => {
          const res = response.data.locations[0].referencePosition;
          this.center = {
            lat: res.latitude,
            lng: res.longitude,
          };
          this.getPlacesAuto();
        });
    },
    getPlacesAuto() {
      const that = this;
      const payload = {
        sportId: this.$route.params.id,
        lat: this.center.lat,
        lng: this.center.lng,
      };
      this.$store.dispatch("fetchPlaces", payload).then((response) => {
        const res = response.data.data;
        let locations = [];
        res.features.map((place) => {
          if (place.geometry.coordinates[0].constructor === Array) {
            locations.push({
              lng: place.geometry.coordinates[0][0],
              lat: place.geometry.coordinates[0][1],
              label: place.properties.name,
            });
          } else {
            locations.push({
              lng: place.geometry.coordinates[0],
              lat: place.geometry.coordinates[1],
              label: place.properties.name,
            });
          }
        });
        that.places = res.features;
        that.locations = locations;
      });
    },
    handleTyping() {
      if (!this.manualAddress) {
        this.geolocate();
        setTimeout(() => {
          this.getPlacesAuto();
          setTimeout(() => {
            this.render = true;
          });
        }, 1000);
      }
    },
  },
};
</script>

<style lang="scss">
.detail-con {
  width: 100%;
  padding: 10px 20px;
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.16);
  min-height: 80px;
}
.detail-con:hover {
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.26);
}
.detail-con .heading {
  font-weight: 700;
  font-size: 14px;
}
.detail-con p {
  margin: 0;
  font-size: 12px;
}
.places-scroll-con {
  height: 80vh;
  overflow-y: scroll;
}
.map-main {
  position: relative !important;
  width: 100%;
  align-items: center;
  padding: 10px;
}
.location-search-field-con {
  width: 50%;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.16);
  // height: 50px;
}
.location-search-field-con input {
  width: 90%;
  height: 50px;
  outline: none;
  border: none;
  border-radius: 8px;
}
.location-search-field-con button {
  width: 10%;
  border: none;
  outline: none;
  height: 50px;
  background: none;
}
</style>