import { ManageAccount } from './firebaseconect.js';

// trae el formulario con su id cuando se toque el boton
document.getElementById("formulario-sesion").addEventListener("submit", (event) => {
  event.preventDefault();

  //toma los 2 valores
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // se instancia manage account que viene desde firebase conect para utilizar sus funciones
  const account = new ManageAccount();
  // authenticate de firebaseconect que inicia sesion
  account.authenticate(email, password);
});
