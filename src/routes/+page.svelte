<script>
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import Guess from "$lib/components/Guess.svelte";
    import { guesses, totalGuesses } from "$lib/stores/guesses.js";
    import { addGuess } from "$lib/stores/guesses.js";
    import { onMount } from "svelte";
    import LostScreen from "$lib/components/LostScreen.svelte";
    import { GithubLogo, InfoCircled, Plus } from "radix-icons-svelte";
    import Loading from "$lib/components/Loading.svelte";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import WinScreen from "$lib/components/WinScreen.svelte";
    import Icon from "@iconify/svelte";

    let searchDropdownVisibility = false;

    let RiddleGuess;
    let loadingGuess = false;
    let lossScreen = false;
    let wonScreen = false;
    let totalGuessesAmount = 0;
    let currentRiddleData = {
        content: undefined,
        answer: undefined,
        hint: undefined
    }

    let userStreak = 0;
    let canGuess = true;

    $: if(totalGuessesAmount === 6) {
        lossScreen = true;
    }
    $: currentGuesses = $guesses.slice().reverse();

    async function GenerateRiddle() {
        currentRiddleData.content = undefined;
        const res = await fetch("/api/riddle_generation");
        const data = await res.json();
        if (data.riddle === undefined) {
            GenerateRiddle();
            return;
        }
        currentRiddleData.content = data.riddle;
        currentRiddleData.answer = data.answer;
        currentRiddleData.hint = data.hint;
        localStorage.setItem('riddle', JSON.stringify(currentRiddleData));
        localStorage.setItem('guesses', JSON.stringify([]));
        localStorage.setItem('canGuess', 'true');
        localStorage.setItem('riddleGuess', "");
        totalGuessesAmount = 0;
        canGuess = true;
        RiddleGuess = "";
        window.location.reload();
    }

    onMount(async() => {
        const savedCanGuess = localStorage.getItem('canGuess');
        if (savedCanGuess) {
            canGuess = JSON.parse(savedCanGuess);
        } else {
            canGuess = true;
        }
        userStreak = Number(localStorage.getItem('streak')) || 0;
        RiddleGuess = localStorage.getItem('riddleGuess') || "";
        const savedRiddle = localStorage.getItem('riddle');
        if (savedRiddle) {
            currentRiddleData = JSON.parse(savedRiddle);
        } else {
            if(currentRiddleData.content === undefined) {
                const res = await fetch('/api/riddle_generation');
                const data = await res.json();
                currentRiddleData.content = data.riddle;
                currentRiddleData.answer = data.answer;
                currentRiddleData.hint = data.hint;
                
                localStorage.setItem('riddle', JSON.stringify(currentRiddleData));
            }
        }

        totalGuessesAmount = JSON.parse(localStorage.getItem('guesses'))?.length || 0;
        // Load guesses from localStorage when the component mounts
        const savedGuesses = localStorage.getItem('guesses');

        if (savedGuesses) {
            guesses.set(JSON.parse(savedGuesses));
        }
        // Subscribe to the guesses store to save updates to localStorage
        const unsubscribe = guesses.subscribe($guesses => {
            localStorage.setItem('guesses', JSON.stringify($guesses));
        });

        // Return a cleanup function to unsubscribe when the component is destroyed
        return () => {
            unsubscribe();
        };
    });

    $: {
        if(currentRiddleData.content) {
            let lastNewLineIndex = currentRiddleData.content.lastIndexOf("\n");
            if (lastNewLineIndex !== -1) {
                currentRiddleData.content = currentRiddleData.content.slice(0, lastNewLineIndex);
            }
        }
    }

    async function CreateGuess() {
        loadingGuess = true;
        if (RiddleGuess) {
            totalGuessesAmount++;
            const res = await fetch(`/api/answer_validation?riddle=${currentRiddleData.content}&answer=${RiddleGuess}&riddleAnswers=${currentRiddleData.answer}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const data = await res.json();
            if (data.correct === true) {
                addGuess(RiddleGuess, true);
                canGuess = false
                localStorage.setItem('canGuess', 'false');
                localStorage.setItem('riddleGuess', RiddleGuess);
                setTimeout(() => {
                    wonScreen = true;
                }, 500);
                localStorage
                userStreak++;
                localStorage.setItem('streak', userStreak);
            } else {
                addGuess(RiddleGuess, false);
                RiddleGuess = "";
                canGuess = true;
            }
            
            if (totalGuessesAmount === 6) {
                canGuess = false;
                localStorage.setItem('canGuess', 'false');
                setTimeout(() => {
                    lossScreen = true;
                }, 500);
                localStorage.setItem('streak', 0);
            }
        }
        loadingGuess = false;
    }
</script>

{#if lossScreen}
    <LostScreen closeFunction={() => {
        lossScreen = false;
    }} riddle={currentRiddleData.content} guessesAmount={totalGuessesAmount} correctAnswer={RiddleGuess} answers={currentRiddleData.answer} />
{/if}

{#if wonScreen}
    <WinScreen closeFunction={() => {
        wonScreen = false;
    }} generateNewRiddleFunction={GenerateRiddle} riddle={currentRiddleData.content} guessesAmount={totalGuessesAmount} correctAnswer={RiddleGuess} answers={currentRiddleData.answer} />
{/if}

{#if currentRiddleData.content === undefined}
    <Loading />
{/if}

<svelte:head>
    <title>
        RiddleMeThis - Riddle Game
    </title>
</svelte:head>

<main class="h-screen w-screen dark bg-zinc-950 text-white flex items-center justify-center">
    <div class='absolute bottom-20 fade-up flex flex-col-reverse w-full items-center justify-center gap-3'>
        <h1 class="fade-up w-full px-2 text-center text-xs text-zinc-500">
            ChatGPT can hallucinate, not every riddle has a sensible answer, or may even be solvable. <br> If you're stuck, you can generate a new riddle. Some riddles don't contain all the text, so you may need to re-generate.
        </h1>    
        <div class="flex flex-row gap-3">
            <Button href="https://github.com/aidan-neel/RiddleMeThis" variant="outline" size="icon">
                <GithubLogo />
            </Button>
            <AlertDialog.Root class="dark">
                <AlertDialog.Trigger>        
                <Button variant="outline" size="icon">
                    <InfoCircled />
                </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content>
                  <AlertDialog.Header>
                    <p class="font-mono text-xs text-zinc-500">
                        ABOUT THIS PROJECT
                    </p>
                    <AlertDialog.Title>About this project</AlertDialog.Title>
                    <AlertDialog.Description>
                      This is a simple riddle game designed to keep you sharp. It uses a dataset of 1000+ riddles to pick a random one, and then ChatGPT validates your answer to determine if it is close enough so you don't have to say the exact same answer.
                      <br><br>
                      It has its limitations, and some riddles may not be solvable. If you're stuck, you can generate a new riddle. I plan to continue updating this and add some neat features like sharing, and a leaderboard.
                    </AlertDialog.Description>
                  </AlertDialog.Header>
                  <AlertDialog.Footer>
                    <AlertDialog.Cancel>Close</AlertDialog.Cancel>
                  </AlertDialog.Footer>
                </AlertDialog.Content>
              </AlertDialog.Root>
        </div>
    </div>

    <div class="h-screen w-[90%] md:w-1/2 lg:w-1/2 xl:w-1/3 2xl:w-1/4 pt-12">
        <header class="text-white dark fade-up flex items-center justify-between">
            <div>
                <h1 class="font-bold text-lg">
                    RiddleMeThis
                </h1>
                <p class="text-sm mt-1">
                    A random riddle game designed to keep you sharp
                </p>
            </div>

            <AlertDialog.Root class="dark">
                <AlertDialog.Trigger><Button>
                    <Plus class="h-5 w-5 md:mr-1" />
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
                    <AlertDialog.Action on:click={GenerateRiddle}>Continue</AlertDialog.Action>
                  </AlertDialog.Footer>
                </AlertDialog.Content>
              </AlertDialog.Root>
        </header>
        
        <p class="font-mono mt-4 text-sm pt-4 border-t fade-up flex justify-between">
            <span>CURRENT RIDDLE</span><span class="text-sm">
                {totalGuessesAmount}/6 GUESSES
            </span>
        </p>
        <p class='fade-up mt-1 text-lg whitespace-pre-wrap'>
            {#if currentRiddleData.content !== undefined}
                {currentRiddleData.content}
            {:else}
                Loading a riddle for you...
            {/if}
        </p>

        <div class="w-full flex items-center justify-between">
            <button on:click={() => {
                canGuess = false;
                localStorage.setItem('canGuess', 'false');
                totalGuessesAmount = 6;
            }} class="fade-up mt-2 text-sm text-zinc-500">
                SHOW ANSWER
            </button>   
            
            <p class="text-sm mt-2 fade-up text-zinc-500">
                STREAK: {userStreak}
            </p>
        </div>
        <form on:submit|preventDefault={CreateGuess} class="flex flex-row items-center justify-center mt-3 mb-3 fade-up">
        {#if canGuess}
            <Input bind:value={RiddleGuess} type="text" placeholder="What do you think?" class="placeholder:text-zinc-500 h-10 text-base focus:outline-0 focus:ring-0 font-mono" />
                {#if loadingGuess}
                    <Button disabled type="submit" class="h-10 w-32 ml-2 hover:cursor-not-allowed">
                        <Icon icon="eos-icons:loading" class="text-zinc-400 h-6 w-6 mr-1 fade-in" />
                        Guess
                    </Button>
                {:else}
                <Button type="submit" class="h-10 w-32 ml-2">
                    Guess
                </Button>
                {/if}
                
        {:else}
            <Input disabled bind:value={RiddleGuess} type="text" placeholder="What do you think?" class="placeholder:text-zinc-500 h-12 text-base focus:outline-0 focus:ring-0 font-mono" />
            <Button disabled type="submit" class="h-12 ml-2  hover:cursor-not-allowed">
                Guess
            </Button>
        {/if}
        </form>
        {#each currentGuesses as guess}
            <Guess guessContent={guess.guess} guessIsCorrect={guess.correct} />
        {/each}
    </div>
</main>