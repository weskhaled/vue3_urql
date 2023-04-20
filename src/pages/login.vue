<script setup lang="ts">
import { useMutation } from '@urql/vue'
import { isAuthenticated, refreshToken, token } from '~/common/stores'

const router = useRouter()
const { message } = useMessage()
const { t } = useI18n()
const currentYear = useDateFormat(useNow(), 'YYYY')

const loginLoading = ref(false)
const loginFormRef = ref()
const querySignIn = `
    mutation SignIn($input: SignInInput!) {
      signIn(input: $input) {
        refreshToken
        accessToken
      }
  }`
const loginResult = useMutation(querySignIn)
const form = reactive({
  username: 'weskhaled',
  password: '0000',
  rememberMe: false,
})
function handleSubmit({ values, errors }) {
  if (!errors) {
    loginLoading.value = true
    const params = reactivePick(values, 'username', 'password')
    loginResult.executeMutation({ input: params }).then(async ({ data, error }) => {
      if (data) {
        refreshToken.value = data.signIn.refreshToken
        token.value = data.signIn.accessToken
        await router.push('/')
      }

      error && (message.error({
        content: error.graphQLErrors[0]?.message || t('unauthorized'),
        duration: 2000,
      }))
      loginLoading.value = false
    })
  }
}

// const querySignIn = graphql`
//     mutation SignIn($input: SignInInput!) {
//       signIn(input: $input) {
//         refreshToken
//         accessToken
//       }
//   }`

onMounted(() => {
  isAuthenticated.value && router.push({ name: 'index' })
})
</script>

<template>
  <!-- Example -->
  <div class="flex min-h-screen">
    <!-- Container -->
    <div class="flex flex-row w-full">
      <!-- Sidebar -->
      <div class="hidden lg:flex flex-col justify-between bg-[#00aaff] lg:p-8 xl:p-12 lg:max-w-sm xl:max-w-1/2 text-white">
        <div class="flex items-center justify-start space-x-3">
          <span class="bg-white rounded-full w-8 h-8" />
          <a href="#" class="font-medium text-3xl font-lobster">Webrand</a>
        </div>
        <div class="space-y-5">
          <h1 class="lg:text-3xl xl:text-5xl xl:leading-snug font-extrabold">
            Enter your account and discover new
            experiences
          </h1>
          <p class="text-lg">
            You do not have an account?
          </p>
          <a-button type="primary" size="large">
            Create account here
          </a-button>
        </div>
        <p class="font-medium">
          © {{ currentYear }} Webrand with Love
        </p>
      </div>

      <!-- Login -->
      <div class="flex flex-1 flex-col items-center justify-center px-10 relative">
        <div class="flex lg:hidden justify-between items-center w-full py-4">
          <div class="flex items-center justify-start space-x-3">
            <span class="bg-black rounded-full w-8 h-8" />
            <a href="#" class="font-medium text-3xl font-lobster">Webrand</a>
          </div>
          <div class="flex items-center space-x-2">
            <span>Not a member? </span>
            <a href="#" class="underline font-medium text-[#070eff]">
              Sign up now
            </a>
          </div>
        </div>
        <!-- Login box -->
        <div class="flex flex-1 flex-col justify-center space-y-5 max-w-md">
          <div class="flex flex-col space-y-2 text-center">
            <h2 class="text-4xl md:text-4xl font-bold mt-8 font-mono">
              Sign in to account
            </h2>
          </div>
          <div class="flex flex-col max-w-md space-y-5">
            <a-form ref="loginFormRef" :model="form" :style="{ width: '100%' }" layout="vertical" @submit="handleSubmit">
              <a-form-item
                label="Username"
                field="username" :rules="[{ required: true, message: 'name is required' }, { minLength: 5, message: 'must be greater than 5 characters' }]"
                :validate-trigger="['change', 'input']"
              >
                <a-input
                  v-model="form.username"
                  placeholder="please enter your username..."
                />
              </a-form-item>
              <a-form-item
                label="Password"
                field="password" :rules="[{ required: true, message: 'name is required' }, { minLength: 4, message: 'must be greater than 4 characters' }]"
                :validate-trigger="['change', 'input']"
              >
                <a-input-password v-model="form.password" placeholder="please enter your password" />
              </a-form-item>
              <a-form-item field="rememberMe">
                <a-checkbox v-model="form.rememberMe">
                  Remember me
                </a-checkbox>
              </a-form-item>
              <a-form-item class="!mb-0">
                <a-button :loading="loginLoading" long type="primary" html-type="submit">
                  Login
                </a-button>
              </a-form-item>
            </a-form>
            <div class="flex justify-center items-center">
              <span class="w-full border-1px border-gray-200" />
              <span class="px-4">Or</span>
              <span class="w-full border-1px border-gray-200" />
            </div>
            <a-button type="outline" size="large" shape="round" @click="() => $message.error('This is an error message!')">
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 262"><path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" /><path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" /><path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" /><path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" /></svg>
              </template>
              <!-- Use the default slot to avoid extra spaces -->
              <template #default>
                <span>Sign in with Google</span>
              </template>
            </a-button>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-center flex-col m-auto mb-5 text-center text-lg dark:text-slate-200 ">
          <div class="flex items-center justify-center space-x-4 mt-5 flex-wrap">
            <a-button type="text" size="large" shape="circle">
              <span class="i-carbon-logo-github block w-5 h-5" />
            </a-button>
            <a-button type="text" size="large" shape="circle">
              <span class="i-carbon-logo-linkedin block w-5 h-5" />
            </a-button>
            <a-button type="text" size="large" shape="circle">
              <span class="i-carbon-logo-facebook block w-5 h-5" />
            </a-button>
            <a-button type="text" size="large" shape="circle">
              <span class="i-carbon-logo-twitter block w-5 h-5" />
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: default
</route>
