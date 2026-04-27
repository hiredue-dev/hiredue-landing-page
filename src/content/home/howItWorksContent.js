import { assetMap } from "@/content/site/assets.js";

export const howItWorksContent = {
  heading: "How to Start",
  states: ["DOWNLOADED", "PROFILED", "CONNECTED", "PREFERENCES", "LIVE"],
  steps: [
    {
      image: assetMap.howItWorks.download,
      title: "Download and signup",
      desc: "Create your HireDue account and get started in minutes.",
    },
    {
      image: assetMap.howItWorks.resume,
      title: "Enter your resume",
      desc: "Add your experience and role context once.",
    },
    {
      image: assetMap.howItWorks.connect,
      title: "Connect LinkedIn and Gmail",
      desc: "Securely connect the platforms HireDue needs to automate.",
    },
    {
      image: assetMap.howItWorks.preferences,
      title: "Tell us your preferences",
      desc: "Set target roles, locations, and application priorities.",
    },
    {
      image: assetMap.howItWorks.live,
      title: "Grab a Pizza",
      desc: "HireDue runs the workflow while you focus on interviews.",
    },
  ],
};

