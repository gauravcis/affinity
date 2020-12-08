import { createApp } from 'vue'
import { IonicVue } from '@ionic/vue';
import Widget from './config/Widget.vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
// import '@ionic/vue/css/padding.css';
// import '@ionic/vue/css/float-elements.css';
// import '@ionic/vue/css/text-alignment.css';
// import '@ionic/vue/css/text-transformation.css';
// import '@ionic/vue/css/flex-utils.css';
// import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

const app = createApp(Widget)
  .use(IonicVue);

const widgetId = "affinity-chat-widget-" + Math.floor((Math.random() * 100000) + 1);

const elemDiv = document.createElement('div');
elemDiv.id = widgetId;
document.body.appendChild(elemDiv)

document.addEventListener("DOMContentLoaded", () => {
  app.mount('#' + widgetId);
});
