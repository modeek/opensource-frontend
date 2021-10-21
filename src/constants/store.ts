import { observable, action } from 'mobx';
import { useStaticRendering } from 'mobx-react';
import { useMemo } from 'react';
import { persist, create } from 'mobx-persist';

// import clientPersist from 'client-persist';

const isServer = typeof window === 'undefined';
// eslint-disable-next-line react-hooks/rules-of-hooks
useStaticRendering(isServer);

type SerializedStore = {
	address: any | undefined;
	items: Array<any>;
	creationCode: string;
	authToken: string;
};

let store: DataStore;

export class DataStore {
	@persist('object')
	@observable
	address: any | undefined;

	@persist('object')
	@observable
	items: Array<any> = [];

	@persist('object')
	@observable
	creationCode = '';

	@persist('object')
	@observable
	authToken = '';

	hydrate =
		(isServer &&
			((serializedStore: SerializedStore) => {
				if (!serializedStore) {
					return;
				}
				this.address = serializedStore.address || {};
				this.items = serializedStore.items;
			})) ||
		create({
			// storage: clientPersist,
			jsonify: true,
		});

	@action changeAddress(newAddress: any) {
		this.address = newAddress;
	}

	@action changeItems(newItems: any) {
		this.items = newItems;
	}

	@action setCreationCode(str: any) {
		this.creationCode = str;
	}

	@action setAuthToken(str: any) {
		this.authToken = str;
	}
}

function initializeStore(initialData: SerializedStore | null = null) {
	// clientPersist.setDriver(clientPersist.SESSIONSTORAGE);

	const _store = store ?? new DataStore();
	console.log(initialData);

	if (isServer) {
		if (initialData) {
			// @ts-ignore
			_store.hydrate(initialData);
		}
	} else {
		// @ts-ignore
		_store.hydrate('store', _store);
	}

	// For SSG and SSR always create a new store
	if (typeof window === 'undefined') return _store;
	// Create the store once in the client
	if (!store) store = _store;

	return _store;
}

export function useStore(initialState: SerializedStore) {
	const store = useMemo(() => initializeStore(initialState), [initialState]);
	return store;
}
