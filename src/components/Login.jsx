// // File: Login.jsx
// import React, { useState, useEffect } from "react";

// export default function Login({ onLogin }) {
//   const [username, setUsername] = useState("");
//   const [animated, setAnimated] = useState(false);

//   useEffect(() => {
//     setTimeout(() => setAnimated(true), 100);
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!username.trim()) {
//       alert("Please enter your name.");
//       return;
//     }
//     onLogin(username.trim());
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
//       <div
//         className={`transform transition duration-500 ease-out ${
//           animated ? "scale-100 opacity-100" : "scale-90 opacity-0"
//         } bg-white p-8 rounded-2xl shadow-2xl w-96`}
//       >
//         <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
//           Welcome! Please Log In
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Name
//             </label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
//               placeholder="Enter your name"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
