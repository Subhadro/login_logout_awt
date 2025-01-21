import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage() {
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        password: "",
        confirmpassword: "",
        gender: "Male",
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const { fullname, username, password, confirmpassword, gender } = formData;

        if (password !== confirmpassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("http://localhost:4000/api/v1/users/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullname, username, password, confirmpassword, gender }),
            });

            if (!response.ok) {
                const { error } = await response.json();
                setError(error);
                return;
            }

            const data = await response.json();
            console.log("Signup Successful:", data);
            navigate("/login"); // Redirect to the login page
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="signup-page">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                {error && <p className="error">{error}</p>}
                <div className="form-group">
                    <label htmlFor="fullname">Full Name</label>
                    <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmpassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmpassword"
                        name="confirmpassword"
                        value={formData.confirmpassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignupPage;
