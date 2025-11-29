export type TValues<T extends object> = T extends readonly unknown[] ? T[number] : T[keyof T];

export type TpartialByKey<T, K extends keyof T> = Omit<T, K> & {[P in K]?: T[P]};
