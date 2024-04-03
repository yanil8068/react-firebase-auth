import FullPageLoader from "../components/FullPageLoader.jsx";
import { useState } from "react";
import { auth } from "../firebase/config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../store/usersSlice.js";

function LoginPage() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [loginType, setLoginType] = useState("login");
  const [userCredentials, setUserCredentials] = useState({});
  const [error, setError] = useState("");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      dispatch(setUser({ id: user.uid, email: user.email }));
      //const uid = user.uid;
      // ...
    } else {
      dispatch(setUser(null));
      // User is signed out
      // ...
    }
    if (isLoading) {
      setIsLoading(false);
    }
  });

  function handleCredentials(e) {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
    //console.log(userCredentials);
  }
  function handleSignup(e) {
    e.preventDefault();
    setError("");

    createUserWithEmailAndPassword(
      auth,
      userCredentials.email,
      userCredentials.password
    )
      // .then((userCredential) => {
      // Signed up
      //   console.log(userCredential.user);
      //  dispatch(
      //  setUser({
      //    id: userCredential.user.uid,
      //   email: userCredential.user.email,
      //  })
      //  );
      // console.log(user);
      // ...
      //  })
      .catch((error) => {
        //const errorCode = error.code;
        //const errorMessage = error.message;
        setError(error.message);
        //console.log(errorCode);
        // console.log(errorMessage);
        // ..
      });
  }

  function handleLogin(e) {
    e.preventDefault();
    setError("");
    signInWithEmailAndPassword(
      auth,
      userCredentials.email,
      userCredentials.password
    )
      // .then((userCredential) => {
      //   // Signed in
      //   console.log(userCredential.user);
      //   dispatch(
      //     setUser({
      //       id: userCredential.user.uid,
      //       email: userCredential.user.email,
      //     })
      //   );
      //   // ...
      // })
      .catch((error) => {
        setError(error.message);
      });
  }

  function handlePasswordReset(e) {
    const email = prompt("Please enter your email");
    sendPasswordResetEmail(auth, email);
    alert("Email sent! Check your inbox for password reset instructions");
  }

  return (
    <>
      {isLoading && <FullPageLoader></FullPageLoader>}

      <div className="container login-page">
        <section>
          <h1>Welcome to the Book App</h1>
          <p>Login or create an account to continue</p>
          <div className="login-type">
            <button
              className={`btn ${loginType == "login" ? "selected" : ""}`}
              onClick={() => setLoginType("login")}
            >
              Login
            </button>
            <button
              className={`btn ${loginType == "signup" ? "selected" : ""}`}
              onClick={() => setLoginType("signup")}
            >
              Signup
            </button>
          </div>
          <form className="add-form login">
            <div className="form-control">
              <label>Email *</label>
              <input
                onChange={(e) => {
                  handleCredentials(e);
                }}
                type="text"
                name="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="form-control">
              <label>Password *</label>
              <input
                onChange={(e) => {
                  handleCredentials(e);
                }}
                type="password"
                name="password"
                placeholder="Enter your password"
              />
            </div>
            {loginType == "login" ? (
              <button
                onClick={(e) => {
                  handleLogin(e);
                }}
                className="active btn btn-block"
              >
                Login
              </button>
            ) : (
              <button
                onClick={(e) => {
                  handleSignup(e);
                }}
                className="active btn btn-block"
              >
                Sign Up
              </button>
            )}

            {error && <div className="error">{error}</div>}
            <p
              onClick={(e) => {
                handlePasswordReset(e);
              }}
              className="forgot-password"
            >
              Forgot Password?
            </p>
          </form>
        </section>
      </div>
    </>
  );
}

export default LoginPage;
