import * as React from "react";

// Axios
import axios from "axios";

// Styles
import styles from "./verifyOtpPage.module.css";

// Hooks
import { useState, useEffect } from 'react';

// React Router DOM
import { useNavigate } from "react-router-dom";

// User Defined Hooks
import { useRecoveryContext } from "../../../components/hooks/useAuth";

// Components
import { AlertMessageCard } from '../../../components/alertMessageCard/alertMessageCard'

export const VerifyOtpPage = () => {
    const {otp, setOTP, email, setEmail} = useRecoveryContext();
    const [OTPinput, setOTPinput] = useState();
    const [disable, setDisable] = useState(true);
    const [timerCount, setTimer] = useState(60);
    const [showMessage, setShowMessage] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();

    function verifyOTP() {
      if (!isNaN(parseInt(OTPinput)) && parseInt(OTPinput) === otp) {
        navigate('/resetPassword');
      }
      else {
        setShowMessage(true);
        setAlertMessage("The code you have entered is not correct, try again re-send the link");
      }
    }

      //function to resend OTP 
  function resendOTP() {
    if (disable) return;
    // generate another OTP
    const OTP = Math.floor(Math.random() * 9000 + 1000);
    // change the global value of the otp in the RecoveryContext Provider
    setOTP(OTP);
    axios.post("http://localhost:5000/resetPassword/sendEmail", {
        otp: OTP,
        recipientEmail: email,
      })
      .then(() => setDisable(true))
      .then(() => {
        showMessage(true);
        setAlertMessage("A new OTP has succesfully been sent to your email.");
      })
      .then(() => setTimer(60))
      .catch(console.log);

  }
  //timer function
  useEffect(() => {
    let interval = setInterval(() => {
      setTimer(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        return lastTimerCount - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [disable]);

    return (
      <div className={styles['verify-otp-main-div']}>
        <div className={styles['verify-otp-title-div']}>
          <h2 className={styles['verify-otp-title-h2']}>Email Verification</h2>
        </div>
        <div className={styles['verify-otp-sub-div']}>
            <div className={styles['verify-otp-label-div']}>
              <label className={styles['verify-otp-label']}>Enter OTP</label>
            </div>
            <div className={styles['verify-otp-input-div']}>
              <input className={styles['verify-otp-input']} type="text" placeholder="example: 12345" value={OTPinput} onChange={(e) => { setOTPinput(e.target.value) }} /> 
            </div>
        </div>
        <div className={styles['verify-otp-button-div']}>
          <button className={styles['verify-otp-button']} onClick={() => verifyOTP()}>Verify Account</button> 
        </div>
        <div className={styles['verify-otp-a-div']}>
          <a className={styles['resend-otp-a']} onClick={() => resendOTP()} > Did not receive code? {disable ? `Resend OTP in ${timerCount}s` : " Resend OTP"}</a> 
        </div>
        {showMessage && (<AlertMessageCard message={alertMessage} showAlertMessage={setShowMessage} ></AlertMessageCard>)}
      </div>
    );
}