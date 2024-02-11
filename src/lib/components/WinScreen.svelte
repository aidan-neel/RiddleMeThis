<script>
    import { Button } from "./ui/button";
    import { fade, fly } from "svelte/transition";
    import { Plus } from "radix-icons-svelte";
    import * as AlertDialog from "./ui/alert-dialog";

    export let riddle;
    export let answers;
    export let closeFunction;
    export let guessesAmount;
    export let correctAnswer;
    export let generateNewRiddleFunction;
</script>

<main transition:fade={{ delay: 0, duration: 250 }} class="absolute dark z-20 top-0 left-0 flex items-center justify-center h-screen w-screen backdrop-blur-md bg-black/50">
    <div transition:fly={{y: 20, duration: 150}} class="fade-up w-[95%] lg:min-w-[32rem] p-6 text-white max-w-[32rem] bg-zinc-950 border border-zinc-800 rounded-lg">
        <header class="font-semibold text-lg flex items-start justify-between flex-col">
            <p class="font-mono text-xs text-zinc-500 mb-2">
                SOLVED RIDDLE
            </p>
            <span>
                Good job! You solved the riddle
            </span>
        </header>
        
        {#if answers && riddle}
        <div class="flex flex-col mt-2">
            <p>
                GUESSES: {guessesAmount}/6
            </p>
            <p>
                ANSWER: {answers}
            </p>
        </div>
        {/if}

        <div class="w-full flex items-center justify-end mt-4 gap-3">
            <Button variant="outline" on:click={closeFunction} class="w-24">
                Close
            </Button>
            <AlertDialog.Root class="dark">
                <AlertDialog.Trigger>
                    <Button>
                    <Plus class="h-5 w-5 mr-1" />
                    <span class="hidden md:flex">New Riddle</span>
                </Button></AlertDialog.Trigger>
                <AlertDialog.Content>
                  <AlertDialog.Header>
                    <p class="font-mono text-xs text-zinc-500">
                        RIDDLE GENERATION
                    </p>
                    <AlertDialog.Title>Create a new riddle</AlertDialog.Title>
                    <AlertDialog.Description>
                      Are you sure you want to create a new riddle? This will delete your previously saved riddle.
                    </AlertDialog.Description>
                  </AlertDialog.Header>
                  <AlertDialog.Footer>
                    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                    <AlertDialog.Action on:click={() => {
                        generateNewRiddleFunction();
                        closeFunction();
                    }}>Continue</AlertDialog.Action>
                  </AlertDialog.Footer>
                </AlertDialog.Content>
              </AlertDialog.Root>
        </div>
    </div>
</main>