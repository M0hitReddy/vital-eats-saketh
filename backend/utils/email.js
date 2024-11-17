import emailjs from "@emailjs/browser";

// Initialize emailjs with your public key
emailjs.init(process.env.PUBLIC_KEY);

export async function sendOrderEmail(params) {
  await emailjs
    .send(process.env.SERVICE_ID, process.env.TEMPLATE_ID, params)
    .then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
      },
      (error) => {
        console.log("FAILED...", error);
      }
    );
}
