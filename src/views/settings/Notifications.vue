<template>
  <ion-page>
    <ion-content>
        <h2><ion-icon :icon="notificationIcon" /> Einstellungen</h2>
        <push-notification-setting
          :title="currentDeviceTitle"
          :channels="currentDevice.channels"
          @channels-updated="channelsUpdated(currentDevice, $event)"
          v-if="currentDevice"
        />
        <push-notification-setting
          v-for="i in otherInstallations"
          :key="i.id"
          @channels-updated="channelsUpdated(i, $event)"
          :channels="i.channels"
        />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent, IonPage,  IonIcon,
} from '@ionic/vue';
import { notificationsOutline as notificationIcon , logoWhatsapp, cloudUploadOutline } from 'ionicons/icons';
import { defineComponent, computed } from 'vue';
import { useStore } from '@/stores/';
import PushNotificationSetting from '@/components/settings/push-notification.vue';

const TEAM_FIELDS = [
  {key: 'news', title: 'Team Neuigkeiten'},
  {key: 'notifications', title: 'Pings an mich'},
  {key: 'posts', title: 'Community Beiträge'},
  {key: 'activities', title: 'Community Aktivitäten'},
]

export default defineComponent({
  name: 'NotificationSettings',
  setup() {
    const store = useStore();

    return {
      currentDevice: computed(() => store.getters["auth/currentInstallation"] ),
      otherInstallations: computed(() => store.getters["auth/otherInstallations"] ),
      channelsUpdated: (installation: any, channels: any) => {
        store.dispatch("auth/updateInstallation", installation.prepareSave({channels}).toParse());
      },
      teams: computed(() => store.getters["auth/teamPointers"].map((x: any) => store.getters['objectsMap'][x.objectId])),
      fields: TEAM_FIELDS,
      notificationIcon, logoWhatsapp, uploadIcon: cloudUploadOutline
    }
  },
  computed: {
    currentDeviceTitle(): string {
      if (!this.currentDevice) return "";
      return  `Dieses Gerät (${this.currentDevice.deviceName || this.currentDevice.deviceModel})`
    }
  },
  components: {
    IonPage, IonContent, IonIcon,
    PushNotificationSetting,
  }
});
</script>
<style sc
    NotificationDotoped>
ion-chip ion-icon {
  margin: 0
}
.profile-img {
  width: 50%;
}
</style>