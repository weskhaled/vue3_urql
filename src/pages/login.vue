<script setup lang="ts">
import { gql, useMutation } from '@urql/vue'
import { isAuthenticated, refreshToken, token } from '~/common/stores'

const router = useRouter()

const querySignIn = gql`
    mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      refreshToken
      accessToken
    }
  }`

const loginResult = useMutation(querySignIn)

async function login() {
  const variables = {
    input: { password: '0000', username: 'weskhaled' },
  }

  loginResult.executeMutation(variables).then(async ({ data, error }) => {
    if (data) {
      refreshToken.value = data.signIn.refreshToken
      token.value = data.signIn.accessToken
      await router.push('/')
    }
    error && console.log(error)
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
