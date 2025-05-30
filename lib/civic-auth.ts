import { useUser } from '@civic/auth-web3/react';

// The global civicAuth instance and getCivicAuth are no longer needed
// as we will use the useUser hook provided by CivicAuthProvider.

export const loginWithCivic = async () => {
  // This function will now be a placeholder or needs to be called from a component context
  // where useUser() can be used. For direct usage here, it's problematic.
  // Consider moving login logic to components or using a different approach if needed outside React components.
  console.warn("loginWithCivic should ideally be triggered from a component context using useUser().signIn()");
  // Placeholder: Actual login will be handled by Civic's UserButton or a custom button using useUser().signIn()
  return Promise.reject("Login must be initiated from a React component using useUser().signIn()");
};

export const logoutFromCivic = async () => {
  // Similar to login, logout should be triggered from a component context.
  console.warn("logoutFromCivic should ideally be triggered from a component context using useUser().signOut()");
  // Placeholder: Actual logout will be handled by Civic's UserButton or a custom button using useUser().signOut()
  return Promise.reject("Logout must be initiated from a React component using useUser().signOut()");
};

export const getUserData = () => {
  // This function also needs to be called from a component context.
  // It's a placeholder to illustrate how you might access user data via the hook.
  console.warn("getUserData should ideally be called from a component context using useUser()");
  // Placeholder: Actual user data access will be through useUser() in a component.
  return null;
};

// Example of how to use the hook within a component (for illustration, not for direct use in this file):
/*
import { useUser } from '@civic/auth-web3/react';

function MyComponent() {
  const { user, signIn, signOut, createWallet, wallet, userHasWallet } = useUser();

  const handleLogin = async () => {
    try {
      await signIn();
      // Potentially create wallet if not present
      if (user && !userHasWallet({ user })) { // Note: userHasWallet might need the full context
        await createWallet();
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  if (!user) {
    return <button onClick={handleLogin}>Login with Civic</button>;
  }

  return (
    <div>
      <p>Welcome, {user.name}</p>
      {wallet && <p>Wallet Address: {wallet.address}</p>}
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
*/