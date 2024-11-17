import emailjs from "@emailjs/browser";

// Initialize emailjs with your public key
emailjs.init(import.meta.env.VITE_APP_PUBLIC_KEY);

export async function sendOrderEmail(params) {
  await emailjs
    .send(
      import.meta.env.VITE_APP_SERVICE_ID,
      import.meta.env.VITE_APP_TEMPLATE_ID,
      params
    )
    .then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
      },
      (error) => {
        console.log("FAILED...", error);
      }
    );
}
