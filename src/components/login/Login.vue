<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { LoginProvider, MUTATION_TYPE } from "../../types";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
} from "firebase/auth";

export default defineComponent({
  data() {
    return {
      chosePassword: false,
      choseRegister: false,
      email: "",
      password: "",
      password_second: "",
      loginError: "",
    };
  },
  methods: {
    returnToMenu: function () {
      this.chosePassword = false;
      this.choseRegister = false;
    },
    mapErrorToMessage: function (errorCode: string) {
      switch (errorCode) {
        case "auth/invalid-email":
          return "Provided email is invalid";
        case "auth/user-not-found":
        case "auth/wrong-password":
          return "Provided email or password is invalid";
        default:
          return errorCode;
      }
    },
    registerWithPassword: function () {
      if (this.password != this.password_second) {
        this.loginError = "Passwords must be the same";
        return;
      }
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          this.$store.commit(MUTATION_TYPE.setUser, user);

          // ...
        })
        .catch((error) => {
          this.loginError = this.mapErrorToMessage(error.code);
        });
    },
    loginWithPassword: function () {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(userCredential);
          this.$store.commit(MUTATION_TYPE.setUser, user);

          // ...
        })
        .catch((error) => {
          this.loginError = this.mapErrorToMessage(error.code);
        });
    },
    loginWithPopup: function (loginProvider: LoginProvider) {
      let provider = null;
      switch (loginProvider) {
        case "GOOGLE":
          provider = new GoogleAuthProvider();
          break;
      }
      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          // The signed-in user info.
          const user = result.user;
          this.$store.commit(MUTATION_TYPE.setUser, user);
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    },
    loginAsGuest: () => {
      const auth = getAuth();
      signInAnonymously(auth)
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ...
        });
    },
  },
});
</script>
<template>
  <div class="signin-methods">
    <h1>Warlords Online</h1>
    <div class="login" v-if="!chosePassword && !choseRegister">
      <img
        @click="chosePassword = true"
        src="../../assets/signin/password/login_normal.png"
        id="email-login"
        class="login-button"
      />
      <img
        @click="loginWithPopup('GOOGLE')"
        src="../../assets/signin/google/btn_google_signin_dark_normal_web.png"
        id="google-login"
        class="login-button"
      />
      <img
        @click="loginAsGuest()"
        src="../../assets/signin/guest/login_normal.png"
        id="guest-login"
        class="login-button"
      />
    </div>

    <div v-else-if="choseRegister">
      <h3>{{ loginError }}</h3>

      <input placeholder="email" type="email" name="email" v-model="email" />
      <input
        placeholder="password"
        type="password"
        name="password"
        v-model="password"
      />
      <input
        placeholder="repeat password"
        type="password"
        name="password"
        v-model="password_second"
      />
      <button id="login-email-button" @click="registerWithPassword()">
        Register with E-mail
      </button>
      <button id="return-button" @click="returnToMenu()">return</button>
    </div>
    <!--



    -->
    <div v-else-if="chosePassword" class="login-email">
      <h3>{{ loginError }}</h3>
      <input placeholder="email" type="email" name="email" v-model="email" />
      <input
        placeholder="password"
        type="password"
        name="password"
        v-model="password"
      />
      <button id="login-email-button" @click="loginWithPassword()">
        Login with E-mail
      </button>
      <p
        @click="
          choseRegister = true;
          chosePassword = false;
        "
      >
        or create an account
      </p>
      <button id="return-button" @click="returnToMenu()">return</button>
    </div>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  font-size: 100px;
}
h3 {
  color: rgb(155, 1, 1);
}

p {
  margin: 10px;
  text-align: center;
}
.signin-methods {
  position: relative;
  width: 1024px;
  height: 720px;
  border: 1px solid black;
}
.signin-methods > div {
  position: absolute;
  z-index: 10;
  display: grid;
  border: 3px solid green;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 2px;
}

.login-button:hover {
  filter: brightness(70%);
}
.login-email {
  padding: 100px;
}
input,
#login-email-button {
  padding: 4px 16px;
  height: 30px;
  margin: 10px;
  border: 1px solid gray;
  border-radius: 4px;
}

#login-email-button {
  background: #97a8f5;
}
#login-email-button:hover {
  background: #97a8f5;
}
</style>
