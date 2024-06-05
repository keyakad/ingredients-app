import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "./firebase";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function loginUser(e) {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                navigate("/home")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });
    }

    return (
        <div>
            <div className="container">
                <form>
                    <h1>Welcome to the Pantry</h1>
                    <h2>Log in</h2>
                    <label htmlFor="email">Email: </label>
                    <input value={email}
                        type="email" id="email" name="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="password">Password: </label>
                    <input value={password}
                        type="password" id="password" name="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="button" type="submit" onClick={loginUser}>
                                Log in
                    </button>
                    <p>New user? Sign up <Link to="/signup">here</Link></p>
                 </form>
            </div>
        </div>
    );
}

export default Login;