<script>
  import { _ } from "svelte-i18n";
  import Input from "../components/Input.svelte";
  import Spinner from "../components/Spinner.svelte";
  import { signup } from "../api/apiCalls";

  let disabled = true;
  let form = {
    username: "", 
    email: "",
    password: "", 
    passwordRepeat: ""
  };
  let errors = {};
  let passwordMismatch = false;

  $: disabled = form.password && form.passwordRepeat ? form.password !== form.passwordRepeat : true;
  $: passwordMismatch = form.password !== form.passwordRepeat;

  let apiProgress,
    signUpSuccess = false;

  const submit = async () => {
    apiProgress = true;
    const { username, email, password } = form;
    try {
      await signup({ username, email, password });
      signUpSuccess = true;
    } catch (error) {
      if (error.response.status === 400) {
          errors = error.response.data.validationErrors;
        }
        apiProgress = false;
    }
  };

  const onChange = (event) => {
    const { id, value } = event.target;
    form[id] = value;
    errors[id] = "";
  };

  const changeLanguage = (language) => {
    
  }
</script>

<div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2" data-testid="signup-page">
  {#if !signUpSuccess}
    <form class="card mt-5" data-testid="form-sign-up">
      <div class="card-header">
        <h1 class="text-center">{$_("signUp")}</h1>
      </div>
      <div class="card-body">
        <Input
          id="username"
          label={$_("username")}
          help={errors?.username}
          on:input={onChange}
        />
        <Input
          id="email"
          label={$_("email")}
          help={errors?.email}
          on:input={onChange}
        />
        <Input
          id="password"
          label={$_("password")}
          help={errors?.password}
          on:input={onChange}
          type="password"
        />
        <Input
          id="passwordRepeat"
          label={$_("passwordRepeat")}
          help={passwordMismatch ? $_("passwordMismatchValidation") : ""}
          on:input={onChange}
          type="password"
        />
        <div class="text-center">
          <button
            class="btn btn-primary"
            disabled={disabled || apiProgress}
            on:click|preventDefault={submit}
          >
            {#if apiProgress}
              <Spinner />
            {/if}

            {$_("signUp")}</button
          >
        </div>
      </div>
    </form>
  {:else}
    <div class="alert alert-success">
      Please check your e-mail to activate your account
    </div>
  {/if}
</div>
