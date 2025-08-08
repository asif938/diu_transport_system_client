import { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";


const Register = () => {
  const navigate = useNavigate();
  const { createUser } = useContext(AuthContext); // useContext was missing

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const imageFile = formData.get("image");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return alert(
        "Password must be at least 6 characters and include both uppercase and lowercase letters."
      );
    }

    try {
      // ✅ Upload to ImgBB
      const imgData = new FormData();
      imgData.append("image", imageFile);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=145f5aeaf6a15c67199ff6c3ef4dbd4e`,
        {
          method: "POST",
          body: imgData,
        }
      );
      const imgRes = await res.json();
      const photoURL = imgRes?.data?.url;

      if (!photoURL) throw new Error("Image upload failed.");

      // ✅ Create Firebase user
      const userCredential = await createUser(email, password);
      const user = userCredential.user;

      // ✅ Update Firebase profile
      await updateProfile(user, {
        displayName: name,
        photoURL,
      });

      // ✅ Save user to MongoDB backend
      const savedUser = {
        name,
        email,
        photoURL,
        role: "user",
      };

      // await fetch("https://pet-adoption-server-wheat.vercel.app/users", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(savedUser),
      // });

      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="card w-full max-w-sm shadow-2xl my-7">
        <div className="card-body">
          <form onSubmit={handleRegister} className="form-control w-full">
            <h1 className="text-xl md:text-3xl text-center mb-3 font-bold">Please Register</h1>

            <label className="label">Name</label>
            <input
              type="text"
              name="name"
              className="input w-full border border-[#5F2DED]"
              required
            />

            <label className="label mt-1">Photo Upload</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="file-input w-full border border-[#5F2DED]"
              required
            />

            <label className="label mt-1">Email</label>
            <input
              type="email"
              name="email"
              className="input w-full border border-[#5F2DED]"
              required
            />

            <label className="label mt-1">Password</label>
            <input
              type="password"
              name="password"
              className="input w-full border border-[#5F2DED]"
              required
            />
            <small className="text-gray-500 mt-1">
              Password must be at least 6 characters, include an uppercase and a lowercase letter.
            </small>

            <button
              type="submit"
              className="btn btn-block mt-4 bg-[#5F2DED] text-white font-bold"
            >
              Register
            </button>

            <p className="text-center mt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="link link-hover underline text-[#5F2DED] font-semibold"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
