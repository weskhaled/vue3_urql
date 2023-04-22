<script setup lang="ts">
import { gql, useQuery, useSubscription } from '@urql/vue'
import { IconSearch } from '@arco-design/web-vue/es/icon'
import { smAndSmaller } from '~/common/stores'

defineOptions({
  name: 'IndexPage',
})

const { t } = useI18n()
// const user = useUserStore()
const { message } = useMessage()
const { width: windowWidth } = useWindowSize()

// const name = $ref(user.savedName)
// const router = useRouter()

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
const getAddress = gql`
  query getAddress{
    getAddress
  }`
const { data: dataAddress } = await useQuery({ query: getAddress })
const allAddress = computed(() => dataAddress?.value?.getAddress || [])

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
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
    filterable: {
      // filter: (value, record) => record.name.includes(value),
      slotName: 'name-filter',
      icon: () => h(IconSearch),
    },

  },
  {
    title: 'Address',
    dataIndex: 'address',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
    filterable: {
      filters: allAddress.value.map(a => ({ text: a, value: a })),
    },
  },
  {
    title: 'Nickname',
    dataIndex: 'user.nickname',
  },
]
useSubscription({ query: subscriptionListenForNewPlaceGql }, (__messages = [], response) => {
  if (response) {
    message.info({
      content: response.listenForNewPlace.address,
      duration: 5000,
    })
  }
}).executeSubscription()

function handleChange(__data, extra, __currentDataSource) {
  const { page, filters, sorter } = extra
  variables.input.pagination.page = page - 1

  if (sorter)
    variables.input.order = { ...variables.input.order, [sorter.field]: sorter.direction === 'ascend' ? 'ASC' : 'DESC' }

  else
    variables.input.order = {}

  const filterName = filters?.name && filters?.name[0]
  if (filterName?.length) {
    variables.input.where = {
      name: {
        $contains: filterName,
      },
    }
    variables.input.pagination.page = 0
  }
  else {
    delete variables.input.where.name
  }
  const filterAddress = filters?.address && filters?.address[0]
  if (filterAddress?.length) {
    variables.input.where = {
      ...variables.input.where,
      address: filterAddress,
    }
    variables.input.pagination.page = 0
  }
  else {
    delete variables.input.where.address
  }
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
        size="small"
        scrollbar :columns="columns" :scroll="{ x: smAndSmaller ? (windowWidth + 200) : '100%', y: 300 }" :data="allPlaces" :loading="fetching"
        :pagination="{ total, pageSize, showPageSize: true, pageSizeOptions: [5, 10, 20] }"
        @page-size-change="(val) => { pageSize = val; variables.input.pagination.size = val }" @change="handleChange"
      >
        <template #name-filter="{ filterValue, setFilterValue, handleFilterConfirm, handleFilterReset }">
          <div class="custom-filter bg-white p-2 shadow border">
            <a-space direction="vertical">
              <a-input :model-value="filterValue[0]" @input="(value) => setFilterValue([value])" />
              <div class="custom-filter-footer flex justify-between">
                <a-button type="primary" @click="handleFilterConfirm">
                  Confirm
                </a-button>
                <a-button @click="handleFilterReset">
                  Reset
                </a-button>
              </div>
            </a-space>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
