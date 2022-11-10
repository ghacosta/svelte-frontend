<script>
  import { locale } from "svelte-i18n";
</script>

<img src="https://www.countryflagicons.com/SHINY/32/AR.png" alt="Argentinian Flag" title="Español" on:click={() => locale.set("es")} />
<img src="https://www.countryflagicons.com/SHINY/32/US.png" alt="English Flag" title="English" on:click={() => locale.set("en")} />

<style>
  img {
    cursor: pointer;
  }
</style>