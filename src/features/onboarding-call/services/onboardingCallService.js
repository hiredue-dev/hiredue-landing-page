const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_ONBOARDING_CALL_SHEET_ENDPOINT || "";

const onboardingCallService = {
  submit: async (payload) => {
    if (!APPS_SCRIPT_URL) {
      throw new Error(
        "Onboarding call form is not configured. Set NEXT_PUBLIC_ONBOARDING_CALL_SHEET_ENDPOINT.",
      );
    }

    const formBody = new URLSearchParams({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      preferredDate: payload.preferredDate,
      /* Always "website" — this form has exactly one source. */
      source: "website",
    });

    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: formBody,
    });

    return {
      success: true,
      message: "You're on the list — we'll be in touch to confirm your slot.",
      data: null,
    };
  },
};

export default onboardingCallService;
