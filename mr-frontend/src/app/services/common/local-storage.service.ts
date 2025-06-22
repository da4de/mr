import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
    private localStorageWatcher = new Map<string, BehaviorSubject<string | null>>();

    setItem(key: string, value: string) {
        localStorage.setItem(key, value);
        this.informWatcher(key, value);
    }

    getItem(key: string) {
        return localStorage.getItem(key);
    }

    watch(key: string) {
        if (!this.localStorageWatcher.has(key)) {
            const curValue = this.getItem(key);
            this.localStorageWatcher.set(key, new BehaviorSubject(curValue))
        }
        return this.localStorageWatcher.get(key)!;
    }

    private informWatcher(key: string, value: string | null) {
        if (this.localStorageWatcher.has(key)) {
            this.localStorageWatcher.get(key)?.next(value)
        }
    }
}