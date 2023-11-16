import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyCXYXhpbHza1tLSpYivZWMb0ULugWlfQFg",
  authDomain: "recipe-app-ffa33.firebaseapp.com",
  databaseURL: "https://recipe-app-ffa33-default-rtdb.firebaseio.com",
  projectId: "recipe-app-ffa33",
  storageBucket: "recipe-app-ffa33.appspot.com",
  messagingSenderId: "972341422374",
  appId: "1:972341422374:web:a7957782cfc306c164f9e7"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth()




const email = document.getElementById("email")
const password = document.getElementById("password")
const btn = document.getElementById("signin")
const error = document.getElementById("error")

btn.addEventListener('click', (e)=>{
     e.preventDefault();

     const user ={
        email: email.value,
        password: password.value
     }

     signInWithEmailAndPassword(auth, user.email, user.password)
     .then(()=>{
      window.location.href="recipe.html"
        
        console.log("logged in!!!")
     })
     .catch((err)=>{
        console.log("Error " + err)
        error.style.display= "block"
     })

     console.log(user)
})














