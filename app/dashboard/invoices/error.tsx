'use client'

import { useEffect } from "react";

interface Props {
    error: Error & { digest?: string};
    reset: () => void;
}

export default function Error ({error, reset}: Props) {
    useEffect(() => {
        console.log(error);
    }, [error]);
    return (
        <main className="flex h-full flex-col items-center justify-center"> 
            <h2 className="text-center">Something went wrong!</h2>
            <button className="mt-4 rounder-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400" onClick={() => reset()}>Try again </button>
        </main>
    )
}