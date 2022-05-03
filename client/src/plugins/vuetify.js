import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#FDC20B",
        secondary: "#00A57E",
        accent: "#2A2F35",
        error: "#FF5252",
        info: "#FDC20B",
        success: "#4CAF50",
        warning: "#FFC107",
      },
    },
  },
});
