const WAITLIST_APPS_SCRIPT_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SHEET_ENDPOINT ||
  "https://script.google.com/macros/s/AKfycbz38tTutZS7MefU3XBAFlEkDlhks2MsMcz3pK1igv3CUyVEus_MWvU-_pnDT8K58DVFWw/exec";

const waitlistService = {
  submit: async (payload) => {
    const formBody = new URLSearchParams({
      email: payload.email,
      name: payload.name,
      fullName: payload.name,
      phone: payload.phone,
      contactNumber: payload.phone,
      source: payload.source || "waitlist",
      submittedAt: payload.submittedAt || new Date().toISOString(),
    });

    await fetch(WAITLIST_APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: formBody,
    });

    return {
      success: true,
      message: "You’re on the waitlist.",
      data: null,
    };
  },
};

export default waitlistService;
