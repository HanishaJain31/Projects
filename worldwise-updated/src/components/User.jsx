import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";
import styles from "./User.module.css";


function User() {
  const {user, logout} = useAuth();
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  function handleLogout() {
    logout()
    navigate('/', {replace: true})
  }

  return (
    <>
      <div className={styles.user}>
        <img src={user.avatar} alt={user.name} />
        <span>Welcome, {user.name}</span>
        <button onClick={() => setIsConfirmOpen(true)}>Logout</button>
      </div>

      {isConfirmOpen && (
        <div className={styles.overlay} role="presentation">
          <div
            className={styles.confirmBox}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
          >
            <h2 id="logout-title">Log out?</h2>
            <p>Are you sure you want to end your WorldWise session?</p>
            <div className={styles.actions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsConfirmOpen(false)}
              >
                Cancel
              </button>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default User;

/*
CHALLENGE

1) Add `AuthProvider` to `App.jsx`
2) In the `Login.jsx` page, call `login()` from context
3) Inside an effect, check whether `isAuthenticated === true`. If so, programatically navigate to `/app`
4) In `User.js`, read and display logged in user from context (`user` object). Then include this component in `AppLayout.js`
5) Handle logout button by calling `logout()` and navigating back to `/`
*/
