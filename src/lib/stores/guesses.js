import { writable } from 'svelte/store';
import { onMount } from 'svelte';

export const guesses = writable([]);
export const totalGuesses = writable(0);

export async function addGuess(guess, correct) {
    console.log('Adding guess:', guess);
    const newGuessData = {
        guess: guess,
        date: new Date().toISOString(), // ISO string format
        correct: correct,
        day: 1
    };

    guesses.update(currentGuesses => {
        // Ensure currentGuesses is always treated as an array
        const validGuesses = Array.isArray(currentGuesses) ? currentGuesses : [];
        const updatedGuesses = [...validGuesses, newGuessData];
        
        // Sort updatedGuesses by date in ascending order
        updatedGuesses.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Save the sorted array to localStorage
        localStorage.setItem('guesses', JSON.stringify(updatedGuesses));
        return updatedGuesses;
    });
    
    let newTotal = 0;

    totalGuesses.update(currentTotal => {
        newTotal = currentTotal + 1;
        localStorage.setItem('totalGuesses', newTotal);
        console.log(currentTotal)
    });

    totalGuesses.set(newTotal);
}
