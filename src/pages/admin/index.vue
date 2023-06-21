<script setup lang="ts">
import { gql, useClientHandle, useQuery, useSubscription } from '@urql/vue'
import { IconSearch } from '@arco-design/web-vue/es/icon'
// import { promiseTimeout } from '@vueuse/core'
import { mdAndLarger, smAndSmaller } from '~/common/stores'
import { customFetch } from '~/common/services/customFetch'

// definePage({
//   name: 'adminIndex',
//   path: '/admin',
//   // alias: ['/admin'],
//   meta: {
//     layout: 'admin',
//   },
// })
const { client: urqlClient } = useClientHandle()
const { t } = useI18n()
const { message } = useMessage()
const { width: windowWidth } = useWindowSize()
// const router = useRouter()

const pageSize: any = ref(20)
const variables = reactive(
  {
    input: {
      pagination: {
        page: 0,
        size: 20,
      },
      relations: 'user',
      order: {},
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
const columns = ref([
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
    fixed: 'left',
    width: mdAndLarger.value ? 230 : 150,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
    filterable: {
      filters: [],
    },
  },
  {
    title: 'Nickname',
    dataIndex: 'user.nickname',
  },
])
useQuery({ query: getAddress }).executeQuery().then((res) => {
  const columnFilterable = columns.value.find(c => c.dataIndex === 'address')?.filterable
  columnFilterable && res.data?.value && (columnFilterable.filters = res.data?.value?.getAddress?.map(a => ({ text: a, value: a })))
})
useSubscription({ query: subscriptionListenForNewPlaceGql }, (__messages = [], response) => {
  if (response) {
    message.info({
      content: `${response.listenForNewPlace.address} - ${response.listenForNewPlace.name}`,
      duration: 5000,
    })
  }
}).executeSubscription()

function handleChange(__data, extra, __currentDataSource) {
  const { page, filters, sorter, type } = extra
  if (type === 'pagination') {
    variables.input.pagination.page = page - 1
    return
  }

  if (sorter)
    variables.input.order = { ...variables.input.order, [sorter.field]: sorter.direction === 'ascend' ? 'ASC' : 'DESC' }

  else
    variables.input.order = {}

  const filterName = filters?.name && filters?.name[0]
  if (filterName?.length) {
    variables.input.where = {
      ...variables.input.where,
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
const { data, error, fetching } = useQuery({ query: getManyPlacesGql, variables })
const allPlaces = computed(() => data?.value?.getManyPlaces?.data || [])
const total = computed(() => data?.value?.getManyPlaces?.count || 0)
if (error.value) {
  fetching.value = true

  message.error({
    content: error.value.graphQLErrors[0]?.message || t('cannot_get_data'),
    duration: 2000,
  })
}
// await promiseTimeout(1200000)
const mutationUploadFileGql = gql`
  mutation ($file: Upload!) {
    uploadFile(file: $file)
}`
function customRequest(option) {
  const { onProgress, onError, onSuccess, fileItem, __name } = option

  let abort: any
  urqlClient.executeMutation({
    key: 1,
    query: mutationUploadFileGql,
    variables: { file: fileItem.file },
  }, {
    requestPolicy: 'network-only',
    fetch: (uri, options) => customFetch(uri, {
      ...options,
      useUpload: true,
      onProgress: (e) => {
        onProgress(e.loaded / e.total, e)
      },
      onAbortPossible: (abortHandler) => {
        abort = abortHandler
      },
    }),
  }).then(({ data, error }) => {
    if (error)
      onError(error)

    else if (data)
      onSuccess(data)
  })

  return {
    abort() {
      abort()
    },
  }
}
</script>

<template>
  <div class="p-2 min-h-full flex flex-col">
    <div class="mb-2 bg-white dark:bg-dark-950 shadow-none shadow-gray-200 dark:shadow-gray-900">
      <a-breadcrumb class="p-2">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>List</a-breadcrumb-item>
        <a-breadcrumb-item>App</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="bg-white dark:bg-dark-950 p-2 min-h-full flex-1 shadow-none shadow-gray-200 dark:shadow-gray-900">
      <p>
        <em text-sm opacity-75>{{ t('intro.desc') }}</em>
      </p>
      <a-upload list-type="picture" :custom-request="customRequest" />
      <a-date-picker style="width: 200px;" />

      <div class="mt-1">
        <a-table
          size="medium" :scrollbar="false" :columns="columns"
          :scroll="{ x: smAndSmaller ? (windowWidth + 200) : '100%', y: 900 }" :data="allPlaces" :loading="fetching"
          :pagination="{ total, pageSize, showPageSize: true, pageSizeOptions: [5, 10, 20], size: 'small' }"
          @page-size-change="(val) => { pageSize = val; variables.input.pagination.size = val }" @change="handleChange"
        >
          <template #name-filter="{ filterValue, setFilterValue, handleFilterConfirm, handleFilterReset }">
            <div class="custom-filter bg-white dark:bg-zinc-900 p-2 shadow border dark:border-zinc-950">
              <a-space direction="vertical">
                <a-input size="small" :model-value="filterValue[0]" @input="(value) => setFilterValue([value])" />
                <div class="custom-filter-footer flex justify-between">
                  <a-button size="mini" type="primary" @click="handleFilterConfirm">
                    Confirm
                  </a-button>
                  <a-button size="mini" @click="handleFilterReset">
                    Reset
                  </a-button>
                </div>
              </a-space>
            </div>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  requiresAuth: true
  adminSidebar:
    parentTitle: Dashboard
    title: Real Time
    link: /admin/
    order: 0
    parentIcon: i-carbon-dashboard
    icon: i-carbon-screen
    childOf: null
    hidden: false
</route>
