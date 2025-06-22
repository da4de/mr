import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

/**
 * Common local storage service for setting and retrieving values.
 * Also provides key-specific watchers to observe changes to individual entries.
 */
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
    /** Internal map that holds BehaviorSubjects for each watched localStorage key. */
    private localStorageWatcher = new Map<string, BehaviorSubject<string | null>>();

    /**
     * Sets a value in localStorage by the given key.
     * Notifies any watchers subscribed to changes for that key.
     * @param key The localStorage key
     * @param value The value to store
     */
    setItem(key: string, value: string) {
        localStorage.setItem(key, value);
        this.informWatcher(key, value);
    }

    /**
     * Retrieves the value from localStorage by the given key.
     * @param key The localstorage key
     * @returns The stored value as a string, or null if the key does not exist
     */
    getItem(key: string) {
        return localStorage.getItem(key);
    }

    /**
     * Returns a BehaviorSubject that emits value of the given localStorage key.
     * @param key The localStorage key to watch
     * @returns A BehaviourSubject emmiting the value from localStorage
     */
    watch(key: string) {
        if (!this.localStorageWatcher.has(key)) {
            const curValue = this.getItem(key);
            this.localStorageWatcher.set(key, new BehaviorSubject(curValue))
        }
        return this.localStorageWatcher.get(key)!;
    }

    /**
     * Notifies the watcher of a specific localStorage key about a new value.
     * @param key The localStorage key
     * @param value The new value stored in localStorage
     */
    private informWatcher(key: string, value: string | null) {
        if (this.localStorageWatcher.has(key)) {
            this.localStorageWatcher.get(key)?.next(value)
        }
    }
}