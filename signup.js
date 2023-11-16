import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";


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
const btn = document.getElementById("signup")



btn.addEventListener('click', (e)=>{
    e.preventDefault()
    console.log(email.value, password.value)

    if(validateEmail(email)  === false|| validatePass(password) === false){
        alert('Email or Password is out of line')
    } else{
        window.location.href="recipe.html"
    }

    // stores data
    const user = {
        email: email.value,
        password: password.value
    }

    createUserWithEmailAndPassword(auth, user.email, user.password)
    .then(() =>{
        console.log("signup successfull")
    })
    .catch((err) =>{
        console.log("Error " + err)
    })

    console.log(user)
})


function validateEmail(){
    let expression =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if(expression.test(email.value) == true){
        console.log(email.value)
        return true
    } else{
        console.log(email.value)
        return false
    }
}

function validatePass(){
    if(password.value.length < 6){
        console.log(password.value)
        return false
    } else{
        console.log(password.value)
        return true
    }
}

