// Importa la clase ManageAccount desde el archivo firebaseconect.js
import { ManageAccount } from './firebaseconect.js';

// toma el formulario, para cuando se toca el boton registrar una cuenta
document.getElementById("register-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const simbolosPermitidos =/[!@#$%^&_+=~,?]/ 
  const numeros=/[0-9]/ 
  const mayusculas = /[A-Z]/
  const minusculas = /[a-z]/

  // Obtiene los valores de los campos del formulario
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;
  const role = document.getElementById("role").value;
  // Crea una instancia de la clase ManageAccount y llama al método register

  if(simbolosPermitidos.test(password) && password.length>=8 && numeros.test(password) && mayusculas.test(password) && minusculas.test(password)){
    const account = new ManageAccount();
    account.register(email, password, name,role); // y se le pasan los valores 
    
  }else{

    alert("La contraseña no cumple con los requisitos minimos.");

  }

 
});
