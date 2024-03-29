import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import caStyles from "./styles/styles.module.css";

const CreateAccountSideBar = () => {
  const options = [
    "Account Creation",
    "Pharmacy Information",
    "Documentation",
    // "Bank Details",
    "Summary",
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const routes = ["/create-account", ]
  const router = useRouter();

  console.log(router.query.slug);

  useEffect(() => {
    switch (router.query.slug) {
      case undefined:
        setCurrentStep(0);
        break;
      case "pharmacy-information":
        setCurrentStep(1);
        break;
      case "documentation":
        setCurrentStep(2);
        break;
      case "bank-details":
        setCurrentStep(3);
        break;
      case "summary":
        setCurrentStep(4);
        break;
      default:
        setCurrentStep(0);
        break;
    }
  }, [router])

  const getCurrentStep = (index) => {
    if (index === currentStep) {
      return '#000000'
    } else if (index < currentStep) {
      return "#1D1272" 
    } else {
      return "#888888"
    }
  }

  console.log(router.query.slug);

  return (
    <div className={[caStyles.caSideBar, "pt40 pr30 pl30"].join(" ")}>
      <svg
        width="51"
        height="50"
        viewBox="0 0 51 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask id="path-1-inside-1_609_14022" fill="white">
          <path d="M50.5 25C50.5 38.8071 39.3071 50 25.5 50C11.6929 50 0.5 38.8071 0.5 25C0.5 11.1929 11.6929 0 25.5 0C39.3071 0 50.5 11.1929 50.5 25ZM10.5 25C10.5 33.2843 17.2157 40 25.5 40C33.7843 40 40.5 33.2843 40.5 25C40.5 16.7157 33.7843 10 25.5 10C17.2157 10 10.5 16.7157 10.5 25Z" />
        </mask>
        <path
          d="M50.5 25C50.5 38.8071 39.3071 50 25.5 50C11.6929 50 0.5 38.8071 0.5 25C0.5 11.1929 11.6929 0 25.5 0C39.3071 0 50.5 11.1929 50.5 25ZM10.5 25C10.5 33.2843 17.2157 40 25.5 40C33.7843 40 40.5 33.2843 40.5 25C40.5 16.7157 33.7843 10 25.5 10C17.2157 10 10.5 16.7157 10.5 25Z"
          stroke="#98BF0B"
          strokeWidth="40"
          mask="url(#path-1-inside-1_609_14022)"
        />
        <mask id="path-2-inside-2_609_14022" fill="white">
          <path d="M50.5 25C50.5 20.3894 49.225 15.8687 46.816 11.9375C44.407 8.00639 40.9578 4.81799 36.8498 2.72484C32.7417 0.631687 28.1349 -0.284673 23.5385 0.0770666C18.9422 0.438807 14.5354 2.06456 10.8054 4.77457C7.07535 7.48459 4.1674 11.1733 2.40301 15.4329C0.638628 19.6925 0.0865413 24.3571 0.807791 28.9109C1.52904 33.4647 3.49553 37.7303 6.48985 41.2362C9.48417 44.7421 13.3897 47.3517 17.7746 48.7764L20.8647 39.2658C18.2338 38.411 15.8905 36.8453 14.0939 34.7417C12.2973 32.6382 11.1174 30.0788 10.6847 27.3465C10.2519 24.6142 10.5832 21.8155 11.6418 19.2597C12.7004 16.704 14.4452 14.4908 16.6832 12.8647C18.9212 11.2387 21.5653 10.2633 24.3231 10.0462C27.0809 9.8292 29.845 10.379 32.3099 11.6349C34.7747 12.8908 36.8442 14.8038 38.2896 17.1625C39.735 19.5212 40.5 22.2337 40.5 25H50.5Z" />
        </mask>
        <path
          d="M50.5 25C50.5 20.3894 49.225 15.8687 46.816 11.9375C44.407 8.00639 40.9578 4.81799 36.8498 2.72484C32.7417 0.631687 28.1349 -0.284673 23.5385 0.0770666C18.9422 0.438807 14.5354 2.06456 10.8054 4.77457C7.07535 7.48459 4.1674 11.1733 2.40301 15.4329C0.638628 19.6925 0.0865413 24.3571 0.807791 28.9109C1.52904 33.4647 3.49553 37.7303 6.48985 41.2362C9.48417 44.7421 13.3897 47.3517 17.7746 48.7764L20.8647 39.2658C18.2338 38.411 15.8905 36.8453 14.0939 34.7417C12.2973 32.6382 11.1174 30.0788 10.6847 27.3465C10.2519 24.6142 10.5832 21.8155 11.6418 19.2597C12.7004 16.704 14.4452 14.4908 16.6832 12.8647C18.9212 11.2387 21.5653 10.2633 24.3231 10.0462C27.0809 9.8292 29.845 10.379 32.3099 11.6349C34.7747 12.8908 36.8442 14.8038 38.2896 17.1625C39.735 19.5212 40.5 22.2337 40.5 25H50.5Z"
          stroke="url(#paint0_linear_609_14022)"
          strokeWidth="40"
          mask="url(#path-2-inside-2_609_14022)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_609_14022"
            x1="25.5"
            y1="0"
            x2="25.5"
            y2="50"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1D1272" />
            <stop offset="1" stopColor="#6C5CE6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="mt100 displayFlex">
        <div className={caStyles.timeline}></div>

        <nav>
          {options.map((item, index) => (
            <div key={index} className={caStyles.option}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
                  fill={getCurrentStep(index)}
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.1087 14.4997C10.9933 14.4994 10.8831 14.4511 10.8046 14.3664L8.77957 12.2122H8.77957C8.62194 12.0442 8.63033 11.7803 8.79832 11.6226C8.96631 11.465 9.23027 11.4734 9.3879 11.6414L11.1046 13.4706L14.6087 9.63723V9.63723C14.7528 9.45781 15.0151 9.42916 15.1945 9.57325C15.3739 9.71734 15.4026 9.97959 15.2585 10.159C15.2482 10.1718 15.2371 10.184 15.2254 10.1956L11.4171 14.3622C11.3393 14.4484 11.229 14.4983 11.1129 14.4997L11.1087 14.4997Z"
                  fill="white"
                />
              </svg>

              <label>{item}</label>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CreateAccountSideBar;
