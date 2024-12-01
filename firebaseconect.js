// firebaseconect.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut  } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// credenciales de firebase
const firebaseConfig = {
  apiKey: "AIzaSyBOwIRq-k3MoNTEqiMDv2OE5bY73a57hFw",
  authDomain: "ingenieria-software-ea266.firebaseapp.com",
  projectId: "ingenieria-software-ea266",
  storageBucket: "ingenieria-software-ea266.appspot.com",
  messagingSenderId: "949058648047",
  appId: "1:949058648047:web:1fa88731382a5680b6a81a"
};

//instancia para firebase = app, autentificador = auth, firestore = db
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// las comparte en caso que los demas js lo necesiten
export { app, auth, db };

// se exporta la clase manageaccount que las demas ocuparan por sus funciones
export class ManageAccount {
  // register creara un usuario en auth, y asociara nombre junto con un rol, para añadir datos al usuario añadir aqui
  register(email, password, name, role) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // El usuario ha sido creado, obtenemos el UID del usuario
        const user = userCredential.user;

        // Ahora agregamos la información adicional en Firestore
        setDoc(doc(db, "users", user.uid), {
          name: name,
          email: email,
          role: role,
          createdAt: new Date()
        }).then(() => {
          console.log("Usuario creado y datos adicionales guardados en Firestore");
          // Cerrar sesión inmediatamente después de crear el usuario
          signOut(auth).then(() => {});
          window.location.href = "login.html"; // Redirigir al login después del registro
          alert("Registro exitoso. Serás redirigido a la página de inicio de sesión.");
        }).catch((error) => {
          console.error("Error al guardar los datos adicionales: ", error);
          alert("Error al guardar los datos en Firestore: " + error.message);
        });
      })
      .catch((error) => {
        console.error("Error al crear el usuario: ", error);
        alert("Error al registrar: " + error.message);
      });
  }

  // este confirma credenciales para iniciar sesion
  authenticate(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((_) => {
        window.location.href = "menu.html"; 
        alert("Has iniciado sesión correctamente. Serás redirigido a la página principal.");
      })
      .catch((error) => {
        console.error(error.message);
        alert("Error al iniciar sesión: " + error.message);
      });
  }
}