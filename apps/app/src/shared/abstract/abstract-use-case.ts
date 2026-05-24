import {QueryClient} from '@tanstack/react-query';

export abstract class AbstractUseCase {
    protected _queryClient: QueryClient;

    constructor() {
        this._queryClient = new QueryClient();
    }

    protected _doAction(action: () => void): void {
        action();
    }
}
