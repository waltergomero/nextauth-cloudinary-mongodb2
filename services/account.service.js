import { signIn, signOut } from "next-auth/react";
import Router from "next/router";

export const accountService = {
  login,
  logout
};

function login(email, password) {
  return signIn("credentials", {
    redirect: false,
    email: email,
    password: password,
    callbackUrl: `${window.location.origin}`,
  }).then((user) => {
    return user;
  });
}

function logout() {
  signOut();
  Router.push("/");
}

// function register(first_name, last_name, email, password) {
//   return fetchWrapper.post(`${baseUrl}/register`, {
//     first_name,
//     last_name,
//     email,
//     password,
//   });
// }

// function getUserId(email) {
//   return fetchWrapper.get(`${baseUrl}/${email}`, email);
// }
