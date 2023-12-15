import { ApplicationConfig, Provider, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  FirebaseApp,
  provideFirebaseApp,
  initializeApp as initializeFirebaseApp
} from '@angular/fire/app';
import {
  Firestore,
  provideFirestore,
  initializeFirestore,
  setLogLevel
} from '@angular/fire/firestore';

import { FIREBASE_OPTIONS, FIREBASE_APP_NAME } from '@angular/fire/compat';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyByj3L9gP2MCOYSi_KC_KL-0Pjiy7D6CkA",
  authDomain: "inventory-1a12e.firebaseapp.com",
  projectId: "inventory-1a12e",
  storageBucket: "inventory-1a12e.appspot.com",
  messagingSenderId: "249538779584",
  appId: "1:249538779584:web:429f1ad6ecb232b588d025"
};


const initializeApp = (
  firestore: Firestore,
) => {
  return () => {
      setLogLevel('debug');
      return Promise.resolve();
  };
};

const AppInitializerProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializeApp,
  deps: [Firestore],
  multi: true,
};

const FirebaseAppProviders = provideFirebaseApp(
  (injector) => {
      const options = injector.get(FIREBASE_OPTIONS);
      return initializeFirebaseApp(options);
  },
  [FIREBASE_OPTIONS]
);

const FirebaseFirestoreProviders = provideFirestore(
  (injector) => {
      const firebase = injector.get(FirebaseApp);
      const firestore = initializeFirestore(firebase, {
          experimentalForceLongPolling: true,
      });
      return firestore;
  },
);

const FirebaseOptionsProvider: Provider = {
  provide: FIREBASE_OPTIONS,
  useFactory: () => firebaseConfig,
  deps: [],
};

const FirebaseAppNameProvider: Provider = {
  provide: FIREBASE_APP_NAME,
  useFactory: () => firebaseConfig.projectId,
  deps: [],
};

export const appConfig: ApplicationConfig = {
  providers: [
    AppInitializerProvider,
    provideRouter(routes),
    importProvidersFrom([FirebaseAppProviders, FirebaseFirestoreProviders, BrowserAnimationsModule]),
    FirebaseOptionsProvider,
    FirebaseAppNameProvider
  ]
};
