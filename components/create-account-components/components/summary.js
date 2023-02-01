import Head from "next/head";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/dist/client/router";
import Button from "../../../components/atoms/Button";
import Accordion from "../../../components/molecules/Accordion";
import caStyles from "./styles/styles.module.css";
import { iconsSVGs } from "../../../assets/images/icons";
import { postPlain } from "../../../requests/postPlain";
import { postPlainMultiPart } from "../../../requests/postPlainMultiPart";
import TransparentLoader from "../../atoms/TransparentLoader";

const Summary = ({ currentPharmacyDetails }) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [creatingAccount, setCreatingAccount] = useState(false);

  console.log({currentPharmacyDetails});
  useEffect(() => {
    if (Object.values(currentPharmacyDetails.bankDetails).length === 0) {
      router.push("/create-account");
    }
  }, [])

  const createPharmacyAccount = async () => {
    const pharmacyData = new FormData();

    pharmacyData.append(
      "pharmacist_license",
      currentPharmacyDetails?.documentation?.pharmacist_license
    );
    pharmacyData.append(
      "premise_license",
      currentPharmacyDetails?.documentation?.premise_license
    );
    pharmacyData.append("role", "pharmacy");
    pharmacyData.append("email", currentPharmacyDetails.email);
    pharmacyData.append("password", currentPharmacyDetails.password);
    pharmacyData.append("pharmacyName", currentPharmacyDetails?.pharmacyName);
    pharmacyData.append(
      "contact_number",
      currentPharmacyDetails?.contact_number
    );
    pharmacyData.append(
      "regPharmacistName",
      currentPharmacyDetails?.regPharmacistName
    );
    pharmacyData.append(
      "documentation",
      JSON.stringify({
        pharmacist_license_expiry_date:
          currentPharmacyDetails?.documentation?.pharmacist_license_expiry_date,
        premise_license_expiry_date:
          currentPharmacyDetails?.documentation?.premise_license_expiry_date,
      })
    );
    pharmacyData.append(
      "pharmacyInformation",
      JSON.stringify(currentPharmacyDetails.pharmacyInformation)
    );
    pharmacyData.append(
      "bankDetails",
      JSON.stringify(currentPharmacyDetails.bankDetails)
    );

    // const createPharmacyAccountRequest = await postPlain("auth/signup", pharmacyData)

    // fetch("http://localhost:5000/auth/signup", {
    //     method: "POST",
    //     body: pharmacyData
    // })

    setCreatingAccount(true);

    const createPharmacyAccountResponse = await postPlainMultiPart(
      "auth/signup",
      pharmacyData
    );

    setCreatingAccount(false);

    if (createPharmacyAccountResponse.status === "OK") {
      router.push("/create-account/post-sign-up");
    } else {
      if (
        createPharmacyAccountResponse?.error?.code &&
        createPharmacyAccountResponse?.error?.message
      ) {
        setErrorMessage(createPharmacyAccountResponse?.error?.message);
      } else {
        setErrorMessage(createPharmacyAccountResponse?.error);
      }
    }
  };

  return (
    <div className={caStyles.summary}>
      <Head>
        <title>Summary</title>
      </Head>
      {
        creatingAccount && <div className={caStyles.loader}>
        <div>
        <TransparentLoader />
        <p>Creating account...</p>
        </div>
      </div>
      }
      <div>
        <main className="centerSelfHorizontal displayFlex flexColumn">
          <h2>Summary</h2>

          {errorMessage !== "" && (
            <div
              className={[
                caStyles.errorMessage,
                "displayFlex jcSpaceBetween alignCenter",
              ].join(" ")}
            >
              <p>{errorMessage}</p>

              <div onClick={() => setErrorMessage("")}>
                {iconsSVGs.closeIconWhite}
              </div>
            </div>
          )}

          <hr />

          <Accordion title={"Account Creation"}>
            <div className="displayFlex jcSpaceBetween font14">
              <p>Name of Pharmacy</p>
              <p>{currentPharmacyDetails?.pharmacyName}</p>
            </div>

            <div className="displayFlex jcSpaceBetween">
              <p>Registered Pharmacist Name</p>
              <p>{`${currentPharmacyDetails?.regPharmacistName}`}</p>
            </div>

            <div className="displayFlex jcSpaceBetween">
              <p>Contact Number</p>
              <p>{currentPharmacyDetails?.contact_number}</p>
            </div>

            <div className="displayFlex jcSpaceBetween">
              <p>Email</p>
              <p>{currentPharmacyDetails.email}</p>
            </div>
          </Accordion>

          <hr />

          <Accordion title={"Pharmacy Information"}>
            <div className="displayFlex jcSpaceBetween">
              <p>Pharmacy Registration Number</p>
              <p>
                {
                  currentPharmacyDetails?.pharmacyInformation
                    ?.registration_number
                }
              </p>
            </div>

            <div className="displayFlex jcSpaceBetween">
              <p>Name of Pharmacy</p>
              <p>{currentPharmacyDetails?.pharmacyName}</p>
            </div>

            <div className="displayFlex jcSpaceBetween">
              <p>Address</p>
              <p>
                {currentPharmacyDetails?.pharmacyInformation?.first_address}
              </p>
            </div>

            <div className="displayFlex jcSpaceBetween">
              <p>State</p>
              <p>{currentPharmacyDetails?.pharmacyInformation?.state}</p>
            </div>

            <div className="displayFlex jcSpaceBetween">
              <p>LGA</p>
              <p>{currentPharmacyDetails?.pharmacyInformation?.lga}</p>
            </div>

            <div className="displayFlex jcSpaceBetween">
              <p>Business Owner</p>
              <p>{`${currentPharmacyDetails?.pharmacyInformation?.owner_first_name} ${currentPharmacyDetails?.pharmacyInformation?.owner_last_name}`}</p>
            </div>

            {/* <div className="displayFlex jcSpaceBetween">
                    <p>Business Owner Contact Number</p>
                    <p>+234 801 123 4567</p>
                </div> */}

            <div className="displayFlex jcSpaceBetween">
              <p>Superitendent Pharmacist</p>
              <p>{`${currentPharmacyDetails?.pharmacyInformation?.superintendent_first_name} ${currentPharmacyDetails?.pharmacyInformation?.superintendent_last_name}`}</p>
            </div>

            {/* <div className="displayFlex jcSpaceBetween">
                    <p>Superitendent Pharmacist Contact Number</p>
                    <p>+234 801 123 4567</p>
                </div> */}
          </Accordion>

          <hr />

          <Accordion title={"Documentation"}>
            <div className="displayFlex jcSpaceBetween">
              <p>Pharmacist License Expiry Date</p>
              <p>
                {
                  currentPharmacyDetails?.documentation
                    ?.pharmacist_license_expiry_date
                }
              </p>
            </div>

            <div className="displayFlex jcSpaceBetween">
              <p>Pharmacy License Expiry Date</p>
              <p>
                {
                  currentPharmacyDetails?.documentation
                    ?.premise_license_expiry_date
                }
              </p>
            </div>
          </Accordion>

          <hr />

          <Accordion title={"Bank Details"}>
            <div className="displayFlex jcSpaceBetween">
              <p>Bank Name</p>
              <p>{currentPharmacyDetails?.bankDetails?.bank?.name}</p>
            </div>

            <div className="displayFlex jcSpaceBetween">
              <p>Account Number</p>
              <p>{currentPharmacyDetails?.bankDetails?.accountNumber}</p>
            </div>

            <div className="displayFlex jcSpaceBetween">
              <p>Account Name</p>
              <p>{currentPharmacyDetails?.bankDetails?.account_name}</p>
            </div>

            {/* <div className="displayFlex jcSpaceBetween">
                    <p>Branch</p>
                    <p>First Last</p>
                </div>

                <div className="displayFlex jcSpaceBetween">
                    <p>Bank Code</p>
                    <p>First Last</p>
                </div>

                <div className="displayFlex jcSpaceBetween">
                    <p>Swift Code</p>
                    <p>First Last</p>
                </div>

                <div className="displayFlex jcSpaceBetween">
                    <p>IBAN</p>
                    <p>First Last</p>
                </div> */}
          </Accordion>

          <hr />

          <footer>
            <table>
              <tbody>
                <tr>
                  <td>
                    <Button
                      type={"button"}
                      label={"Previous"}
                      onButtonClick={() =>
                        router.push("/create-account/bank-details")
                      }
                      buttonIntent={"previous"}
                      theme={"outline"}
                    />
                  </td>

                  <td>
                    <Button
                      onButtonClick={() => {
                        createPharmacyAccount();
                      }}
                      disabled={creatingAccount}
                      label={"Submit"}
                      buttonIntent={"next"}
                      theme={"solid"}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Summary;
