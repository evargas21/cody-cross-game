import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

export default function App() {
    const [targetWord, setTargetWord] = useState('');
    const [guesses, setGuesses] = useState<string[]>([]);
    const [wordLength, setWordLength] = useState(5);
    const [currentGuess, setCurrentGuess] = useState('');
    const [gameState, setGameState] = useState<'setting' | 'playing' | 'won' | 'lost'>('setting');

    useEffect(() => {
        setWordLength(targetWord.length);
    }, [targetWord]);

    const handleBackspace = () => {
        setCurrentGuess(prev => prev.slice(0, -1))
    }

    const handleReset = () => {
        setGuesses([]);
        setCurrentGuess('');
        setGameState('setting');
        setTargetWord('');
    };

    const handleTargetWordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (targetWord.length) {
            setGameState('playing');
        }
    };

    const handleGuessSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentGuess.length === targetWord.length && guesses.length < 5) {
            setGuesses([...guesses, currentGuess]);
            setCurrentGuess('');

            if (currentGuess === targetWord) {
                setGameState('won');
            } else if (guesses.length === targetWord.length) {
                setGameState('lost');
            }
        }
    };

    const getLetterClass = (letter: string, index: number) => {
        if (targetWord[index] === letter) {
            return 'bg-green-500';
        } else if (targetWord.includes(letter)) {
            return 'bg-yellow-500';
        }
        return 'bg-gray-300';
    };

    const keyboard = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            {gameState === 'setting' && (
                <form onSubmit={handleTargetWordSubmit} className="flex flex-col w-full md:w-1/2 gap-3 mb-4">
                    <input
                        type="text"
                        value={targetWord}
                        onChange={(e) =>
                            setTargetWord(e.target.value.toUpperCase().replace(/[^A-ZÑ]/g, '').slice(0, 5))
                        }
                        placeholder="Ingresa la palabra objetivo"
                        className={clsx(
                            'block w-full rounded-lg border border-gray-400 bg-white py-2 px-3 text-sm text-black',
                            'focus:outline-none focus:ring-2 focus:ring-gray-200'
                        )}
                    />
                    <button
                        type="submit"
                        disabled={!targetWord.length}
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-700 py-2 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 hover:bg-gray-600 focus:outline-none"
                    >
                        Comenzar juego
                    </button>
                </form>
            )}

            {gameState !== 'setting' && (
                <div className="w-full max-w-md">
                    <div
                        className="grid gap-2 mb-4"
                        style={{ gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))` }}
                    >
                        {Array(5)
                            .fill(null)
                            .map((_, rowIndex) => (
                                guesses[rowIndex]?.split('').map((letter, colIndex) => (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`w-full aspect-square flex items-center justify-center text-2xl font-bold text-white ${getLetterClass(letter, colIndex)}`}
                                    >
                                        {letter}
                                    </div>
                                )) || Array(targetWord.length).fill(null).map((_, colIndex) => (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        className="w-full aspect-square bg-gray-200"
                                    />
                                ))
                            ))}
                    </div>
                    {gameState === 'playing' && (
                        <form onSubmit={handleGuessSubmit} className="flex flex-col gap-3">
                            <div className="flex gap-3 items-center">
                                <input
                                    type="text"
                                    value={currentGuess}
                                    onChange={(e) =>
                                        setCurrentGuess(e.target.value.toUpperCase().replace(/[^A-ZÑ]/g, '').slice(0, wordLength))
                                    }
                                    maxLength={targetWord.length}
                                    placeholder="Ingresa tu intento"
                                    className={clsx(
                                        'block w-full rounded-lg border border-gray-400 bg-white py-2 px-3 text-sm text-black',
                                        'focus:outline-none focus:ring-2 focus:ring-white/25'
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={handleBackspace}
                                    disabled={!currentGuess.length}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-700 py-2 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 hover:bg-gray-600 focus:outline-none"
                                >
                                    Borrar
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={currentGuess.length !== targetWord.length}
                                className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-700 py-2 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 hover:bg-gray-600 focus:outline-none"
                            >
                                Intentar
                            </button>
                        </form>
                    )}

                    {(gameState === 'won' || gameState === 'lost') && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gray-700 py-2 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 hover:bg-gray-600 focus:outline-none"
                        >
                            Reiniciar el juego
                        </button>
                    )}

                    <div className="grid grid-cols-9 gap-1 mt-5">
                        {keyboard.map((letter) => (
                            <button
                                key={letter}
                                onClick={() => setCurrentGuess((prev) => (prev.length < targetWord.length ? prev + letter : prev))}
                                className="bg-black rounded-md text-teal-50 xt-sm p-2"
                            >
                                {letter}
                            </button>
                        ))}
                    </div>

                    {gameState === 'won' && (
                        <div className="mt-4 text-center text-green-600 font-bold">
                            ¡Felicidades! Has adivinado la palabra.
                        </div>
                    )}

                    {gameState === 'lost' && (
                        <div className="mt-4 text-center text-red-600 font-bold">
                            Game over. La palabra era: {targetWord}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
