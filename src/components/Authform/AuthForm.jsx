import React, { useState } from "react";
import Header from "../Header/Header"; 
import { signIn, signUp } from "../../api";

const AuthForm = ({ onLoginSuccess }) => {
   const [isSignUp, setIsSignUp] = useState(false);
   const [wasSubmitted, setWasSubmitted] = useState(false);
   const [isAuthFailed, setIsAuthFailed] = useState(false); 

   const [formData, setFormData] = useState({
      name: "",
      login: "",
      password: "",
   });

   const [error, setError] = useState("");

   const hasNameDigits = isSignUp && /\d/.test(formData.name);

   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   const trimmedLogin = formData.login.trim();
   // Ошибка формата есть, только если поле не пустое и не соответствует шаблону email
   const hasLoginFormatError = trimmedLogin !== '' && !emailRegex.test(trimmedLogin);

   const isNameError = isSignUp && ((wasSubmitted && !formData.name.trim()) || hasNameDigits);
   const isLoginError = (wasSubmitted && !trimmedLogin) || hasLoginFormatError;
   const isPasswordEmpty = wasSubmitted && !formData.password.trim();

   const isFormValid = isSignUp 
      ? (formData.name.trim() && !hasNameDigits && trimmedLogin && !hasLoginFormatError && formData.password.trim())
      : (trimmedLogin && !hasLoginFormatError && formData.password.trim());

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
         ...formData,
         [name]: value,
      });
      setError("");
      setIsAuthFailed(false);
   };

   const toggleMode = (mode) => {
      setIsSignUp(mode);
      setWasSubmitted(false);
      setIsAuthFailed(false); 
      setError("");
      setFormData({ name: "", login: "", password: "" });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setWasSubmitted(true);

      if (!isFormValid) return;

      setError("");
      const trimmedLogin = formData.login.trim();
      const trimmedPassword = formData.password.trim();

      try {
         const responseData = !isSignUp
            ? await signIn({ login: trimmedLogin, password: trimmedPassword })
            : await signUp({ name: formData.name.trim(), login: trimmedLogin, password: trimmedPassword });
         const userToSave = responseData?.user ? responseData.user : responseData;

         if (userToSave && userToSave.token) {
            localStorage.setItem("userInfo", JSON.stringify(userToSave));
            if (typeof onLoginSuccess === 'function') {
               onLoginSuccess(userToSave);
            }
         } else {
            setError("Ошибка авторизации: сервер не вернул токен доступа");
         }
      } catch (err) {
         const msg = err.message || '';
         if (msg.includes('Ошибка связи') || msg.includes('Ошибка сервера')) {
            setError(msg);
         } else if (!isSignUp) {
            setIsAuthFailed(true); 
         } else {
            setError(msg);
         }
      }
   };

   return (
      <div className="auth-page-wrapper">
         <Header /> 

         <div className="auth-bg">
            <div className={`auth-modal ${isSignUp ? 'signup-mode' : ''}`}>
               <div className="auth-logo">{isSignUp ? "Регистрация" : "Вход"}</div>
               <div className="auth-wrapper">

                  <form className="auth-form" onSubmit={handleSubmit}>
                     <div className="auth-input-container">
                        {isSignUp && (
                           <div className={`auth-input-wrapper ${isNameError ? "required-error" : ""} ${hasNameDigits ? "name-digits-error" : ""}`}>
                              <input
                                 type="text"
                                 name="name"
                                 className={`auth-field ${isNameError ? "field-error" : ""}`}
                                 placeholder="Имя"
                                 value={formData.name}
                                 onChange={handleChange}
                              />
                              
                              {hasNameDigits && (
                                 <>
                                    <div className="name-text-tracker" aria-hidden="true">
                                       <span className="invisible-text">{formData.name}</span>
                                       <span className="dynamic-star">*</span>
                                    </div>
                                    <span className="field-tooltip">Имя не должно содержать чисел</span>
                                 </>
                              )}
                           </div>
                           )}

                           <div className={`auth-input-wrapper ${(isLoginError || isAuthFailed) ? "required-error" : ""} ${(hasLoginFormatError || isAuthFailed) ? "dynamic-error" : ""}`}>
                              <input
                                 type="text"
                                 name="login"
                                 className={`auth-field ${(isLoginError || isAuthFailed) ? "field-error" : ""}`}
                                 placeholder="Эл. почта"
                                 value={formData.login}
                                 onChange={handleChange}
                              />
                              
                              {(hasLoginFormatError || isAuthFailed) && formData.login && (
                                 <div className="text-tracker" aria-hidden="true">
                                    <span className="invisible-text">{formData.login}</span>
                                    <span className="dynamic-star">*</span>
                                 </div>
                              )}

                              {hasLoginFormatError && (
                                 <span className="field-tooltip">Введите корректный адрес эл. почты</span>
                              )}
                           </div>

                        <div className={`auth-input-wrapper ${(isPasswordEmpty || isAuthFailed) ? "required-error" : ""} ${isAuthFailed ? "dynamic-error" : ""}`}>
                           <input
                              type="password"
                              name="password"
                              className={`auth-field ${(isPasswordEmpty || isAuthFailed) ? "field-error" : ""}`}
                              placeholder="Пароль"
                              value={formData.password}
                              onChange={handleChange}
                           />

                           {isAuthFailed && formData.password && (
                              <div className="text-tracker" aria-hidden="true">
                                 <span className="invisible-text">{formData.password}</span>
                                 <span className="dynamic-star">*</span>
                              </div>
                           )}
                        </div>
                        </div>

                        {((wasSubmitted && !isFormValid) || hasNameDigits || hasLoginFormatError || isAuthFailed) && (
                           <p style={{ color: "#F84D4D", width: "312px", textAlign: "center", fontSize: "12px", fontWeight: "400", marginTop: "-12px", marginBottom: "24px", fontFamily: "'Montserrat', sansSerif" }}>
                              Упс! Введенные вами данные некорректны.
                              Введите данные корректно и повторите попытку.
                           </p>
                        )}

                        {error && <p className="auth-error-message">{error}</p>}

                        <button 
                           type="submit" 
                           className="auth-submit-btn"
                           disabled={(wasSubmitted && !isFormValid) || hasNameDigits || hasLoginFormatError || isAuthFailed}
                        >
                           {isSignUp ? "Зарегистрироваться" : "Войти"}
                        </button>

                     <div className="auth-footer-text">
                        {!isSignUp ? (
                           <p>
                              Нужно зарегистрироваться?{" "}
                              <span className="auth-link" onClick={() => toggleMode(true)}>
                                 Регистрируйтесь здесь
                              </span>
                           </p>
                        ) : (
                           <p>
                              Уже есть аккаунт?{" "}
                              <span className="auth-link" onClick={() => toggleMode(false)}>
                                 Войдите здесь
                              </span>
                           </p>
                        )}
                     </div>
                  </form>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AuthForm;