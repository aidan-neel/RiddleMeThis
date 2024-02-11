<script>
    import { Button } from "./ui/button";
    import { fade, fly } from "svelte/transition";

    export let riddle;
    export let answers;
    export let closeFunction;
    export let guessesAmount;
</script>

<main transition:fade={{ delay: 0, duration: 250 }} class="absolute dark z-20 top-0 left-0 flex items-center justify-center h-screen w-screen backdrop-blur-md bg-black/50">
    <div transition:fly={{y: 20, duration: 150}} class="fade-up w-[95%] lg:min-w-[32rem] p-6 text-white max-w-[32rem] bg-zinc-950 border border-zinc-800 rounded-lg">
        <header class="font-semibold text-lg flex items-start justify-between flex-col">
            <p class="font-mono text-xs text-zinc-500 mb-2">
                DIDN'T SOLVE RIDDLE
            </p>
            <span>
                Uh oh... You failed to solve the riddle!
            </span>
        </header>
        
        {#if answers && riddle}
        <div class="flex flex-col mt-2">
            <p >
                GUESSES: {guessesAmount}/6
            </p>
            <p>
                ANSWER: {answers}
            </p>
        </div>
        {/if}

        <div class="w-full flex items-center justify-end mt-4">
            <Button on:click={closeFunction} class="w-24">
                Close
            </Button>
        </div>
    </div>
</main>