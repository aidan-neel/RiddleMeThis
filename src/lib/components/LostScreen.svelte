<script>
    import { Button } from "./ui/button";
    import { fade, fly } from "svelte/transition";

    export let riddle;
    export let answers;
    export let closeFunction;
</script>

<main transition:fade={{ delay: 0, duration: 250 }} class="absolute dark z-20 top-0 left-0 flex items-center justify-center h-screen w-screen backdrop-blur-md bg-black/50">
    <div transition:fly={{y: 20, duration: 150}} class="fade-up p-4 text-white max-w-[32rem] bg-zinc-950 border border-zinc-800 rounded-lg">
        <header class="font-bold text-lg flex items-center justify-between">
            <span>
                Sorry! You lost
            </span>
        </header>
        
        {#if answers && riddle}
        <div class="flex flex-col mt-2">
            <div class="flex flex-row text-zinc-200">
                <h1 class="font-bold w-[5.5rem] mr-2 ">
                    RIDDLE:
                </h1>
                <p class="text-base">
                    {riddle}
                </p>
            </div>
            <div class="flex flex-row text-zinc-200">
                <h1 class="font-bold w-[5rem] mr-2 ">
                    ANSWER:
                </h1>
                <p class="text-base ">
                    {answers.join(", ")}
                </p>
            </div>
        </div>
        {/if}

        <Button on:click={closeFunction} class="w-full mt-4">
            Close
        </Button>
    </div>
</main>