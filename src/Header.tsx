import { getAuth, onAuthStateChanged, signOut, User } from "@firebase/auth";
import * as React from "react";

interface HeaderAuthLoading {
  type: 0;
}

interface HeaderAuthEmpty {
  type: 1;
}

interface HeaderAuthUser {
  type: 2;
  user: User;
}

type HeaderAuthState = HeaderAuthLoading | HeaderAuthEmpty | HeaderAuthUser;

export const Header = () => {
  const [headerAuthState, setHeaderAuthState] = React.useState<HeaderAuthState>(
    { type: 0 }
  );

  React.useEffect(() => {
    onAuthStateChanged(getAuth(), (user: User | null) => {
      if (user === null) {
        setHeaderAuthState({ type: 1 });
      } else {
        setHeaderAuthState({ type: 2, user });
      }
    });
  }, []);

  const handleSignOut = React.useCallback(() => {
    signOut(getAuth());
  }, []);

  const renderAuthInfo = () => {
    switch (headerAuthState.type) {
      case 0: {
        return <div>Загрузка...</div>;
      }
      case 1: {
        return <div>Режим гостя</div>;
      }
      case 2: {
        return (
          <>
            <span style={{ marginRight: '.25rem' }}>Привет снова, {headerAuthState.user.email}</span>
            <button type="button" onClick={handleSignOut}>
              Выйти из системы
            </button>
          </>
        );
      }
    }
  };

  return (
    <div style={{ paddingBottom: "1rem", borderBottom: "1px solid black" }}>
      {renderAuthInfo()}
    </div>
  );
};
