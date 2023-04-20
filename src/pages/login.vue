<script setup lang="ts">
import { useMutation } from '@urql/vue'
import { isAuthenticated, refreshToken, token } from '~/common/stores'

const router = useRouter()
const { message } = useMessage()
const { t } = useI18n()
const variables = reactive({
  input: { password: '0000', username: 'weskhaled' },
})
const querySignIn = `
    mutation SignIn($input: SignInInput!) {
      signIn(input: $input) {
        refreshToken
        accessToken
      }
  }`
// const querySignIn = graphql`
//     mutation SignIn($input: SignInInput!) {
//       signIn(input: $input) {
//         refreshToken
//         accessToken
//       }
//   }`

const loginResult = useMutation(querySignIn)

async function login() {
  loginResult.executeMutation(variables).then(async ({ data, error }) => {
    if (data) {
      refreshToken.value = data.signIn.refreshToken
      token.value = data.signIn.accessToken
      await router.push('/')
    }

    error && (message.error({
      content: error.graphQLErrors[0]?.message || t('unauthorized'),
      duration: 2000,
    }))
  })
}
onMounted(() => {
  isAuthenticated.value && router.push({ name: 'index' })
})
</script>

<template>
  <h1>WesKhaled</h1>
  <a-button class="btn" @click="login()">
    Login
  </a-button>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
