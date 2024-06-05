import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "./firebase";
import "./Signup.css"

function Signup() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function signUpUser(e) {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                navigate("/login");
            });
    }

    return (
        <div>
            <div className="contain">
                <form>
                    <h1>Sign up for the Pantry!</h1>
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
                    <button className="button" type="submit" onClick={signUpUser}>
                        Sign up
                    </button>
                </form>
            </div>
    </div>
    );
}

export default Signup;