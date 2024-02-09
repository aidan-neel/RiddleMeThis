<script>
    import { fade, fly } from "svelte/transition";
    import Icon from '@iconify/svelte';
</script>

<main transition:fade={{ delay: 0, duration: 250 }} class="absolute dark z-20 top-0 left-0 flex items-center justify-center h-screen w-screen backdrop-blur-sm bg-black/80">
    <Icon icon="eos-icons:loading" class="text-zinc-400 h-16 w-16 animate-spin" />
</main>