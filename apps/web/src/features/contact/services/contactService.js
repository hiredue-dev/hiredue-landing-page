const CONTACT_APPS_SCRIPT_URL =
  import.meta.env.VITE_CONTACT_APPS_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbzpPLZn86WSx6JS_KVZKKAZYDGH1rl3TIM6Sp-VqU9b1HDPT9iw6qdc9RizVSqFG-26/exec";

const contactService = {
  submit: async (payload) => {
    if (!CONTACT_APPS_SCRIPT_URL) {
      throw new Error("Contact form is not configured.");
    }

    const formBody = new URLSearchParams({
      name: payload.name,
      email: payload.email,
      message: payload.message,
      source: payload.source || "contact_page",
      submittedAt: payload.submittedAt || new Date().toISOString(),
    });

    await fetch(CONTACT_APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: formBody,
    });

    return {
      success: true,
      message: "Request submitted.",
      data: null,
    };
  },
};

export default contactService;
