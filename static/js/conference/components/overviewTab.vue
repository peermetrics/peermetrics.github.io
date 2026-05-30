<template>
  <div>
    <p>Participants</p>
    <Loader v-if="participants === null" />
    <div v-else class="row row-cols-1 row-cols-md-3 mt-3 cards">
      <div v-for="participant in participants" :key="participant.id" class="col mb-4">
        <div class="card h-100">
          <participants-card :participant="participant" />
        </div>
      </div>
    </div>

    <p class="mt-3 mb-0">Connections</p>
    <Loader v-if="participants === null" />
    <participants-accordion
      :connections="connections"
      :participants="participants"
      :processedEvents="processedEvents"
      :events="events"
      v-else
    />
  </div>
</template>

<script>
import Loader from "../../components/loader.vue";
import ParticipantsCard from "./participantsCard.vue";
import ParticipantsAccordion from "./participantsAccordion.vue";

export default {
  name: "overview-tab",
  props: {
    connections: {
      required: true,
      validator: value => {
        return Array.isArray(value) || peermetrics.utils.isNull(value)
      }
    },
    events: {
      required: true,
      validator: value => {
        return Array.isArray(value) || peermetrics.utils.isNull(value)
      }
    },
    participants: {
      required: true,
      validator: value => {
        return Array.isArray(value) || peermetrics.utils.isNull(value)
      }
    },
    sessions: {
      required: true,
      validator: value => {
        return Array.isArray(value) || (typeof value === "object" && !value)
      }
    },
    processedEvents: {
      required: true,
      validator: value => {
        return typeof value === "object" 
      }
    }
  },
  components: {
    Loader,
    ParticipantsAccordion,
    ParticipantsCard
  },
};
</script>

<style lang="scss" scoped>
.cards {
  max-height: 1000px;
  overflow-y: auto;
}
</style>
