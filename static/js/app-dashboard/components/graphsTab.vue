<template>
  <div>
    <div class="dashboard-summary mt-3">
      <div class="d-flex align-items-end justify-content-between flex-wrap mb-2">
        <div>
          <p class="lead mb-1">At a glance</p>
          <p class="text-muted mb-0">Key metrics for the current filter selection.</p>
        </div>
      </div>

      <div class="row">
        <div
          v-for="card in summaryCards"
          :key="card.label"
          class="col-sm-6 col-xl-3 mb-3"
        >
          <div class="summary-card" :class="card.toneClass">
            <p class="summary-label">{{ card.label }}</p>
            <p class="summary-value">{{ card.value }}</p>
            <p class="summary-detail mb-0">{{ card.detail }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Conferences</p>
        <Loader v-if="conferences == null" />
        <conferences-chart v-else :conferences="conferences" />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Most common issues</p>
        <Loader v-if="(issues == null || conferences == null)" />
        <most-common-issues-chart v-else :issues="issues" :conferences="conferences" />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Errors getting access to media</p>
        <Loader v-if="issues == null" />
        <gum-chart v-else :issues="gumIssues" />
      </div>
      <div class="col">
        <p class="lead">Relayed connections</p>
        <Loader v-if="connections == null" />
        <connection-type-chart v-else :connections="connections" />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Conference duration</p>
        <Loader v-if="conferences == null" />
        <conference-duration-chart
          v-else
          :conferences="conferences"
        />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Connection setup time</p>
        <Loader v-if="(connections == null || conferences == null)" />
        <call-setup-time-chart v-else :connections="connections" :conferences="conferences" />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Number of participants</p>
        <Loader v-if="conferences == null" />
        <no-participants-chart v-else :conferences="conferences" />
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <p class="lead">Browsers</p>
        <Loader v-if="sessions == null" />
        <browsers-chart v-else :sessions="sessions" />
      </div>
      <div class="col">
        <p class="lead">Operating systems</p>
        <Loader v-if="sessions == null" />
        <o-s-chart v-else :sessions="sessions" />
      </div>
    </div>

  </div>
</template>

<script>
import ConferencesChart from "./graphs/conferencesChart.vue";
import GumChart from "./graphs/gumChart.vue";
import ConnectionTypeChart from "./graphs/connectionTypeChart.vue";
import MostCommonIssuesChart from "./graphs/mostCommongIssuesChart.vue";
import CallErrorsChart from "./graphs/callErrorsChart.vue";
import ConferenceDurationChart from "./graphs/conferenceDurationChart.vue";
import CallSetupTimeChart from "./graphs/callSetupTimeChart.vue";
import NoParticipantsChart from "./graphs/noParticipantsChart.vue";

import BrowsersChart from "../../components/browsersChart.vue";
import OSChart from "../../components/osChart.vue";
import Loader from "../../components/loader.vue";

export default {
  name: "graphs-tab",
  components: {
    ConferencesChart,
    GumChart,
    MostCommonIssuesChart,
    CallErrorsChart,
    ConnectionTypeChart,
    ConferenceDurationChart,
    CallSetupTimeChart,
    NoParticipantsChart,
    BrowsersChart,
    OSChart,
    Loader
  },
  props: {
    conferences: {
      required: true,
      validator: value => {
        return Array.isArray(value) || peermetrics.utils.isNull(value)
      }
    },
    sessions: {
      required: false,
      validator: value => {
        return Array.isArray(value) || peermetrics.utils.isNull(value)
      }
    },
    connections: {
      required: false,
      validator: value => {
        return Array.isArray(value) || peermetrics.utils.isNull(value)
      }
    },
    issues: {
      required: false,
      validator: value => {
        return Array.isArray(value) || peermetrics.utils.isNull(value)
      }
    },
  },
  computed: {
    conferencesCount() {
      return Array.isArray(this.conferences) ? this.conferences.length : 0;
    },
    participantsCount() {
      if (Array.isArray(this.sessions) && this.sessions.length) {
        return new Set(this.sessions.map((session) => session.participant).filter(Boolean)).size;
      }

      if (Array.isArray(this.conferences) && this.conferences.length) {
        return new Set(
          this.conferences
            .map((conference) => conference.participants || [])
            .reduce((allParticipants, participants) => allParticipants.concat(participants), [])
            .filter(Boolean)
        ).size;
      }

      return 0;
    },
    averageConferenceDurationSeconds() {
      if (!Array.isArray(this.conferences) || !this.conferences.length) {
        return 0;
      }

      const totalDuration = this.conferences.reduce((sum, conference) => {
        return sum + (conference.duration || 0);
      }, 0);

      return totalDuration / this.conferences.length;
    },
    healthyConferenceCount() {
      if (!Array.isArray(this.conferences) || !this.conferences.length) {
        return 0;
      }

      return this.conferences.filter((conference) => {
        return !conference.issues || conference.issues.length === 0;
      }).length;
    },
    summaryCards() {
      if (this.conferences == null || this.sessions == null) {
        return [
          { label: 'Conferences', value: '...', detail: 'Loading conference data', toneClass: 'summary-card--blue' },
          { label: 'Participants', value: '...', detail: 'Loading participant data', toneClass: 'summary-card--green' },
          { label: 'Avg duration', value: '...', detail: 'Calculating averages', toneClass: 'summary-card--gold' },
          { label: 'Healthy calls', value: '...', detail: 'Checking issue coverage', toneClass: 'summary-card--rose' },
        ];
      }

      const healthyRate = this.conferencesCount
        ? Math.round((this.healthyConferenceCount / this.conferencesCount) * 100)
        : 0;

      return [
        {
          label: 'Conferences',
          value: this.formatCount(this.conferencesCount),
          detail: this.conferencesCount === 1 ? '1 conference in view' : `${this.formatCount(this.conferencesCount)} conferences in view`,
          toneClass: 'summary-card--blue'
        },
        {
          label: 'Participants',
          value: this.formatCount(this.participantsCount),
          detail: this.participantsCount === 1 ? '1 unique participant' : `${this.formatCount(this.participantsCount)} unique participants`,
          toneClass: 'summary-card--green'
        },
        {
          label: 'Avg duration',
          value: this.formatDuration(this.averageConferenceDurationSeconds),
          detail: this.conferencesCount ? 'Average across filtered conferences' : 'No conferences match current filters',
          toneClass: 'summary-card--gold'
        },
        {
          label: 'Healthy calls',
          value: `${healthyRate}%`,
          detail: this.conferencesCount ? `${this.formatCount(this.healthyConferenceCount)} without issues` : 'No conferences match current filters',
          toneClass: 'summary-card--rose'
        }
      ];
    },
    gumIssues() {
      if (this.issues) {
        return this.issues.filter((issue) => {
          return issue.code === 'getusermedia_error'
        })
      }

      return []
    }
  },
  methods: {
    formatCount(value) {
      return new Intl.NumberFormat().format(value || 0);
    },
    formatDuration(value) {
      const totalMinutes = Math.round((value || 0) / 60);

      if (!totalMinutes) {
        return '0m';
      }

      if (totalMinutes < 60) {
        return `${totalMinutes}m`;
      }

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      if (!minutes) {
        return `${hours}h`;
      }

      return `${hours}h ${minutes}m`;
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-summary {
  .summary-card {
    height: 100%;
    border-radius: 16px;
    padding: 18px 20px;
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid #e5e7eb;
    box-shadow: 0 18px 40px -28px rgba(15, 23, 42, 0.35);
  }

  .summary-card--blue {
    border-top: 4px solid #2563eb;
  }

  .summary-card--green {
    border-top: 4px solid #059669;
  }

  .summary-card--gold {
    border-top: 4px solid #d97706;
  }

  .summary-card--rose {
    border-top: 4px solid #e11d48;
  }

  .summary-label {
    margin-bottom: 8px;
    color: #64748b;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .summary-value {
    margin-bottom: 6px;
    color: #0f172a;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
  }

  .summary-detail {
    color: #475569;
    font-size: 0.95rem;
  }
}

.card-body {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
