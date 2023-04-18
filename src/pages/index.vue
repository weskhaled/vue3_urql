<script setup lang="ts">
import { gql, useQuery, useSubscription } from '@urql/vue'
import { Message } from '~/composables/message'

defineOptions({
  name: 'IndexPage',
})

const { t } = useI18n()
const user = useUserStore()

const name = $ref(user.savedName)

const router = useRouter()
function go() {
  if (name)
    router.push(`/hi/${encodeURIComponent(name)}`)
}
const pageSize: any = ref(5)
const variables = reactive(
  {
    input: {
      pagination: {
        page: 0,
        size: 5,
      },
      relations: 'user',
      order: { id: 'ASC' },
      where: {},
    },
  })
const subscriptionListenForNewPlaceGql = gql`
  subscription listenForNewPlace {
    listenForNewPlace {
      address
      id
      name
      user {
        id
        nickname
      }
    }
  }`
const getManyPlacesGql = gql`
query GetManyPlaces($input: GetManyInput) {
  getManyPlaces(input: $input) {
    count
    data {
      id
      name
      address
      user {
        id
        nickname
      }
    }
  }
}`
const columns = reactive([
  {
    title: 'Name',
    dataIndex: 'name',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: 'Address',
    dataIndex: 'address',
    filterable: {
      filters: [{
        text: 'Tunis',
        value: 'Tunis',
      }, {
        text: 'France',
        value: 'France',
      }],
      filter: (value, row) => row.address.includes(value),
    },
  },
  {
    title: 'Nickname',
    dataIndex: 'user.nickname',
  },
])
useSubscription({ query: subscriptionListenForNewPlaceGql }, (__messages = [], response) => {
  if (response) {
    Message.info({
      content: response.listenForNewPlace.address,
      duration: 5000,
    })
  }
}).executeSubscription()

function handleChange(__data, extra, __currentDataSource) {
  const { page } = extra
  variables.input.pagination.page = page - 1
}
const { data, error, fetching } = await useQuery({ query: getManyPlacesGql, variables })

const allPlaces = computed(() => data?.value?.getManyPlaces?.data || [])
const total = computed(() => data?.value?.getManyPlaces?.count || 0)
</script>

<template>
  <a-breadcrumb :style="{ margin: '16px 0' }">
    <a-breadcrumb-item>Home</a-breadcrumb-item>
    <a-breadcrumb-item>List</a-breadcrumb-item>
    <a-breadcrumb-item>App</a-breadcrumb-item>
  </a-breadcrumb>
  <div>
    <p>
      <em text-sm opacity-75>{{ t('intro.desc') }}</em>
    </p>
    <a-date-picker style="width: 200px;" />

    <div v-if="error">
      Oh no... {{ error }}
    </div>
    <div v-else class="mt-1">
      <a-table
        scrollbar :columns="columns" :scroll="{ x: '100%', y: 300 }" :data="allPlaces" :loading="fetching"
        :pagination="{ total, pageSize, showPageSize: true, pageSizeOptions: [5, 10, 20] }"
        @page-size-change="(val) => { pageSize = val; variables.input.pagination.size = val }" @change="handleChange"
      />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
