// firebaseconect.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut  } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBOwIRq-k3MoNTEqiMDv2OE5bY73a57hFw",
  authDomain: "ingenieria-software-ea266.firebaseapp.com",
  projectId: "ingenieria-software-ea266",
  storageBucket: "ingenieria-software-ea266.appspot.com",
  messagingSenderId: "949058648047",
  appId: "1:949058648047:web:1fa88731382a5680b6a81a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

// Función para registrar un usuario
export class ManageAccount {
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

  authenticate(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((_) => {
        window.location.href = "menu.html"; // Redirigir al index después de iniciar sesión
        alert("Has iniciado sesión correctamente. Serás redirigido a la página principal.");
      })
      .catch((error) => {
        console.error(error.message);
        alert("Error al iniciar sesión: " + error.message);
      });
  }

  signOut() {
    signOut(auth)
      .then((_) => {
        window.location.href = "login.html"; // Redirigir al index después de cerrar sesión
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}