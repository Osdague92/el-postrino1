// =================================================================
// SCRIPT PARA EL PROYECTO "EL POSTRINO"
// =================================================================

// **Importante:**
// Aquí es donde pegarás la configuración de tu proyecto de Firebase
// cuando lo crees en la consola de Firebase.
/*
    import { initializeApp } from "firebase/app";
    import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";

    const firebaseConfig = {
        apiKey: "TU_API_KEY",
        authDomain: "TU_AUTH_DOMAIN",
        projectId: "TU_PROJECT_ID",
        storageBucket: "TU_STORAGE_BUCKET",
        messagingSenderId: "TU_MESSAGING_SENDER_ID",
        appId: "TU_APP_ID"
    };

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const provider = new GoogleAuthProvider();
*/
// =================================================================


document.addEventListener('DOMContentLoaded', () => {

    // --- FUNCIONALIDAD 1: Animación de tarjetas al hacer scroll ---
    // Seleccionamos todas las tarjetas de postres que queremos animar.
    const cards = document.querySelectorAll('.postre-card');

    // Opciones para el IntersectionObserver:
    // threshold: 0.1 significa que la animación se activará cuando al menos el 10% de la tarjeta sea visible.
    const observerOptions = {
        root: null, // Observa en relación al viewport del navegador.
        rootMargin: '0px',
        threshold: 0.1
    };

    // Creamos un nuevo observador.
    // La función callback se ejecuta cada vez que la visibilidad de un elemento observado cambia.
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si el elemento (la tarjeta) está ahora visible en la pantalla...
            if (entry.isIntersecting) {
                // ...le añadimos la clase 'show' para que la animación CSS se active.
                entry.target.classList.add('show');
                // Una vez que la animación ha ocurrido, dejamos de observar esa tarjeta para mejorar el rendimiento.
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Le decimos al observador que vigile cada una de las tarjetas.
    cards.forEach(card => {
        observer.observe(card);
    });


    // --- FUNCIONALIDAD 2: Manejo del botón de Login con Google ---
    const googleLoginButton = document.getElementById('google-login');

    if (googleLoginButton) {
        googleLoginButton.addEventListener('click', () => {
            console.log('Botón de "Registrarse con Google" presionado. Aquí iría la lógica de Firebase.');
            
            // **Código de Firebase que usarías aquí:**
            /*
                signInWithPopup(auth, provider)
                    .then((result) => {
                        // El usuario ha iniciado sesión exitosamente.
                        const user = result.user;
                        console.log("Usuario autenticado:", user);
                        
                        // Aquí podrías tomar los datos del formulario y guardarlos en Firestore
                        // asociados a este usuario.
                        alert(`¡Bienvenido, ${user.displayName}!`);

                    }).catch((error) => {
                        // Manejo de errores.
                        console.error("Error durante la autenticación con Google:", error);
                        alert("Hubo un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.");
                    });
            */
        });
    }

});
