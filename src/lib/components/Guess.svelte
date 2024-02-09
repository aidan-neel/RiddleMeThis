<script>
    import { Check } from "radix-icons-svelte";
    import { Cross1 } from "radix-icons-svelte";
    import 'animate.css'

    export let guessContent;
    export let guessIsCorrect;
</script>

<div class="w-full fade-up {guessIsCorrect ? 'bg-green-500/10' : 'bg-red-500/10'} border border-zinc-800 mt-2 rounded-md shadow-sm p-2 flex items-center justify-between">
    <div class="w-full">
        <p class="font-mono text-zinc-400 text-xs">
            YOUR GUESS
        </p>
        <p class="ml-0.5 ">
            {guessContent}
        </p>
    </div>

    <div class="h-6 w-6 mr-2 flex items-center flex-shrink-0 justify-center rounded-full border {guessIsCorrect ? 'border-green-600/40' : 'border-red-600/40'} p-1">
        {#if guessIsCorrect}
            <Check class="text-green-500 h-full w-full" />
        {:else}
            <Cross1 class="text-red-500 h-full w-full" />
        {/if}
    </div>
</div>