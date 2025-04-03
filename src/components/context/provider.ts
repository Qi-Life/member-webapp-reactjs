/* global VoidFunction */
/**
 * This represents some generic auth provider API.
 */
const fakeAppProvider = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    fakeAppProvider.isAuthenticated = true;
    setTimeout(callback, 100); // fake async
  },
  signout(callback: VoidFunction) {
    fakeAppProvider.isAuthenticated = false;
    setTimeout(callback, 100); // fake async
  },
};

export { fakeAppProvider };
