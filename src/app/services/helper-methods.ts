/**
 * Waits for a specified number of milliseconds before resolving the promise.
 * @param ms 
 * @returns 
 */
export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}