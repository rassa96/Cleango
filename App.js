import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useEffect, useMemo, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { getApps, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import Svg, { Path } from "react-native-svg";

const translations = {
  en: {
    homeClean: "Home Cleaning",
    homeCleanSub: "Standard cleaning for a fresh home",
    officeClean: "Office Cleaning",
    officeCleanSub: "Professional office and workspace cleaning",
    deepClean: "Deep Clean",
    deepCleanSub: "Thorough, top-to-bottom cleaning",
    moveInOut: "Move In/Out",
    moveInOutSub: "Get your deposit back or prep a new home",
    windows: "Windows",
    laundry: "Laundry",
    insideOven: "Inside oven",
    refrigerator: "Refrigerator",
    closetInside: "Closet",
    wardrobe: "Wardrobe",
    toilet: "Toilet",
    bath: "Bath",
    loading: "Loading...",
    createAccount: "Create your account",
    welcomeBack: "Welcome back",
    login: "Login",
    register: "Register",
    fullName: "Full name",
    registerAsCleaner: "Register as cleaner",
    registerAsCleanerHint: "Tick this if you want to work as a cleaner",
    yourName: "Your name",
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    passwordPlaceholder: "Your secure password",
    createAccountBtn: "Create Account",
    loginBtn: "Login",
    alreadyHaveAccount: "Already have an account? Login",
    dontHaveAccount: "Don't have an account? Register",
    invalidEmail: "Invalid Email",
    invalidEmailMsg: "Please enter a valid email address.",
    passwordTooShort: "Password Too Short",
    passwordTooShortMsg: "Your password must be at least 6 characters long.",
    nameRequired: "Name is required",
    nameRequiredMsg: "Please enter your full name to register.",
    accountExists: "Account Exists",
    accountExistsMsg: "An account with this email already exists. Please log in.",
    loginFailed: "Login Failed",
    loginFailedMsg: "The email or password you entered is incorrect.",
    verifyEmailTitle: "Verify Your Email",
    verifyEmailMsg: "We sent a verification link to your email. Verify your email, then log in.",
    emailNotVerified: "Email Not Verified",
    emailNotVerifiedMsg: "Please verify your email first. We sent another verification link.",
    adminDashboard: "Admin Dashboard",
    manageCleaners: "Manage Cleaners",
    workers: "Workers",
    bookings: "Bookings",
    active: "Active",
    openSlots: "Open Slots",
    noBookings: "No bookings yet.",
    service: "Service",
    customer: "Customer",
    with: "with",
    address: "Address",
    accepted: "Accepted",
    completed: "Completed",
    canceled: "Canceled",
    workerAvailability: "Worker Availability",
    hi: "Hi",
    bookTrusted: "Book trusted, reliable cleaners",
    cleanerHomeTitle: "Cleaner Account",
    cleanerHomeMessage: "Your account is registered as a cleaner. Service ordering is unavailable for cleaner accounts.",
    cleanerCannotBook: "Booking Unavailable",
    cleanerCannotBookMsg: "Cleaner accounts cannot order cleaning services.",
    registeredCleanerStatus: "Registered",
    registeredCleanerProfile: "Registered cleaner profile",
    vettedCleaners: "Vetted cleaners",
    sameWeekSlots: "Same-week slots",
    availableNow: "Available now",
    selectedRating: "Selected rating",
    registeredAccounts: "Users and cleaners",
    editAccount: "Edit information",
    saveAccount: "Save information",
    deleteAccount: "Delete profile",
    resetAccountPassword: "Send password reset email",
    cleanerAccount: "Cleaner",
    userAccount: "User",
    accountUpdated: "Account updated",
    accountUpdatedMsg: "The account information was updated.",
    accountDeleted: "Profile deleted",
    accountDeletedMsg: "The local profile was deleted. The Firebase account still requires server-side deletion.",
    resetEmailSent: "Password reset email sent",
    resetEmailSentMsg: "A password reset email was sent to the account email.",
    firebaseUnavailable: "Firebase unavailable",
    firebaseUnavailableMsg: "Firebase Authentication is required for password reset and secure account management.",
    changeAdminPassword: "Change admin password",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    changePassword: "Change password",
    passwordsDoNotMatch: "Passwords do not match",
    passwordChanged: "Password changed",
    passwordChangedMsg: "Your admin password has been changed successfully.",
    passwordChangeUnavailable: "Password change unavailable",
    passwordChangeUnavailableMsg: "Connect Firebase Authentication before changing the admin password.",
    rateCleaner: "Rate cleaner",
    ratingSubmitted: "Thank you for rating the cleaner",
    commentAboutCleaner: "Comment about cleaner",
    commentPlaceholder: "Write a private comment about the cleaner...",
    saveComment: "Save comment",
    commentSaved: "Private comment saved",
    timeSlot: "Time slot",
    workSlots: "Work slot times",
    chooseService: "Choose a service",
    details: "Details",
    rooms: "Rooms",
    extras: "Extras",
    availableToday: "Available today",
    cleaningWorkers: "Cleaning workers",
    estimatedTotal: "Estimated total",
    serviceSoon: "This service will be available soon",
    book: "Book",
    payTheBill: "Pay the bill",
    available: "Available",
    busy: "Busy",
    rating: "rating",
    jobs: "jobs",
    orderHistory: "Order History",
    noPastOrders: "You have no past orders.",
    at: "at",
    addressRequired: "Address is required",
    addressRequiredMsg: "Please enter your address for the cleaning service.",
    cleanerUnavailable: "Cleaner Unavailable",
    cleanerUnavailableMsg: "The selected cleaner is not available at this time. Please choose another slot or cleaner.",
    bookingRequested: "Booking Requested",
    requested: "Requested",
    needToPay: "Need to pay",
    ordered: "Ordered",
    carouselDesc1: "Professional cleaning for your home and office",
    carouselDesc2: "Fresh and clean spaces every time",
    carouselDesc3: "Trusted cleaning services",
    start: "Start",
    slideTitle1: "Professional Cleaning",
    slideTitle2: "Clean & Fresh",
    slideTitle3: "Home & Office",
    homeTab: "Home",
    profileTab: "Profile",
    myProfile: "My Profile",
    accountEmail: "Account Email",
    firstNameLastName: "Name and surname",
    phoneNumber: "Phone number",
    idCard: "ID card",
    uploadIdCardImage: "Upload ID card image",
    idCardImageUploaded: "ID card image uploaded",
    idCardImageMissing: "No ID card image uploaded yet",
    mediaPermissionDenied: "Permission denied",
    mediaPermissionDeniedMsg: "Please allow media library access to upload an ID card image.",
    saveProfile: "Save Profile",
    profileSaved: "Profile Saved",
    profileSavedMsg: "Your profile information has been updated.",
    idCardActivation: "ID Card Activation",
    reviewIdCards: "Review uploaded ID cards",
    markEligible: "Mark Eligible",
    markNotEligible: "Mark Not Eligible",
    noIdCardRequests: "No uploaded ID cards to review.",
    idStatus: "ID status",
    idStatusNotSubmitted: "Not submitted",
    idStatusPending: "Pending review",
    idStatusApproved: "Eligible",
    idStatusRejected: "Not eligible",
    eligibilityRequired: "Eligibility Required",
    eligibilityRequiredMsg: "Your ID card must be approved by admin before booking a service.",
    verificationSubmitted: "Verification Submitted",
    verificationSubmittedMsg: "Your ID card was submitted for admin review.",
    deleteIdCard: "Delete ID Card",
    deleteIdCardTitle: "Delete ID Card",
    deleteIdCardMsg: "Remove uploaded ID card for this user?",
    paymentMethod: "Payment method",
    choosePaymentMethod: "Choose your payment method",
    payByBlik: "Pay by BLIK",
    payByBankWire: "Bank Wire",
    paymentInstructions: "Please pay to BLIK: 731 762 781 or use bank wire. After payment, upload the receipt below.",
      bankWireAccount: "Bank account: 93109018090000000151049070",
    uploadReceipt: "Upload payment receipt",
    receiptUploaded: "Receipt uploaded",
    receiptMissing: "Upload a payment receipt to confirm your order.",
    paymentRequired: "Payment Required",
    paymentRequiredMsg: "Please choose a payment method and upload a receipt before placing your order.",
    activeOrderExists: "Active Order Exists",
    activeOrderExistsMsg: "You already have an active order. Please complete the current order before booking again.",
    serviceArea: "Service Area",
    serviceAreaCities: "Cities in service area",
    cityPlaceholder: "Enter city name",
    addCity: "Add City",
    saveCity: "Save City",
    cancel: "Cancel",
    deleteCity: "Delete",
    noCities: "No cities configured yet.",
    cityRequired: "City Required",
    cityRequiredMsg: "Please enter a city name.",
    cityExists: "City Exists",
    cityExistsMsg: "This city is already in the service area.",
    removeCityTitle: "Remove City",
    removeCityMsg: "Remove this city from the service area?",
    supportMessage: "Support Message",
    supportToAdmin: "Write to admin if you have any problem.",
    supportPlaceholder: "Describe your issue...",
    sendMessage: "Send Message",
    messageRequired: "Message Required",
    messageRequiredMsg: "Please write a message before sending.",
    messageSent: "Message Sent",
    messageSentMsg: "Your message was sent to admin.",
    supportInbox: "Support Inbox",
    noSupportMessages: "No support messages yet.",
    supportFromUser: "User",
    supportFromCleaner: "Cleaner",
    supportFromAdmin: "Admin",
    supportSendTo: "Send to",
    supportTargetUsers: "All users",
    supportTargetCleaners: "All cleaners",
    supportTargetSingle: "One account",
    recipientRequired: "Recipient Required",
    recipientRequiredMsg: "Please select a recipient account.",
    supportAdminMessageHint: "Send support updates directly to users and cleaners.",
    supportNoRecipients: "No registered accounts available.",
    supportTo: "To",
    downloadReceipt: "Download Receipt",
    receiptSaved: "Receipt Saved",
    receiptSavedMsg: "Receipt image was downloaded to your device.",
    receiptSaveFailed: "Download Failed",
    receiptSaveFailedMsg: "Could not download the receipt image. Please try again.",
  },
  pl: {
    homeClean: "Sprzątanie domu",
    homeCleanSub: "Standardowe sprzątanie dla świeżego domu",
    officeClean: "Sprzątanie biura",
    officeCleanSub: "Profesjonalne czyszczenie biura i przestrzeni roboczej",
    deepClean: "Głębokie sprzątanie",
    deepCleanSub: "Dokładne sprzątanie od góry do dołu",
    moveInOut: "Wyjazd/Wprowadzka",
    moveInOutSub: "Odzyskaj depozyt lub przygotuj nowy dom",
    windows: "Okna",
    laundry: "Pranie",
    insideOven: "Czyszczenie piekarnika",
    refrigerator: "Lodówka",
    closetInside: "Szafa",
    wardrobe: "Garderoba",
    toilet: "Toaleta",
    bath: "Wanna",
    loading: "Ładowanie...",
    createAccount: "Utwórz swoje konto",
    welcomeBack: "Witaj z powrotem",
    login: "Logowanie",
    register: "Rejestracja",
    fullName: "Imię i nazwisko",
    registerAsCleaner: "Zarejestruj jako sprzątacz",
    registerAsCleanerHint: "Zaznacz, jeśli chcesz pracować jako sprzątacz",
    yourName: "Twoje imię",
    email: "Email",
    emailPlaceholder: "ty@przyklad.com",
    password: "Hasło",
    passwordPlaceholder: "Twoje bezpieczne hasło",
    createAccountBtn: "Utwórz konto",
    loginBtn: "Zaloguj się",
    alreadyHaveAccount: "Masz już konto? Zaloguj się",
    dontHaveAccount: "Nie masz konta? Zarejestruj się",
    invalidEmail: "Nieprawidłowy email",
    invalidEmailMsg: "Proszę wpisać prawidłowy adres email.",
    passwordTooShort: "Hasło za krótkie",
    passwordTooShortMsg: "Twoje hasło musi mieć co najmniej 6 znaków.",
    nameRequired: "Imię jest wymagane",
    nameRequiredMsg: "Proszę wpisz swoje pełne imię i nazwisko do rejestracji.",
    accountExists: "Konto istnieje",
    accountExistsMsg: "Konto z tym adresem email już istnieje. Zaloguj się.",
    loginFailed: "Logowanie nie powiodło się",
    loginFailedMsg: "Email lub hasło, które wpisałeś, są nieprawidłowe.",
    verifyEmailTitle: "Zweryfikuj email",
    verifyEmailMsg: "Wysłaliśmy link weryfikacyjny na Twój email. Zweryfikuj konto i zaloguj się.",
    emailNotVerified: "Email niezweryfikowany",
    emailNotVerifiedMsg: "Najpierw zweryfikuj email. Wysłaliśmy kolejny link weryfikacyjny.",
    adminDashboard: "Panel Administratora",
    manageCleaners: "Zarządzaj sprzątaczami",
    workers: "Pracownicy",
    bookings: "Rezerwacje",
    active: "Aktywne",
    openSlots: "Wolne sloty",
    noBookings: "Brak rezerwacji.",
    service: "Usługa",
    customer: "Klient",
    with: "z",
    address: "Adres",
    accepted: "Zaakceptowane",
    completed: "Ukończone",
    canceled: "Anulowane",
    workerAvailability: "Dostępność pracowników",
    hi: "Cześć",
    bookTrusted: "Zarezerwuj zaufanych i niezawodnych sprzątaczy",
    cleanerHomeTitle: "Konto sprzątacza",
    cleanerHomeMessage: "Twoje konto jest zarejestrowane jako sprzątacz. Zamawianie usług jest niedostępne dla kont sprzątaczy.",
    cleanerCannotBook: "Rezerwacja niedostępna",
    cleanerCannotBookMsg: "Konta sprzątaczy nie mogą zamawiać usług sprzątania.",
    registeredCleanerStatus: "Zarejestrowany",
    registeredCleanerProfile: "Profil zarejestrowanego sprzątacza",
    vettedCleaners: "Zweryfikowani sprzątacze",
    sameWeekSlots: "Sloty w tym tygodniu",
    availableNow: "Dostępni teraz",
    selectedRating: "Ocena wybranej osoby",
    registeredAccounts: "Użytkownicy i sprzątacze",
    editAccount: "Edytuj informacje",
    saveAccount: "Zapisz informacje",
    deleteAccount: "Usuń profil",
    resetAccountPassword: "Wyślij email resetowania hasła",
    cleanerAccount: "Sprzątacz",
    userAccount: "Użytkownik",
    accountUpdated: "Konto zaktualizowane",
    accountUpdatedMsg: "Informacje o koncie zostały zaktualizowane.",
    accountDeleted: "Profil usunięty",
    accountDeletedMsg: "Usunięto lokalny profil. Konto Firebase wymaga usunięcia po stronie serwera.",
    resetEmailSent: "Email resetowania hasła wysłany",
    resetEmailSentMsg: "Email resetowania hasła został wysłany na adres konta.",
    firebaseUnavailable: "Firebase niedostępny",
    firebaseUnavailableMsg: "Firebase Authentication jest wymagany do resetowania hasła i bezpiecznego zarządzania kontami.",
    changeAdminPassword: "Zmień hasło administratora",
    currentPassword: "Obecne hasło",
    newPassword: "Nowe hasło",
    confirmPassword: "Potwierdź nowe hasło",
    changePassword: "Zmień hasło",
    passwordsDoNotMatch: "Hasła nie są takie same",
    passwordChanged: "Hasło zmienione",
    passwordChangedMsg: "Hasło administratora zostało pomyślnie zmienione.",
    passwordChangeUnavailable: "Zmiana hasła niedostępna",
    passwordChangeUnavailableMsg: "Połącz Firebase Authentication, aby zmienić hasło administratora.",
    rateCleaner: "Oceń sprzątacza",
    ratingSubmitted: "Dziękujemy za ocenę sprzątacza",
    commentAboutCleaner: "Komentarz o sprzątaczu",
    commentPlaceholder: "Napisz prywatny komentarz o sprzątaczu...",
    saveComment: "Zapisz komentarz",
    commentSaved: "Prywatny komentarz zapisany",
    timeSlot: "Slot czasowy",
    workSlots: "Godziny pracy",
    chooseService: "Wybierz usługę",
    details: "Szczegóły",
    rooms: "Pokoje",
    extras: "Dodatki",
    availableToday: "Dostępne dzisiaj",
    cleaningWorkers: "Sprzątacze",
    estimatedTotal: "Szacunkowa suma",
    serviceSoon: "Ta usługa będzie dostępna wkrótce",
    book: "Zarezerwuj",
    payTheBill: "Zapłać rachunek",
    available: "Dostępny",
    busy: "Zajęty",
    rating: "ocena",
    jobs: "prac",
    orderHistory: "Historia zamówień",
    noPastOrders: "Nie masz poprzednich zamówień.",
    at: "o",
    addressRequired: "Adres jest wymagany",
    addressRequiredMsg: "Proszę wpisz swój adres dla usługi sprzątania.",
    cleanerUnavailable: "Sprzątacz niedostępny",
    cleanerUnavailableMsg: "Wybrany sprzątacz nie jest dostępny o tej godzinie. Wybierz inny slot lub sprzątacza.",
    bookingRequested: "Rezerwacja złożona",
    requested: "Złożone",
    needToPay: "Do zapłaty",
    ordered: "Zamówione",
    carouselDesc1: "Profesjonalne sprzątanie domu i biura",
    carouselDesc2: "Świeże i czyste przestrzenie za każdym razem",
    carouselDesc3: "Zaufane usługi sprzątania",
    start: "Rozpocznij",
    slideTitle1: "Profesjonalne sprzątanie",
    slideTitle2: "Czysto i świeżo",
    slideTitle3: "Dom i biuro",
    homeTab: "Główna",
    profileTab: "Profil",
    myProfile: "Mój profil",
    accountEmail: "Email konta",
    firstNameLastName: "Imię i nazwisko",
    phoneNumber: "Numer telefonu",
    idCard: "Dowód osobisty",
    uploadIdCardImage: "Prześlij zdjęcie dowodu",
    idCardImageUploaded: "Zdjęcie dowodu przesłane",
    idCardImageMissing: "Brak przesłanego zdjęcia dowodu",
    mediaPermissionDenied: "Brak uprawnień",
    mediaPermissionDeniedMsg: "Zezwól na dostęp do biblioteki mediów, aby przesłać zdjęcie dowodu.",
    saveProfile: "Zapisz profil",
    profileSaved: "Profil zapisany",
    profileSavedMsg: "Twoje dane profilowe zostały zaktualizowane.",
    idCardActivation: "Aktywacja dowodu",
    reviewIdCards: "Przegląd przesłanych dowodów",
    markEligible: "Oznacz jako uprawniony",
    markNotEligible: "Oznacz jako nieuprawniony",
    noIdCardRequests: "Brak przesłanych dowodów do weryfikacji.",
    idStatus: "Status dowodu",
    idStatusNotSubmitted: "Nie przesłano",
    idStatusPending: "Oczekuje na weryfikację",
    idStatusApproved: "Uprawniony",
    idStatusRejected: "Nieuprawniony",
    eligibilityRequired: "Wymagana weryfikacja",
    eligibilityRequiredMsg: "Twój dowód musi zostać zatwierdzony przez administratora przed rezerwacją usługi.",
    verificationSubmitted: "Weryfikacja wysłana",
    verificationSubmittedMsg: "Twój dowód został wysłany do weryfikacji administratora.",
    deleteIdCard: "Usuń dowód",
    deleteIdCardTitle: "Usuń dowód",
    deleteIdCardMsg: "Usunąć przesłany dowód tego użytkownika?",
    paymentMethod: "Metoda płatności",
    choosePaymentMethod: "Wybierz metodę płatności",
    payByBlik: "Płać przez BLIK",
    payByBankWire: "Przelew bankowy",
    paymentInstructions: "Proszę zapłać przez BLIK: 731 762 781 lub przelewem bankowym. Po płatności prześlij poniżej paragon/receipt.",
      bankWireAccount: "Numer konta bankowego: 93109018090000000151049070",
    uploadReceipt: "Prześlij dowód płatności",
    receiptUploaded: "Dowód płatności przesłany",
    receiptMissing: "Prześlij dowód płatności, aby potwierdzić zamówienie.",
    paymentRequired: "Wymagana płatność",
    paymentRequiredMsg: "Wybierz metodę płatności i prześlij dowód płatności przed złożeniem zamówienia.",
    activeOrderExists: "Masz aktywne zamówienie",
    activeOrderExistsMsg: "Masz już aktywne zamówienie. Ukończ bieżące zamówienie przed kolejną rezerwacją.",
    serviceArea: "Obszar usług",
    serviceAreaCities: "Miasta w obszarze usług",
    cityPlaceholder: "Wpisz nazwę miasta",
    addCity: "Dodaj miasto",
    saveCity: "Zapisz miasto",
    cancel: "Anuluj",
    deleteCity: "Usuń",
    noCities: "Brak skonfigurowanych miast.",
    cityRequired: "Miasto jest wymagane",
    cityRequiredMsg: "Wpisz nazwę miasta.",
    cityExists: "Miasto już istnieje",
    cityExistsMsg: "To miasto jest już w obszarze usług.",
    removeCityTitle: "Usuń miasto",
    removeCityMsg: "Usunąć to miasto z obszaru usług?",
    supportMessage: "Wiadomość do wsparcia",
    supportToAdmin: "Napisz do administratora, jeśli masz problem.",
    supportPlaceholder: "Opisz swój problem...",
    sendMessage: "Wyślij wiadomość",
    messageRequired: "Wiadomość jest wymagana",
    messageRequiredMsg: "Wpisz wiadomość przed wysłaniem.",
    messageSent: "Wiadomość wysłana",
    messageSentMsg: "Twoja wiadomość została wysłana do administratora.",
    supportInbox: "Skrzynka wsparcia",
    noSupportMessages: "Brak wiadomości wsparcia.",
    supportFromUser: "Użytkownik",
    supportFromCleaner: "Sprzątacz",
    supportFromAdmin: "Administrator",
    supportSendTo: "Wyślij do",
    supportTargetUsers: "Wszyscy użytkownicy",
    supportTargetCleaners: "Wszyscy sprzątacze",
    supportTargetSingle: "Jedno konto",
    recipientRequired: "Wymagany odbiorca",
    recipientRequiredMsg: "Wybierz konto odbiorcy.",
    supportAdminMessageHint: "Wysyłaj aktualizacje wsparcia bezpośrednio do użytkowników i sprzątaczy.",
    supportNoRecipients: "Brak dostępnych zarejestrowanych kont.",
    supportTo: "Do",
    downloadReceipt: "Pobierz potwierdzenie",
    receiptSaved: "Potwierdzenie zapisane",
    receiptSavedMsg: "Zdjęcie potwierdzenia zostało pobrane na urządzenie.",
    receiptSaveFailed: "Pobieranie nieudane",
    receiptSaveFailedMsg: "Nie udało się pobrać zdjęcia potwierdzenia. Spróbuj ponownie.",
  },
  ru: {
    homeClean: "Уборка дома",
    homeCleanSub: "Стандартная уборка для свежего дома",
    officeClean: "Уборка офиса",
    officeCleanSub: "Профессиональная уборка офиса и рабочих пространств",
    deepClean: "Генеральная уборка",
    deepCleanSub: "Тщательная уборка сверху донизу",
    moveInOut: "Переезд",
    moveInOutSub: "Верните депозит или подготовьте новый дом",
    windows: "Окна",
    laundry: "Стирка",
    insideOven: "Внутри духовки",
    refrigerator: "Холодильник",
    closetInside: "Шкаф",
    wardrobe: "Гардероб",
    toilet: "Туалет",
    bath: "Ванная",
    loading: "Загрузка...",
    createAccount: "Создайте аккаунт",
    welcomeBack: "С возвращением",
    login: "Войти",
    register: "Регистрация",
    fullName: "Полное имя",
    registerAsCleaner: "Зарегистрироваться как клинер",
    registerAsCleanerHint: "Отметьте, если хотите работать клинером",
    yourName: "Ваше имя",
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Пароль",
    passwordPlaceholder: "Ваш надежный пароль",
    createAccountBtn: "Создать аккаунт",
    loginBtn: "Войти",
    alreadyHaveAccount: "Уже есть аккаунт? Войти",
    dontHaveAccount: "Нет аккаунта? Зарегистрируйтесь",
    invalidEmail: "Неверный Email",
    invalidEmailMsg: "Пожалуйста, введите корректный адрес email.",
    passwordTooShort: "Пароль слишком короткий",
    passwordTooShortMsg: "Пароль должен содержать минимум 6 символов.",
    nameRequired: "Имя обязательно",
    nameRequiredMsg: "Пожалуйста, введите полное имя для регистрации.",
    accountExists: "Аккаунт уже существует",
    accountExistsMsg: "Аккаунт с таким email уже существует. Пожалуйста, войдите.",
    loginFailed: "Ошибка входа",
    loginFailedMsg: "Неверный email или пароль.",
    verifyEmailTitle: "Подтвердите email",
    verifyEmailMsg: "Мы отправили ссылку для подтверждения на ваш email. Подтвердите email и войдите.",
    emailNotVerified: "Email не подтвержден",
    emailNotVerifiedMsg: "Сначала подтвердите email. Мы отправили новую ссылку для подтверждения.",
    adminDashboard: "Панель администратора",
    manageCleaners: "Управление клинерами",
    workers: "Сотрудники",
    bookings: "Бронирования",
    active: "Активные",
    openSlots: "Свободные слоты",
    noBookings: "Бронирований пока нет.",
    service: "Услуга",
    customer: "Клиент",
    with: "с",
    address: "Адрес",
    accepted: "Принято",
    completed: "Завершено",
    canceled: "Отменено",
    workerAvailability: "Доступность сотрудников",
    hi: "Привет",
    bookTrusted: "Бронируйте надежных и проверенных клинеров",
    cleanerHomeTitle: "Аккаунт клинера",
    cleanerHomeMessage: "Ваш аккаунт зарегистрирован как клинер. Заказ услуг недоступен для аккаунтов клинеров.",
    cleanerCannotBook: "Бронирование недоступно",
    cleanerCannotBookMsg: "Аккаунты клинеров не могут заказывать услуги уборки.",
    registeredCleanerStatus: "Зарегистрирован",
    registeredCleanerProfile: "Профиль зарегистрированного клинера",
    vettedCleaners: "Проверенные клинеры",
    sameWeekSlots: "Слоты на этой неделе",
    availableNow: "Доступны сейчас",
    selectedRating: "Рейтинг выбранного",
    registeredAccounts: "Пользователи и клинеры",
    editAccount: "Изменить информацию",
    saveAccount: "Сохранить информацию",
    deleteAccount: "Удалить профиль",
    resetAccountPassword: "Отправить письмо для сброса пароля",
    cleanerAccount: "Клинер",
    userAccount: "Пользователь",
    accountUpdated: "Аккаунт обновлен",
    accountUpdatedMsg: "Информация аккаунта обновлена.",
    accountDeleted: "Профиль удален",
    accountDeletedMsg: "Локальный профиль удален. Для удаления аккаунта Firebase нужен сервер.",
    resetEmailSent: "Письмо для сброса пароля отправлено",
    resetEmailSentMsg: "Письмо для сброса пароля отправлено на email аккаунта.",
    firebaseUnavailable: "Firebase недоступен",
    firebaseUnavailableMsg: "Firebase Authentication необходим для сброса пароля и безопасного управления аккаунтами.",
    changeAdminPassword: "Изменить пароль администратора",
    currentPassword: "Текущий пароль",
    newPassword: "Новый пароль",
    confirmPassword: "Подтвердите новый пароль",
    changePassword: "Изменить пароль",
    passwordsDoNotMatch: "Пароли не совпадают",
    passwordChanged: "Пароль изменен",
    passwordChangedMsg: "Пароль администратора успешно изменен.",
    passwordChangeUnavailable: "Изменение пароля недоступно",
    passwordChangeUnavailableMsg: "Подключите Firebase Authentication, чтобы изменить пароль администратора.",
    rateCleaner: "Оценить клинера",
    ratingSubmitted: "Спасибо за оценку клинера",
    commentAboutCleaner: "Комментарий о клинере",
    commentPlaceholder: "Напишите личный комментарий о клинере...",
    saveComment: "Сохранить комментарий",
    commentSaved: "Личный комментарий сохранен",
    timeSlot: "Временной слот",
    workSlots: "Рабочие слоты",
    chooseService: "Выберите услугу",
    details: "Детали",
    rooms: "Комнаты",
    extras: "Дополнительно",
    availableToday: "Доступно сегодня",
    cleaningWorkers: "Клинеры",
    estimatedTotal: "Примерная стоимость",
    serviceSoon: "Эта услуга скоро будет доступна",
    book: "Забронировать",
    payTheBill: "Оплатить счет",
    available: "Доступен",
    busy: "Занят",
    rating: "рейтинг",
    jobs: "заказов",
    orderHistory: "История заказов",
    noPastOrders: "У вас нет прошлых заказов.",
    at: "в",
    addressRequired: "Адрес обязателен",
    addressRequiredMsg: "Пожалуйста, введите адрес для услуги уборки.",
    cleanerUnavailable: "Клинер недоступен",
    cleanerUnavailableMsg: "Выбранный клинер недоступен в это время. Выберите другой слот или клинера.",
    bookingRequested: "Запрос на бронирование отправлен",
    requested: "Отправлено",
    needToPay: "Ожидает оплаты",
    ordered: "Заказано",
    carouselDesc1: "Профессиональная уборка для вашего дома и офиса",
    carouselDesc2: "Свежие и чистые пространства каждый раз",
    carouselDesc3: "Надежные клининговые услуги",
    start: "Начать",
    slideTitle1: "Профессиональная уборка",
    slideTitle2: "Чисто и свежо",
    slideTitle3: "Дом и офис",
    homeTab: "Главная",
    profileTab: "Профиль",
    myProfile: "Мой профиль",
    accountEmail: "Email аккаунта",
    firstNameLastName: "Имя и фамилия",
    phoneNumber: "Номер телефона",
    idCard: "Удостоверение личности",
    uploadIdCardImage: "Загрузить фото удостоверения",
    idCardImageUploaded: "Фото удостоверения загружено",
    idCardImageMissing: "Фото удостоверения еще не загружено",
    mediaPermissionDenied: "Доступ запрещен",
    mediaPermissionDeniedMsg: "Разрешите доступ к медиатеке, чтобы загрузить фото удостоверения.",
    saveProfile: "Сохранить профиль",
    profileSaved: "Профиль сохранен",
    profileSavedMsg: "Ваши данные профиля обновлены.",
    idCardActivation: "Активация по удостоверению",
    reviewIdCards: "Проверка загруженных удостоверений",
    markEligible: "Отметить как допущен",
    markNotEligible: "Отметить как недопущен",
    noIdCardRequests: "Нет загруженных удостоверений для проверки.",
    idStatus: "Статус удостоверения",
    idStatusNotSubmitted: "Не загружено",
    idStatusPending: "Ожидает проверки",
    idStatusApproved: "Допущен",
    idStatusRejected: "Недопущен",
    eligibilityRequired: "Требуется допуск",
    eligibilityRequiredMsg: "Ваше удостоверение должно быть одобрено администратором перед бронированием услуги.",
    verificationSubmitted: "Проверка отправлена",
    verificationSubmittedMsg: "Ваше удостоверение отправлено администратору на проверку.",
    deleteIdCard: "Удалить удостоверение",
    deleteIdCardTitle: "Удалить удостоверение",
    deleteIdCardMsg: "Удалить загруженное удостоверение этого пользователя?",
    serviceArea: "Зона обслуживания",
    serviceAreaCities: "Города в зоне обслуживания",
    cityPlaceholder: "Введите название города",
    addCity: "Добавить город",
    saveCity: "Сохранить город",
    cancel: "Отмена",
    deleteCity: "Удалить",
    noCities: "Список городов пока пуст.",
    cityRequired: "Город обязателен",
    cityRequiredMsg: "Пожалуйста, введите название города.",
    cityExists: "Город уже добавлен",
    cityExistsMsg: "Этот город уже есть в зоне обслуживания.",
    removeCityTitle: "Удалить город",
    removeCityMsg: "Удалить этот город из зоны обслуживания?",
    supportMessage: "Сообщение в поддержку",
    supportToAdmin: "Напишите администратору, если у вас есть проблема.",
    supportPlaceholder: "Опишите вашу проблему...",
    sendMessage: "Отправить сообщение",
    messageRequired: "Требуется сообщение",
    messageRequiredMsg: "Пожалуйста, напишите сообщение перед отправкой.",
    messageSent: "Сообщение отправлено",
    messageSentMsg: "Ваше сообщение отправлено администратору.",
    supportInbox: "Входящие поддержки",
    noSupportMessages: "Пока нет сообщений поддержки.",
    supportFromUser: "Пользователь",
    supportFromCleaner: "Клинер",
    supportFromAdmin: "Администратор",
    supportSendTo: "Отправить",
    supportTargetUsers: "Все пользователи",
    supportTargetCleaners: "Все клинеры",
    supportTargetSingle: "Один аккаунт",
    recipientRequired: "Требуется получатель",
    recipientRequiredMsg: "Пожалуйста, выберите аккаунт получателя.",
    supportAdminMessageHint: "Отправляйте обновления поддержки напрямую пользователям и клинерам.",
    supportNoRecipients: "Нет доступных зарегистрированных аккаунтов.",
    supportTo: "Кому",
    downloadReceipt: "Скачать чек",
    receiptSaved: "Чек сохранен",
    receiptSavedMsg: "Изображение чека загружено на устройство.",
    receiptSaveFailed: "Ошибка загрузки",
    receiptSaveFailedMsg: "Не удалось загрузить изображение чека. Попробуйте еще раз.",
  },
};

const services = [
  {
    id: "home",
    titleKey: "homeClean",
    subtitleKey: "homeCleanSub",
    icon: "home",
    basePrice: 45,
  },
  {
    id: "office",
    titleKey: "officeClean",
    subtitleKey: "officeCleanSub",
    icon: "office-building",
    basePrice: 75,
  },
  {
    id: "deep",
    titleKey: "deepClean",
    subtitleKey: "deepCleanSub",
    icon: "spray-bottle",
    basePrice: 90,
  },
  {
    id: "move",
    titleKey: "moveInOut",
    subtitleKey: "moveInOutSub",
    icon: "truck-fast-outline",
    basePrice: 120,
  },
];
const timeSlots = ["09:00", "11:30", "14:00", "16:30"];
const extrasKeys = [
  "windows",
  "laundry",
  "insideOven",
  "refrigerator",
  "closetInside",
  "wardrobe",
  "toilet",
  "bath",
];
const adminAccount = {
  email: (process.env.EXPO_PUBLIC_ADMIN_EMAIL || "").trim().toLowerCase(),
};
const idCardStatuses = {
  notSubmitted: "not_submitted",
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
};
const defaultServiceCities = ["Warsaw", "Krakow", "Gdansk"];

const formatPrice = (amount) => `${amount} PLN`;
const storageKeys = {
  bookings: "cleaner-app-bookings",
  currentUser: "cleaner-app-current-user",
  registeredUsers: "cleaner-app-registered-users",
  language: "cleaner-app-language",
  hasSeenCarousel: "cleaner-app-seen-carousel",
  serviceCities: "cleaner-app-service-cities",
  supportMessages: "cleaner-app-support-messages",
};

const sharedCloudStorageKeys = new Set([
  storageKeys.registeredUsers,
  storageKeys.bookings,
  storageKeys.supportMessages,
  storageKeys.serviceCities,
]);

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(
  (value) => typeof value === "string" && value.trim().length > 0
);

let firebaseApp = null;
let firestoreDb = null;
let firebaseAuth = null;

if (hasFirebaseConfig) {
  try {
    firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    firestoreDb = getFirestore(firebaseApp);
    if (Platform.OS === "web") {
      firebaseAuth = getAuth(firebaseApp);
    } else {
      try {
        firebaseAuth = initializeAuth(firebaseApp, {
          persistence: getReactNativePersistence(AsyncStorage),
        });
      } catch {
        firebaseAuth = getAuth(firebaseApp);
      }
    }
  } catch (error) {
    // If Firebase config is invalid on a build, keep app usable with local storage mode.
    firebaseApp = null;
    firestoreDb = null;
    firebaseAuth = null;
  }
}
const sharedAppStateDoc = firestoreDb
  ? doc(firestoreDb, "cleanerServiceApp", "sharedState")
  : null;

let isCloudStorageAvailable = Boolean(sharedAppStateDoc);

const isCloudBackedKey = (key) =>
  sharedCloudStorageKeys.has(key) && Boolean(sharedAppStateDoc) && isCloudStorageAvailable;

const readStoredValue = async (key, fallback) => {
  if (isCloudBackedKey(key)) {
    try {
      const snapshot = await getDoc(sharedAppStateDoc);
      if (!snapshot.exists()) return fallback;
      const data = snapshot.data();
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : fallback;
    } catch {
      isCloudStorageAvailable = false;
    }
  }

  try {
    const storedValue = await AsyncStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch {
    return fallback;
  }
};

const writeStoredValue = async (key, value) => {
  if (isCloudBackedKey(key)) {
    try {
      await setDoc(
        sharedAppStateDoc,
        {
          [key]: value,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch {
      isCloudStorageAvailable = false;
    }
  }

  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // saving error
  }
};

const removeStoredValue = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // remove error
  }
};

const initialCleaners = [
  {
    id: "amina",
    name: "Amina Yusuf",
    specialty: "Deep cleaning",
    rating: "4.9",
    jobs: 184,
    availability: ["09:00", "11:30", "16:30"],
  },
  {
    id: "daniel",
    name: "Daniel Kovacs",
    specialty: "Move in/out",
    rating: "4.8",
    jobs: 137,
    availability: ["11:30", "14:00"],
  },
  {
    id: "sofia",
    name: "Sofia Martins",
    specialty: "Family homes",
    rating: "5.0",
    jobs: 211,
    availability: ["09:00", "14:00", "16:30"],
  },
];

function AppContent() {
  const [storageReady, setStorageReady] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [cleaners, setCleaners] = useState(initialCleaners);
  const [bookings, setBookings] = useState([]);
  const [supportMessages, setSupportMessages] = useState([]);
  const [supportInboxExpanded, setSupportInboxExpanded] = useState(null);
  const [serviceCities, setServiceCities] = useState(defaultServiceCities);
  const [cityDraft, setCityDraft] = useState("");
  const [editingCity, setEditingCity] = useState(null);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    wantsToBeCleaner: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [authSlideIndex, setAuthSlideIndex] = useState(0);
  const [homeSlideIndex, setHomeSlideIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [hasSeenCarousel, setHasSeenCarousel] = useState(false);
  const [showAddWorkerForm, setShowAddWorkerForm] = useState(false);
  const [newWorkerForm, setNewWorkerForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    availability: [],
  });

  const [selectedService, setSelectedService] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(timeSlots[1]);
  const [selectedCleaner, setSelectedCleaner] = useState(initialCleaners[0]);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [rooms, setRooms] = useState("3");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentReceiptImage, setPaymentReceiptImage] = useState("");
  const [activePaymentBookingId, setActivePaymentBookingId] = useState(null);
  const [pendingPaymentMethod, setPendingPaymentMethod] = useState("");
  const [pendingPaymentReceiptImage, setPendingPaymentReceiptImage] = useState("");
  const [cleanerCommentDrafts, setCleanerCommentDrafts] = useState({});
  const [cleanerRatingDrafts, setCleanerRatingDrafts] = useState({});
  const [supportDraft, setSupportDraft] = useState("");
  const [adminSupportDraft, setAdminSupportDraft] = useState("");
  const [adminSupportTarget, setAdminSupportTarget] = useState("users");
  const [adminSupportRecipientEmail, setAdminSupportRecipientEmail] = useState("");
  const [adminPasswordForm, setAdminPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [editingAccountEmail, setEditingAccountEmail] = useState(null);
  const [accountEditForm, setAccountEditForm] = useState({ name: "", email: "", phone: "" });
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    idCardImage: "",
    cleanerAvailability: [],
  });

  const carouselSlides = [
    {
      id: 0,
      image: require("./assets/images/slide1.jpg"),
      titleKey: "slideTitle1",
    },
    {
      id: 1,
      image: require("./assets/images/slide2.jpg"),
      titleKey: "slideTitle2",
    },
    {
      id: 2,
      image: require("./assets/images/slide3.jpg"),
      titleKey: "slideTitle3",
    },
  ];

  useEffect(() => {
    const loadStorage = async () => {
      setRegisteredUsers(await readStoredValue(storageKeys.registeredUsers, []));
      setCurrentUser(await readStoredValue(storageKeys.currentUser, null));
      setBookings(await readStoredValue(storageKeys.bookings, []));
      setSupportMessages(await readStoredValue(storageKeys.supportMessages, []));
      setServiceCities(await readStoredValue(storageKeys.serviceCities, defaultServiceCities));
      const savedLanguage = await readStoredValue(storageKeys.language, "en");
      setLanguage(savedLanguage);
      const seenCarousel = await readStoredValue(storageKeys.hasSeenCarousel, false);
      setHasSeenCarousel(seenCarousel);
      setStorageReady(true);
    };

    loadStorage();
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    writeStoredValue(storageKeys.registeredUsers, registeredUsers);
  }, [registeredUsers, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    writeStoredValue(storageKeys.bookings, bookings);
  }, [bookings, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    writeStoredValue(storageKeys.supportMessages, supportMessages);
  }, [supportMessages, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    writeStoredValue(storageKeys.serviceCities, serviceCities);
  }, [serviceCities, storageReady]);

  useEffect(() => {
    if (!storageReady) return;

    if (currentUser) {
      writeStoredValue(storageKeys.currentUser, currentUser);
    } else {
      removeStoredValue(storageKeys.currentUser);
    }
  }, [currentUser, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    writeStoredValue(storageKeys.language, language);
  }, [language, storageReady]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "user") return;

    setProfileForm({
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      idCardImage: currentUser.idCardImage || "",
      cleanerAvailability: Array.isArray(currentUser.cleanerAvailability)
        ? currentUser.cleanerAvailability
        : [],
    });
  }, [currentUser]);

  const completeCarousel = async () => {
    setHasSeenCarousel(true);
    await writeStoredValue(storageKeys.hasSeenCarousel, true);
  };

  const refreshAppData = async () => {
    setRefreshing(true);
    try {
      const [savedUsers, savedCurrentUser, savedBookings, savedSupportMessages, savedCities, savedLanguage, seenCarousel] = await Promise.all([
        readStoredValue(storageKeys.registeredUsers, []),
        readStoredValue(storageKeys.currentUser, null),
        readStoredValue(storageKeys.bookings, []),
        readStoredValue(storageKeys.supportMessages, []),
        readStoredValue(storageKeys.serviceCities, defaultServiceCities),
        readStoredValue(storageKeys.language, "en"),
        readStoredValue(storageKeys.hasSeenCarousel, false),
      ]);

      setRegisteredUsers(savedUsers);
      setCurrentUser(savedCurrentUser);
      setBookings(savedBookings);
      setSupportMessages(savedSupportMessages);
      setServiceCities(savedCities);
      setLanguage(savedLanguage);
      setHasSeenCarousel(seenCarousel);
    } finally {
      setRefreshing(false);
    }
  };

  const registeredCleanerUsers = useMemo(
    () =>
      (Array.isArray(registeredUsers) ? registeredUsers : []).filter(
        (user) => user.wantsToBeCleaner && user.email !== adminAccount.email
      ),
    [registeredUsers]
  );

  const registeredCleanerWorkers = useMemo(
    () =>
      registeredCleanerUsers.map((user) => ({
        id: `registered-${user.email}`,
        name: user.name,
        specialty: "General cleaning",
        rating: "5.0",
        jobs: 0,
        availability: Array.isArray(user.cleanerAvailability)
          ? user.cleanerAvailability
          : [],
      })),
    [registeredCleanerUsers]
  );

  const allCleanerWorkers = useMemo(
    () => [...cleaners, ...registeredCleanerWorkers],
    [cleaners, registeredCleanerWorkers]
  );

  const availableCleaners = useMemo(
    () => allCleanerWorkers.filter((cleaner) => cleaner.availability.includes(selectedSlot)),
    [allCleanerWorkers, selectedSlot]
  );

  const selectedCleanerRecord = useMemo(
    () => allCleanerWorkers.find((cleaner) => cleaner.id === selectedCleaner.id) || allCleanerWorkers[0],
    [allCleanerWorkers, selectedCleaner.id]
  );

  const estimate = useMemo(() => {
    if (!selectedService) {
      return 0;
    }

    const roomCount = Math.max(Number.parseInt(rooms, 10) || 1, 1);
    return selectedService.basePrice + roomCount * 12 + selectedExtras.length * 15;
  }, [rooms, selectedExtras.length, selectedService]);

  const userBookings = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return bookings.filter((booking) => booking.customer === currentUser.name);
  }, [bookings, currentUser]);

  const supportRecipientUsers = useMemo(
    () => registeredUsers.filter((user) => user.email !== adminAccount.email),
    [registeredUsers]
  );

  const userSupportMessages = useMemo(() => {
    if (!currentUser || currentUser.role !== "user") {
      return [];
    }

    return supportMessages.filter((item) => {
      if (item.fromType === "admin") {
        if (item.toType === "all_users") {
          return true;
        }

        if (item.toType === "all_cleaners") {
          return Boolean(currentUser.wantsToBeCleaner);
        }

        if (item.toType === "single") {
          return item.toEmail === currentUser.email;
        }

        return false;
      }

      return item.fromEmail === currentUser.email;
    });
  }, [supportMessages, currentUser]);

  useEffect(() => {
    const selectedIsAvailable = availableCleaners.some(
      (cleaner) => cleaner.id === selectedCleaner.id
    );

    if (!selectedIsAvailable && availableCleaners.length > 0) {
      setSelectedCleaner(availableCleaners[0]);
    }
  }, [availableCleaners, selectedCleaner.id]);

  const t = (key) => translations[language][key] || key;

  const languageOptions = [
    { code: "en", label: "EN" },
    { code: "pl", label: "PL" },
    { code: "ru", label: "RU" },
  ];

  const selectLanguage = (code) => {
    setLanguage(code);
    setIsLanguageMenuOpen(false);
  };

  const renderLanguageBar = (variant = "light", containerStyle) => {
    const isHero = variant === "hero";
    const selectedLanguageLabel =
      languageOptions.find((item) => item.code === language)?.label || "EN";

    return (
      <View
        style={[
          styles.languageDropdown,
          isHero ? styles.languageDropdownHero : styles.languageDropdownLight,
          containerStyle,
        ]}
      >
        <Pressable
          onPress={() => setIsLanguageMenuOpen((current) => !current)}
          style={[styles.languageBar, isHero && styles.languageBarHero]}
        >
          <Text style={[styles.languageBarLabel, isHero && styles.languageBarLabelHero]}>
            {selectedLanguageLabel}
          </Text>
          <Ionicons
            name={isLanguageMenuOpen ? "chevron-up" : "chevron-down"}
            size={16}
            color={isHero ? "#0f1419" : "#33524d"}
          />
        </Pressable>

        {isLanguageMenuOpen ? (
          <View style={[styles.languageOptions, isHero && styles.languageOptionsHero]}>
            {languageOptions.map((option) => (
              <Pressable
                key={option.code}
                onPress={() => selectLanguage(option.code)}
                style={[
                  styles.languageOption,
                  language === option.code && styles.languageOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    language === option.code && styles.languageOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>
    );
  };

  const toggleExtra = (extra) => {
    setSelectedExtras((current) =>
      current.includes(extra)
        ? current.filter((item) => item !== extra)
        : [...current, extra]
    );
  };

  const updateAuthField = (field, value) => {
    setAuthForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const switchAuthMode = () => {
    setAuthMode((current) => (current === "login" ? "register" : "login"));
    setShowPassword(false);
  };

  const submitAuth = async () => {
    const name = authForm.name.trim();
    const email = authForm.email.trim().toLowerCase();
    const password = authForm.password;

    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert(t("invalidEmail"), t("invalidEmailMsg"));
      return;
    }

    if (password.length < 6) {
      Alert.alert(t("passwordTooShort"), t("passwordTooShortMsg"));
      return;
    }

    if (authMode === "register") {
      if (!name) {
        Alert.alert(t("nameRequired"), t("nameRequiredMsg"));
        return;
      }

      const accountExists = registeredUsers.some((user) => user.email === email);

      if (accountExists) {
        Alert.alert(t("accountExists"), t("accountExistsMsg"));
        setAuthMode("login");
        return;
      }

      const newUser = {
        name,
        email,
        password: firebaseAuth ? "firebase-auth" : password,
        wantsToBeCleaner: Boolean(authForm.wantsToBeCleaner),
        cleanerAvailability: authForm.wantsToBeCleaner ? [] : undefined,
        phone: "",
        idCardImage: "",
        idCardStatus: idCardStatuses.notSubmitted,
      };

      if (firebaseAuth) {
        try {
          const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
          await sendEmailVerification(credential.user);
          await firebaseSignOut(firebaseAuth);
          setRegisteredUsers((current) => [...current, newUser]);
          setAuthMode("login");
          setAuthForm({ name: "", email: "", password: "", wantsToBeCleaner: false });
          Alert.alert(t("verifyEmailTitle"), t("verifyEmailMsg"));
          return;
        } catch (error) {
          if (error?.code === "auth/email-already-in-use") {
            Alert.alert(t("accountExists"), t("accountExistsMsg"));
            setAuthMode("login");
            return;
          }

          Alert.alert(t("loginFailed"), t("loginFailedMsg"));
          return;
        }
      }

      setRegisteredUsers((current) => [...current, newUser]);
      setSelectedService(null);
      setSelectedExtras([]);
      setCurrentUser({
        name: newUser.name,
        email: newUser.email,
        wantsToBeCleaner: newUser.wantsToBeCleaner,
        cleanerAvailability: newUser.cleanerAvailability,
        phone: newUser.phone,
        idCardImage: newUser.idCardImage,
        idCardStatus: newUser.idCardStatus,
        role: "user",
      });
      setAuthForm({ name: "", email: "", password: "", wantsToBeCleaner: false });
      return;
    }

    if (firebaseAuth) {
      try {
        const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);

        if (!credential.user.emailVerified) {
          await sendEmailVerification(credential.user);
          await firebaseSignOut(firebaseAuth);
          Alert.alert(t("emailNotVerified"), t("emailNotVerifiedMsg"));
          return;
        }

        if (email === adminAccount.email) {
          setCurrentUser({ name: "Admin", email, role: "admin" });
          setAuthForm({ name: "", email: "", password: "", wantsToBeCleaner: false });
          return;
        }
      } catch {
        if (email === adminAccount.email) {
          Alert.alert(t("loginFailed"), t("loginFailedMsg"));
          return;
        }

        Alert.alert(t("loginFailed"), t("loginFailedMsg"));
        return;
      }
    }

    const matchedUser = registeredUsers.find(
      (user) => user.email === email && (firebaseAuth || user.password === password)
    );

    if (!matchedUser && !firebaseAuth) {
      Alert.alert(t("loginFailed"), t("loginFailedMsg"));
      return;
    }

    const ensuredUser =
      matchedUser || {
        name: email.split("@")[0],
        email,
        password: "firebase-auth",
        wantsToBeCleaner: false,
        cleanerAvailability: [],
        phone: "",
        idCardImage: "",
        idCardStatus: idCardStatuses.notSubmitted,
      };

    if (!matchedUser && firebaseAuth) {
      setRegisteredUsers((current) => [...current, ensuredUser]);
    }

    setSelectedService(null);
    setSelectedExtras([]);
    setCurrentUser({
      name: ensuredUser.name,
      email: ensuredUser.email,
      wantsToBeCleaner: Boolean(ensuredUser.wantsToBeCleaner),
      cleanerAvailability: Array.isArray(ensuredUser.cleanerAvailability)
        ? ensuredUser.cleanerAvailability
        : [],
      phone: ensuredUser.phone || "",
      idCardImage: ensuredUser.idCardImage || "",
      idCardStatus: ensuredUser.idCardStatus || idCardStatuses.notSubmitted,
      role: "user",
    });
    setAuthForm({ name: "", email: "", password: "", wantsToBeCleaner: false });
  };

  const logout = async () => {
    if (firebaseAuth) {
      try {
        await firebaseSignOut(firebaseAuth);
      } catch {
        // signout error
      }
    }

    setCurrentUser(null);
    setActiveTab("home");
    setAuthMode("login");
    setAuthForm({ name: "", email: "", password: "", wantsToBeCleaner: false });
    setProfileForm({ name: "", email: "", phone: "", idCardImage: "", cleanerAvailability: [] });
    setSupportDraft("");
    setAdminSupportDraft("");
    setAdminSupportTarget("users");
    setAdminSupportRecipientEmail("");
    setSelectedService(null);
    setSelectedExtras([]);
    setShowPassword(false);
    setAdminPasswordForm({ current: "", next: "", confirm: "" });
  };

  const updateAdminPasswordField = (field, value) => {
    setAdminPasswordForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const changeAdminPassword = async () => {
    const { current, next, confirm } = adminPasswordForm;

    if (
      !firebaseAuth ||
      currentUser?.role !== "admin" ||
      !currentUser?.email
    ) {
      Alert.alert(t("passwordChangeUnavailable"), t("passwordChangeUnavailableMsg"));
      return;
    }

    if (next.length < 6) {
      Alert.alert(t("passwordTooShort"), t("passwordTooShortMsg"));
      return;
    }

    if (next !== confirm) {
      Alert.alert(t("passwordsDoNotMatch"));
      return;
    }

    try {
      let authenticatedUser = firebaseAuth.currentUser;

      if (
        !authenticatedUser ||
        authenticatedUser.email?.toLowerCase() !== currentUser.email.toLowerCase()
      ) {
        const signInResult = await signInWithEmailAndPassword(
          firebaseAuth,
          currentUser.email,
          current
        );
        authenticatedUser = signInResult.user;
      } else {
        const credential = EmailAuthProvider.credential(authenticatedUser.email, current);
        await reauthenticateWithCredential(authenticatedUser, credential);
      }

      await updatePassword(authenticatedUser, next);
      setAdminPasswordForm({ current: "", next: "", confirm: "" });
      Alert.alert(t("passwordChanged"), t("passwordChangedMsg"));
    } catch (error) {
      if (error?.code === "auth/wrong-password" || error?.code === "auth/invalid-credential") {
        Alert.alert(t("loginFailed"), t("loginFailedMsg"));
        return;
      }

      Alert.alert(t("passwordChangeUnavailable"), t("passwordChangeUnavailableMsg"));
    }
  };

  const updateProfileField = (field, value) => {
    setProfileForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const toggleCleanerAvailabilitySlot = (slot) => {
    setProfileForm((current) => {
      const slots = Array.isArray(current.cleanerAvailability)
        ? current.cleanerAvailability
        : [];
      const hasSlot = slots.includes(slot);

      return {
        ...current,
        cleanerAvailability: hasSlot
          ? slots.filter((item) => item !== slot)
          : [...slots, slot],
      };
    });
  };

  const pickIdCardImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(t("mediaPermissionDenied"), t("mediaPermissionDeniedMsg"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 2],
      quality: 0.7,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    updateProfileField("idCardImage", result.assets[0].uri);
  };

  const saveProfile = () => {
    if (!currentUser || currentUser.role !== "user") {
      return;
    }

    const currentIdStatus = currentUser.idCardStatus || idCardStatuses.notSubmitted;
    let nextIdStatus = currentIdStatus;

    if (!profileForm.idCardImage) {
      nextIdStatus = idCardStatuses.notSubmitted;
    } else if (profileForm.idCardImage !== (currentUser.idCardImage || "")) {
      nextIdStatus = idCardStatuses.pending;
    } else if (!Object.values(idCardStatuses).includes(currentIdStatus)) {
      nextIdStatus = idCardStatuses.pending;
    }

    const nextProfile = {
      ...currentUser,
      name: profileForm.name.trim(),
      email: currentUser.email,
      phone: profileForm.phone.trim(),
      idCardImage: profileForm.idCardImage,
      cleanerAvailability: currentUser.wantsToBeCleaner
        ? timeSlots.filter((slot) => profileForm.cleanerAvailability.includes(slot))
        : [],
      idCardStatus: nextIdStatus,
    };

    setCurrentUser(nextProfile);
    setRegisteredUsers((current) =>
      current.map((user) =>
        user.email === currentUser.email
          ? {
              ...user,
              name: nextProfile.name,
              email: nextProfile.email,
              phone: nextProfile.phone,
              idCardImage: nextProfile.idCardImage,
              cleanerAvailability: nextProfile.cleanerAvailability,
              idCardStatus: nextProfile.idCardStatus,
            }
          : user
      )
    );

    if (
      nextIdStatus === idCardStatuses.pending &&
      currentIdStatus !== idCardStatuses.pending
    ) {
      Alert.alert(t("verificationSubmitted"), t("verificationSubmittedMsg"));
      return;
    }

    Alert.alert(t("profileSaved"), t("profileSavedMsg"));
  };

  const pickPaymentReceiptImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(t("mediaPermissionDenied"), t("mediaPermissionDeniedMsg"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 2],
      quality: 0.7,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    setPaymentReceiptImage(result.assets[0].uri);
  };

  const pickPendingPaymentReceiptImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(t("mediaPermissionDenied"), t("mediaPermissionDeniedMsg"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 2],
      quality: 0.7,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    setPendingPaymentReceiptImage(result.assets[0].uri);
  };

  const sendSupportMessage = () => {
    if (!currentUser || currentUser.role !== "user") {
      return;
    }

    const message = supportDraft.trim();

    if (!message) {
      Alert.alert(t("messageRequired"), t("messageRequiredMsg"));
      return;
    }

    const newMessage = {
      id: Date.now().toString(),
      fromName: currentUser.name,
      fromEmail: currentUser.email,
      fromType: currentUser.wantsToBeCleaner ? "cleaner" : "user",
      message,
      createdAt: new Date().toISOString(),
    };

    setSupportMessages((current) => [newMessage, ...current]);
    setSupportDraft("");
    Alert.alert(t("messageSent"), t("messageSentMsg"));
  };

  const sendAdminSupportMessage = () => {
    if (!currentUser || currentUser.role !== "admin") {
      return;
    }

    const message = adminSupportDraft.trim();

    if (!message) {
      Alert.alert(t("messageRequired"), t("messageRequiredMsg"));
      return;
    }

    if (adminSupportTarget === "single" && !adminSupportRecipientEmail) {
      Alert.alert(t("recipientRequired"), t("recipientRequiredMsg"));
      return;
    }

    const newMessage = {
      id: Date.now().toString(),
      fromName: "Admin",
      fromEmail: adminAccount.email,
      fromType: "admin",
      toType:
        adminSupportTarget === "cleaners"
          ? "all_cleaners"
          : adminSupportTarget === "single"
            ? "single"
            : "all_users",
      toEmail: adminSupportTarget === "single" ? adminSupportRecipientEmail : "",
      message,
      createdAt: new Date().toISOString(),
    };

    setSupportMessages((current) => [newMessage, ...current]);
    setAdminSupportDraft("");
    Alert.alert(t("messageSent"), t("messageSentMsg"));
  };

  const openPaymentForm = (bookingId) => {
    const booking = bookings.find((item) => item.id === bookingId);

    if (!booking) {
      return;
    }

    setActivePaymentBookingId((current) => (current === bookingId ? null : bookingId));
    setPendingPaymentMethod(booking.paymentMethod || "");
    setPendingPaymentReceiptImage(booking.paymentReceiptImage || "");
  };

  const submitBookingPayment = (bookingId) => {
    if (!pendingPaymentMethod || !pendingPaymentReceiptImage) {
      Alert.alert(t("paymentRequired"), t("paymentRequiredMsg"));
      return;
    }

    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              status: t("ordered"),
              paymentMethod: pendingPaymentMethod,
              paymentReceiptImage: pendingPaymentReceiptImage,
            }
          : booking
      )
    );

    setActivePaymentBookingId(null);
    setPendingPaymentMethod("");
    setPendingPaymentReceiptImage("");
    Alert.alert(t("bookingRequested"), t("ordered"));
  };

  const bookService = () => {
    if (currentUser.wantsToBeCleaner) {
      Alert.alert(t("cleanerCannotBook"), t("cleanerCannotBookMsg"));
      return;
    }

    if ((currentUser.idCardStatus || idCardStatuses.notSubmitted) !== idCardStatuses.approved) {
      Alert.alert(t("eligibilityRequired"), t("eligibilityRequiredMsg"));
      return;
    }

    if (!address.trim()) {
      Alert.alert(t("addressRequired"), t("addressRequiredMsg"));
      return;
    }

    const hasActiveOrder = userBookings.some(
      (booking) => ![t("completed"), t("canceled")].includes(booking.status)
    );

    if (hasActiveOrder) {
      Alert.alert(t("activeOrderExists"), t("activeOrderExistsMsg"));
      return;
    }

    if (!selectedCleanerRecord.availability.includes(selectedSlot)) {
      Alert.alert(t("cleanerUnavailable"), t("cleanerUnavailableMsg"));
      return;
    }

    if (!selectedService) {
      Alert.alert(t("chooseService"), t("chooseService"));
      return;
    }

    const newBooking = {
      id: Date.now().toString(),
      customer: currentUser.name,
      service: t(selectedService.titleKey),
      cleaner: selectedCleanerRecord.name,
      slot: selectedSlot,
      address: address.trim(),
      total: estimate,
      status: t("needToPay"),
      paymentMethod: "",
      paymentReceiptImage: "",
    };

    setBookings((current) => [newBooking, ...current]);

    Alert.alert(
      t("bookingRequested"),
      `${t("chooseService")}: ${t(selectedService.titleKey)} ${t("with")} ${
        selectedCleanerRecord.name
      } ${t("at")} ${selectedSlot} ${t("estimatedTotal")}: ${formatPrice(estimate)}`
    );
  };

  const updateNewWorkerField = (field, value) => {
    setNewWorkerForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const openAddWorkerForm = () => {
    setShowAddWorkerForm(true);
    setNewWorkerForm({ firstName: "", lastName: "", email: "", phone: "", availability: [] });
  };

  const toggleNewWorkerSlot = (slot) => {
    setNewWorkerForm((current) => {
      const hasSlot = current.availability.includes(slot);

      return {
        ...current,
        availability: hasSlot
          ? current.availability.filter((item) => item !== slot)
          : [...current.availability, slot],
      };
    });
  };

  const saveNewWorker = () => {
    const firstName = newWorkerForm.firstName.trim();
    const lastName = newWorkerForm.lastName.trim();
    const email = newWorkerForm.email.trim();
    const phone = newWorkerForm.phone.trim();

    if (!firstName || !lastName || !email || !phone) {
      Alert.alert("Missing information", "Please fill in all worker details.");
      return;
    }

    const newCleanerId = `custom-${Date.now()}`;

    setCleaners((current) => [
      ...current,
      {
        id: newCleanerId,
        name: `${firstName} ${lastName}`,
        specialty: "General cleaning",
        rating: "5.0",
        jobs: 0,
        availability: newWorkerForm.availability,
      },
    ]);

    setShowAddWorkerForm(false);
    setNewWorkerForm({ firstName: "", lastName: "", email: "", phone: "", availability: [] });
  };

  const toggleCleanerSlot = (cleanerId, slot) => {
    setCleaners((current) =>
      current.map((cleaner) => {
        if (cleaner.id !== cleanerId) {
          return cleaner;
        }

        const hasSlot = cleaner.availability.includes(slot);

        return {
          ...cleaner,
          availability: hasSlot
            ? cleaner.availability.filter((item) => item !== slot) : [...cleaner.availability, slot],
        };
      })
    );
  };

  const updateBookingStatus = (bookingId, status) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId ? { ...booking, status } : booking
      )
    );
  };

  const selectCleanerRating = (bookingId, rating) => {
    setCleanerRatingDrafts((current) => ({
      ...current,
      [bookingId]: rating,
    }));
  };

  const rateCleaner = (bookingId) => {
    const rating = cleanerRatingDrafts[bookingId];

    if (!rating) {
      return;
    }

    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId && booking.status === t("completed")
          ? { ...booking, cleanerRating: rating }
          : booking
      )
    );
    setCleanerRatingDrafts((current) => ({
      ...current,
      [bookingId]: undefined,
    }));
  };

  const saveCleanerComment = (bookingId) => {
    const comment = (cleanerCommentDrafts[bookingId] || "").trim();

    if (!comment) {
      return;
    }

    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId && booking.status === t("completed")
          ? { ...booking, cleanerComment: comment }
          : booking
      )
    );
    setCleanerCommentDrafts((current) => ({
      ...current,
      [bookingId]: "",
    }));
    Alert.alert(t("commentSaved"));
  };

  const normalizeCityName = (value) => value.trim().replace(/\s+/g, " ");

  const startEditingCity = (city) => {
    setEditingCity(city);
    setCityDraft(city);
  };

  const cancelCityEdit = () => {
    setEditingCity(null);
    setCityDraft("");
  };

  const saveCity = () => {
    const normalizedCity = normalizeCityName(cityDraft);

    if (!normalizedCity) {
      Alert.alert(t("cityRequired"), t("cityRequiredMsg"));
      return;
    }

    const cityExists = serviceCities.some(
      (city) =>
        city.toLowerCase() === normalizedCity.toLowerCase() &&
        city.toLowerCase() !== (editingCity || "").toLowerCase()
    );

    if (cityExists) {
      Alert.alert(t("cityExists"), t("cityExistsMsg"));
      return;
    }

    if (editingCity) {
      setServiceCities((current) =>
        current.map((city) => (city === editingCity ? normalizedCity : city))
      );
    } else {
      setServiceCities((current) => [...current, normalizedCity]);
    }

    cancelCityEdit();
  };

  const removeCity = (cityToRemove) => {
    Alert.alert(t("removeCityTitle"), t("removeCityMsg"), [
      {
        text: t("cancel"),
        style: "cancel",
      },
      {
        text: t("deleteCity"),
        style: "destructive",
        onPress: () => {
          setServiceCities((current) =>
            current.filter((city) => city !== cityToRemove)
          );

          if (editingCity === cityToRemove) {
            cancelCityEdit();
          }
        },
      },
    ]);
  };

  const usersWithUploadedId = useMemo(
    () => registeredUsers.filter((user) => Boolean(user.idCardImage)),
    [registeredUsers]
  );

  const getIdStatusLabel = (status) => {
    switch (status) {
      case idCardStatuses.approved:
        return t("idStatusApproved");
      case idCardStatuses.rejected:
        return t("idStatusRejected");
      case idCardStatuses.pending:
        return t("idStatusPending");
      default:
        return t("idStatusNotSubmitted");
    }
  };

  const updateUserEligibility = (email, status) => {
    setRegisteredUsers((current) =>
      current.map((user) =>
        user.email === email
          ? {
              ...user,
              idCardStatus: status,
            }
          : user
      )
    );
  };

  const startEditingAccount = (user) => {
    setEditingAccountEmail(user.email);
    setAccountEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    });
  };

  const saveAccountEdit = (originalEmail) => {
    const name = accountEditForm.name.trim();
    const email = accountEditForm.email.trim().toLowerCase();
    const phone = accountEditForm.phone.trim();

    if (!name || !email) return;

    if (registeredUsers.some((user) => user.email !== originalEmail && user.email === email)) {
      Alert.alert(t("accountExists"), t("accountExistsMsg"));
      return;
    }

    setRegisteredUsers((current) =>
      current.map((user) =>
        user.email === originalEmail ? { ...user, name, email, phone } : user
      )
    );
    setEditingAccountEmail(null);
    Alert.alert(t("accountUpdated"), t("accountUpdatedMsg"));
  };

  const sendAccountPasswordReset = async (email) => {
    if (!firebaseAuth) {
      Alert.alert(t("firebaseUnavailable"), t("firebaseUnavailableMsg"));
      return;
    }

    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      Alert.alert(t("resetEmailSent"), t("resetEmailSentMsg"));
    } catch {
      Alert.alert(t("firebaseUnavailable"), t("firebaseUnavailableMsg"));
    }
  };

  const deleteAccountProfile = (email) => {
    Alert.alert(t("deleteAccount"), t("accountDeletedMsg"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("deleteAccount"),
        style: "destructive",
        onPress: () => {
          setRegisteredUsers((current) => current.filter((user) => user.email !== email));
          setEditingAccountEmail(null);
          Alert.alert(t("accountDeleted"), t("accountDeletedMsg"));
        },
      },
    ]);
  };

  const deleteUserIdCard = (email) => {
    Alert.alert(t("deleteIdCardTitle"), t("deleteIdCardMsg"), [
      {
        text: t("cancel"),
        style: "cancel",
      },
      {
        text: t("deleteIdCard"),
        style: "destructive",
        onPress: () => {
          setRegisteredUsers((current) =>
            current.map((user) =>
              user.email === email
                ? {
                    ...user,
                    idCardImage: "",
                    idCardStatus: idCardStatuses.notSubmitted,
                  }
                : user
            )
          );
        },
      },
    ]);
  };

  if (!storageReady) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={[styles.container, styles.loadingScreen]}>
          <MaterialCommunityIcons name="broom" size={34} color="#103f3a" />
          <Text style={styles.loadingText}>{t("loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Carousel screen (onboarding)
  if (!hasSeenCarousel && storageReady) {
    const currentSlide = carouselSlides[carouselIndex];

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <View style={styles.carouselContainer}>
          <Image source={currentSlide.image} style={styles.carouselImage} />
          <View style={styles.carouselOverlay}>
            <View style={styles.carouselLogoArea}>
              <View style={styles.logoMarkCarousel}>
                <Text style={styles.logoText}>C</Text>
              </View>
              <View>
                <Text style={styles.carouselBrand}>Clevora</Text>
                <Text style={styles.carouselTagline}>CLEANING SERVICES</Text>
              </View>
            </View>

            <View style={styles.carouselContentArea}>
              <Text style={styles.carouselTitle}>{t(currentSlide.titleKey)}</Text>
              {carouselIndex === 0 && (
                <Text style={styles.carouselDescription}>
                  {t("carouselDesc1")}
                </Text>
              )}
              {carouselIndex === 1 && (
                <Text style={styles.carouselDescription}>
                  {t("carouselDesc2")}
                </Text>
              )}
              {carouselIndex === 2 && (
                <Text style={styles.carouselDescription}>
                  {t("carouselDesc3")}
                </Text>
              )}
            </View>

            <View style={styles.carouselDotsArea}>
              <View style={styles.carouselDots}>
                {carouselSlides.map((slide) => (
                  <Pressable
                    key={slide.id}
                    onPress={() => setCarouselIndex(slide.id)}
                    style={[
                      styles.carouselDot,
                      carouselIndex === slide.id && styles.carouselDotActive,
                    ]}
                  />
                ))}
              </View>

              <View style={styles.carouselNavigation}>
                <Pressable
                  onPress={() =>
                    setCarouselIndex((current) => Math.max(0, current - 1))
                  }
                  style={styles.carouselNavButton}
                  disabled={carouselIndex === 0}
                >
                  <Ionicons
                    name="chevron-back-outline"
                    size={24}
                    color={carouselIndex === 0 ? "#ccc" : "#ffffff"}
                  />
                </Pressable>

                {carouselIndex === carouselSlides.length - 1 ? (
                  <Pressable
                    onPress={completeCarousel}
                    style={styles.carouselStartButton}
                  >
                    <Text style={styles.carouselStartButtonText}>
                      {t("start")}
                    </Text>
                    <Ionicons name="arrow-forward-outline" size={20} color="#0f1419" />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() =>
                      setCarouselIndex((current) =>
                        Math.min(carouselSlides.length - 1, current + 1)
                      )
                    }
                    style={styles.carouselNavButton}
                  >
                    <Ionicons name="chevron-forward-outline" size={24} color="#ffffff" />
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentUser) {
    const isRegistering = authMode === "register";

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <View style={styles.authScreen}>
          <View style={styles.authHero}>
            <Image source={carouselSlides[authSlideIndex].image} style={styles.authHeroImage} />
            <View style={styles.authHeroOverlay}>
              <View style={styles.languageSwitcherHero}>
                {renderLanguageBar("hero")}
              </View>

              <View style={styles.authHeroContent}>
                <Text style={styles.authHeroTitle}>{t(carouselSlides[authSlideIndex].titleKey)}</Text>
                <View style={styles.homeSlidesFooter}>
                  <View style={styles.homeSlidesDots}>
                    {carouselSlides.map((slide) => (
                      <Pressable
                        key={slide.id}
                        onPress={() => setAuthSlideIndex(slide.id)}
                        style={[
                          styles.homeSlidesDot,
                          authSlideIndex === slide.id && styles.homeSlidesDotActive,
                        ]}
                      />
                    ))}
                  </View>
                  <View style={styles.homeSlidesNav}>
                    <Pressable
                      onPress={() =>
                        setAuthSlideIndex((current) =>
                          current === 0 ? carouselSlides.length - 1 : current - 1
                        )
                      }
                      style={styles.homeSlidesNavButton}
                    >
                      <Ionicons name="chevron-back-outline" size={18} color="#ffffff" />
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        setAuthSlideIndex((current) =>
                          current === carouselSlides.length - 1 ? 0 : current + 1
                        )
                      }
                      style={styles.homeSlidesNavButton}
                    >
                      <Ionicons name="chevron-forward-outline" size={18} color="#ffffff" />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>

            <Svg viewBox="0 0 1440 180" preserveAspectRatio="none" style={styles.authWave}>
              <Path
                d="M0,64 C220,180 460,0 720,90 C980,180 1220,28 1440,92 L1440,180 L0,180 Z"
                fill="#ffffff"
              />
            </Svg>
          </View>

          <ScrollView
            contentContainerStyle={styles.authScrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refreshAppData}
                tintColor="#7FD356"
                colors={["#7FD356"]}
              />
            }
          >
            <View style={styles.authHeader}>
              <View style={styles.logoMarkLarge}>
                <MaterialCommunityIcons name="broom" size={34} color="#103f3a" />
              </View>
              <Text style={styles.kicker}>Cleaner Service</Text>
              <Text style={styles.authTitle}>
                {isRegistering ? t("createAccount") : t("welcomeBack")}
              </Text>
            </View>
            <View style={styles.authPanel}>
              <View style={styles.authToggle}>
                <Pressable
                  onPress={() => setAuthMode("login")}
                  style={[styles.authToggleButton, !isRegistering && styles.authToggleActive]}
                >
                  <Text
                    style={[
                      styles.authToggleText,
                      !isRegistering && styles.authToggleTextActive,
                    ]}
                  >
                    {t("login")}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setAuthMode("register")}
                  style={[styles.authToggleButton, isRegistering && styles.authToggleActive]}
                >
                  <Text
                    style={[
                      styles.authToggleText,
                      isRegistering && styles.authToggleTextActive,
                    ]}
                  >
                    {t("register")}
                  </Text>
                </Pressable>
              </View>

              {isRegistering && (
                <View style={styles.authField}>
                  <Text style={styles.label}>{t("fullName")}</Text>
                  <TextInput
                    value={authForm.name}
                    onChangeText={(value) => updateAuthField("name", value)}
                    style={styles.input}
                    placeholder={t("yourName")}
                    placeholderTextColor="#7b8c88"
                    autoCapitalize="words"
                  />
                </View>
              )}

              {isRegistering && (
                <Pressable
                  onPress={() =>
                    updateAuthField("wantsToBeCleaner", !authForm.wantsToBeCleaner)
                  }
                  style={styles.cleanerOptionRow}
                >
                  <Ionicons
                    name={authForm.wantsToBeCleaner ? "checkbox" : "square-outline"}
                    size={22}
                    color={authForm.wantsToBeCleaner ? "#7FD356" : "#6f817d"}
                  />
                  <View style={styles.cleanerOptionCopy}>
                    <Text style={styles.cleanerOptionLabel}>{t("registerAsCleaner")}</Text>
                    <Text style={styles.cleanerOptionHint}>{t("registerAsCleanerHint")}</Text>
                  </View>
                </Pressable>
              )}

              <View style={styles.authField}>
                <Text style={styles.label}>{t("email")}</Text>
                <TextInput
                  value={authForm.email}
                  onChangeText={(value) => updateAuthField("email", value)}
                  style={styles.input}
                  placeholder={t("emailPlaceholder")}
                  placeholderTextColor="#7b8c88"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.authField}>
                <Text style={styles.label}>{t("password")}</Text>
                <View style={styles.passwordInputWrap}>
                  <TextInput
                    value={authForm.password}
                    onChangeText={(value) => updateAuthField("password", value)}
                    style={styles.passwordInput}
                    placeholder={t("passwordPlaceholder")}
                    placeholderTextColor="#7b8c88"
                    secureTextEntry={!showPassword}
                  />
                  <Pressable
                    onPress={() => setShowPassword((current) => !current)}
                    style={styles.iconButton}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={21}
                      color="#24605a"
                    />
                  </Pressable>
                </View>
              </View>

              <Pressable onPress={submitAuth} style={styles.authButton}>
                <Ionicons
                  name={isRegistering ? "person-add-outline" : "log-in-outline"}
                  size={20}
                  color="#ffffff"
                />
                <Text style={styles.authButtonText}>
                  {isRegistering ? t("createAccountBtn") : t("loginBtn")}
                </Text>
              </Pressable>

              <Pressable onPress={switchAuthMode} style={styles.authLinkButton}>
                <Text style={styles.authLinkText}>
                  {isRegistering ? t("alreadyHaveAccount") : t("dontHaveAccount")}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  if (currentUser.role === "admin") {
    const activeBookings = bookings.filter((booking) => booking.status !== t("completed"));
    const availableSlotCount = cleaners.reduce(
      (total, cleaner) => total + cleaner.availability.length,
      0
    );

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshAppData}
              tintColor="#7FD356"
              colors={["#7FD356"]}
            />
          }
        >
          <View style={styles.languageSwitcher}>
            {renderLanguageBar("light")}
          </View>

          <View style={styles.header}>
            <View>
              <Text style={styles.kicker}>{t("adminDashboard")}</Text>
              <Text style={styles.title}>{t("manageCleaners")}</Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable onPress={logout} style={styles.iconButton}>
                <Ionicons name="log-out-outline" size={24} color="#103f3a" />
              </Pressable>
            </View>
          </View>

          <View style={styles.adminCard}>
            <Text style={styles.adminCardTitle}>{t("changeAdminPassword")}</Text>
            <TextInput
              value={adminPasswordForm.current}
              onChangeText={(value) => updateAdminPasswordField("current", value)}
              style={styles.adminPasswordInput}
              placeholder={t("currentPassword")}
              placeholderTextColor="#7b8c88"
              secureTextEntry
            />
            <TextInput
              value={adminPasswordForm.next}
              onChangeText={(value) => updateAdminPasswordField("next", value)}
              style={styles.adminPasswordInput}
              placeholder={t("newPassword")}
              placeholderTextColor="#7b8c88"
              secureTextEntry
            />
            <TextInput
              value={adminPasswordForm.confirm}
              onChangeText={(value) => updateAdminPasswordField("confirm", value)}
              style={styles.adminPasswordInput}
              placeholder={t("confirmPassword")}
              placeholderTextColor="#7b8c88"
              secureTextEntry
            />
            <Pressable onPress={changeAdminPassword} style={styles.smallActionButton}>
              <Text style={styles.smallActionText}>{t("changePassword")}</Text>
            </Pressable>
          </View>

          <View style={styles.dashboardBand}>
            <View>
              <Text style={styles.dashboardValue}>{bookings.length}</Text>
              <Text style={styles.dashboardLabel}>{t("bookings")}</Text>
            </View>
            <View style={styles.dashboardDivider} />
            <View>
              <Text style={styles.dashboardValue}>{activeBookings.length}</Text>
              <Text style={styles.dashboardLabel}>{t("active")}</Text>
            </View>
            <View style={styles.dashboardDivider} />
            <View>
              <Text style={styles.dashboardValue}>{availableSlotCount}</Text>
              <Text style={styles.dashboardLabel}>{t("openSlots")}</Text>
            </View>
          </View>

          <SectionTitle title={t("bookings")} />
          <View style={styles.adminList}>
            {bookings.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-clear-outline" size={26} color="#24605a" />
                <Text style={styles.emptyStateText}>{t("noBookings")}</Text>
              </View>
            ) : (
              bookings.map((booking) => (
                <View key={booking.id} style={styles.adminCard}>
                  <View style={styles.adminCardHeader}>
                    <View>
                      <Text style={styles.adminCardTitle}>{booking.service}</Text>
                      <Text style={styles.adminCardText}>
                        {booking.customer} {t("with")} {booking.cleaner}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        booking.status === t("canceled") && styles.statusBadgeCanceled,
                        booking.status === t("needToPay") && styles.statusBadgeNeedToPay,
                        booking.status === t("ordered") && styles.statusBadgeOrdered,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          booking.status === t("canceled") && styles.statusTextCanceled,
                          booking.status === t("needToPay") && styles.statusTextNeedToPay,
                          booking.status === t("ordered") && styles.statusTextOrdered,
                        ]}
                      >
                        {booking.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.adminCardText}>
                    {booking.slot} - {booking.address}
                  </Text>
                  <Text style={styles.adminCardTotal}>{formatPrice(booking.total)}</Text>
                  {booking.cleanerRating ? (
                    <View style={styles.adminRatingBlock}>
                      <Text style={styles.adminCommentLabel}>Customer rating</Text>
                      <View style={styles.ratingStars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Ionicons
                            key={star}
                            name={star <= booking.cleanerRating ? "star" : "star-outline"}
                            size={20}
                            color="#F5B942"
                          />
                        ))}
                      </View>
                    </View>
                  ) : null}
                  {booking.cleanerComment ? (
                    <View style={styles.adminCommentBlock}>
                      <Text style={styles.adminCommentLabel}>{t("commentAboutCleaner")}</Text>
                      <Text style={styles.adminCardText}>{booking.cleanerComment}</Text>
                    </View>
                  ) : null}
                  {booking.paymentReceiptImage ? (
                    <View style={styles.adminReceiptBlock}>
                      <Text style={styles.adminReceiptLabel}>Receipt</Text>
                      <Image source={{ uri: booking.paymentReceiptImage }} style={styles.adminReceiptPreview} />
                    </View>
                  ) : null}
                  <View style={styles.adminActionRow}>
                    {[t("accepted"), t("completed"), t("canceled")].map((status) => (
                      <Pressable
                        key={status}
                        onPress={() => updateBookingStatus(booking.id, status)}
                        style={styles.smallActionButton}
                      >
                        <Text style={styles.smallActionText}>{status}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))
            )}
          </View>

          <Pressable
            onPress={() =>
              setSupportInboxExpanded((current) => {
                const isExpanded = current === null ? supportMessages.length <= 5 : current;
                return !isExpanded;
              })
            }
            style={styles.adminSectionHeader}
          >
            <View>
              <Text style={styles.sectionTitle}>{t("supportInbox")}</Text>
              <Text style={styles.adminCardText}>{supportMessages.length} messages</Text>
            </View>
            <Ionicons
              name={
                (supportInboxExpanded === null ? supportMessages.length <= 5 : supportInboxExpanded)
                  ? "chevron-up-outline"
                  : "chevron-down-outline"
              }
              size={22}
              color="#8ce0c8"
            />
          </Pressable>
          <View style={styles.adminList}>
            {(supportInboxExpanded === null ? supportMessages.length <= 5 : supportInboxExpanded) &&
            supportMessages.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="chatbubble-ellipses-outline" size={26} color="#24605a" />
                <Text style={styles.emptyStateText}>{t("noSupportMessages")}</Text>
              </View>
            ) : (supportInboxExpanded === null ? supportMessages.length <= 5 : supportInboxExpanded) ? (
              supportMessages.map((item) => {
                const sourceLabel =
                  item.fromType === "admin"
                    ? t("supportFromAdmin")
                    : item.fromType === "cleaner"
                      ? t("supportFromCleaner")
                      : t("supportFromUser");

                const targetLabel =
                  item.toType === "all_cleaners"
                    ? t("supportTargetCleaners")
                    : item.toType === "single" && item.toEmail
                      ? item.toEmail
                      : t("supportTargetUsers");

                return (
                  <View key={item.id} style={styles.adminCard}>
                    <View style={styles.adminCardHeader}>
                      <View>
                        <Text style={styles.adminCardTitle}>{item.fromName}</Text>
                        <Text style={styles.adminCardText}>{item.fromEmail}</Text>
                      </View>
                      <View style={styles.supportSourceBadge}>
                        <Text style={styles.supportSourceBadgeText}>{sourceLabel}</Text>
                      </View>
                    </View>
                    {item.fromType === "admin" ? (
                      <Text style={styles.adminCardText}>
                        {t("supportTo")}: {targetLabel}
                      </Text>
                    ) : null}
                    <Text style={styles.supportMessageText}>{item.message}</Text>
                    <Text style={styles.adminCardText}>
                      {new Date(item.createdAt).toLocaleString()}
                    </Text>
                  </View>
                );
              })
            ) : null}
          </View>

          <View style={styles.adminCard}>
            <Text style={styles.adminCardTitle}>{t("supportMessage")}</Text>
            <Text style={styles.adminCardText}>{t("supportAdminMessageHint")}</Text>
            <Text style={styles.adminCardText}>{t("supportSendTo")}</Text>
            <View style={styles.adminSlotRow}>
              <Pressable
                onPress={() => setAdminSupportTarget("users")}
                style={[styles.adminSlotButton, adminSupportTarget === "users" && styles.adminSlotButtonActive]}
              >
                <Text
                  style={[styles.adminSlotText, adminSupportTarget === "users" && styles.adminSlotTextActive]}
                >
                  {t("supportTargetUsers")}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setAdminSupportTarget("cleaners")}
                style={[
                  styles.adminSlotButton,
                  adminSupportTarget === "cleaners" && styles.adminSlotButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.adminSlotText,
                    adminSupportTarget === "cleaners" && styles.adminSlotTextActive,
                  ]}
                >
                  {t("supportTargetCleaners")}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setAdminSupportTarget("single")}
                style={[styles.adminSlotButton, adminSupportTarget === "single" && styles.adminSlotButtonActive]}
              >
                <Text
                  style={[styles.adminSlotText, adminSupportTarget === "single" && styles.adminSlotTextActive]}
                >
                  {t("supportTargetSingle")}
                </Text>
              </Pressable>
            </View>

            {adminSupportTarget === "single" ? (
              <View style={styles.adminSupportRecipientsWrap}>
                {supportRecipientUsers.length === 0 ? (
                  <Text style={styles.adminCardText}>{t("supportNoRecipients")}</Text>
                ) : (
                  <View style={styles.adminSlotRow}>
                    {supportRecipientUsers.map((user) => {
                      const isActive = adminSupportRecipientEmail === user.email;

                      return (
                        <Pressable
                          key={user.email}
                          onPress={() => setAdminSupportRecipientEmail(user.email)}
                          style={[styles.adminSlotButton, isActive && styles.adminSlotButtonActive]}
                        >
                          <Text style={[styles.adminSlotText, isActive && styles.adminSlotTextActive]}>
                            {user.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>
            ) : null}

            <TextInput
              value={adminSupportDraft}
              onChangeText={setAdminSupportDraft}
              style={styles.adminSupportInput}
              placeholder={t("supportPlaceholder")}
              placeholderTextColor="#7a8a98"
              multiline
              textAlignVertical="top"
            />
            <Pressable onPress={sendAdminSupportMessage} style={styles.smallActionButton}>
              <Text style={styles.smallActionText}>{t("sendMessage")}</Text>
            </Pressable>
          </View>

          <View>
            <View style={styles.adminSectionHeader}>
              <SectionTitle title={t("workerAvailability")} />
              <Pressable onPress={() => setShowAddWorkerForm((current) => !current)} style={styles.adminAddButton}>
                <Ionicons name="add-outline" size={20} color="#103f3a" />
              </Pressable>
            </View>
            {showAddWorkerForm ? (
              <View style={styles.adminFormCard}>
                <Text style={styles.adminFormTitle}>Add worker</Text>
                <View style={styles.adminFormRow}>
                  <TextInput
                    value={newWorkerForm.firstName}
                    onChangeText={(value) => updateNewWorkerField("firstName", value)}
                    style={styles.adminInput}
                    placeholder="Name"
                    placeholderTextColor="#7a8a98"
                  />
                  <TextInput
                    value={newWorkerForm.lastName}
                    onChangeText={(value) => updateNewWorkerField("lastName", value)}
                    style={styles.adminInput}
                    placeholder="Surname"
                    placeholderTextColor="#7a8a98"
                  />
                </View>
                <View style={styles.adminFormRow}>
                  <TextInput
                    value={newWorkerForm.email}
                    onChangeText={(value) => updateNewWorkerField("email", value)}
                    style={styles.adminInput}
                    placeholder="Email"
                    placeholderTextColor="#7a8a98"
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  <TextInput
                    value={newWorkerForm.phone}
                    onChangeText={(value) => updateNewWorkerField("phone", value)}
                    style={styles.adminInput}
                    placeholder="Telephone"
                    placeholderTextColor="#7a8a98"
                    keyboardType="phone-pad"
                  />
                </View>
                <Text style={styles.adminFormSubtitle}>Availability</Text>
                <View style={styles.adminSlotRow}>
                  {timeSlots.map((slot) => {
                    const isSelected = newWorkerForm.availability.includes(slot);

                    return (
                      <Pressable
                        key={slot}
                        onPress={() => toggleNewWorkerSlot(slot)}
                        style={[styles.adminSlotButton, isSelected && styles.adminSlotButtonActive]}
                      >
                        <Text style={[styles.adminSlotText, isSelected && styles.adminSlotTextActive]}>
                          {slot}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <View style={styles.adminButtonRow}>
                  <Pressable onPress={saveNewWorker} style={styles.smallActionButton}>
                    <Text style={styles.smallActionText}>Save</Text>
                  </Pressable>
                  <Pressable onPress={() => setShowAddWorkerForm(false)} style={styles.adminGhostButton}>
                    <Text style={styles.adminGhostButtonText}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            ) : null}
            <View style={styles.adminList}>
              {cleaners.map((cleaner) => (
              <View key={cleaner.id} style={styles.adminCard}>
                <View style={styles.adminCardHeader}>
                  <View>
                    <Text style={styles.adminCardTitle}>{cleaner.name}</Text>
                    <Text style={styles.adminCardText}>{cleaner.specialty}</Text>
                  </View>
                  <Text style={styles.adminCardTotal}>{cleaner.rating}</Text>
                </View>
                <View style={styles.adminSlotRow}>
                  {timeSlots.map((slot) => {
                    const hasSlot = cleaner.availability.includes(slot);

                    return (
                      <Pressable
                        key={slot}
                        onPress={() => toggleCleanerSlot(cleaner.id, slot)}
                        style={[
                          styles.adminSlotButton,
                          hasSlot && styles.adminSlotButtonActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.adminSlotText,
                            hasSlot && styles.adminSlotTextActive,
                          ]}
                        >
                          {slot}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
            </View>
          </View>

          <SectionTitle title={t("registeredAccounts")} />
          <View style={styles.adminList}>
            {registeredUsers.filter((user) => user.email !== adminAccount.email).length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={26} color="#24605a" />
                <Text style={styles.emptyStateText}>{t("supportNoRecipients")}</Text>
              </View>
            ) : (
              registeredUsers
                .filter((user) => user.email !== adminAccount.email)
                .map((user) => {
                  const isEditing = editingAccountEmail === user.email;

                  return (
                    <View key={user.email} style={styles.adminCard}>
                      <View style={styles.adminCardHeader}>
                        <View>
                          <Text style={styles.adminCardTitle}>{user.name}</Text>
                          <Text style={styles.adminCardText}>{user.email}</Text>
                        </View>
                        <Text style={styles.supportSourceBadgeText}>
                          {user.wantsToBeCleaner ? t("cleanerAccount") : t("userAccount")}
                        </Text>
                      </View>

                      {isEditing ? (
                        <View style={styles.accountEditForm}>
                          <TextInput
                            value={accountEditForm.name}
                            onChangeText={(value) =>
                              setAccountEditForm((current) => ({ ...current, name: value }))
                            }
                            style={styles.adminInput}
                            placeholder={t("fullName")}
                            placeholderTextColor="#7a8a98"
                          />
                          <TextInput
                            value={accountEditForm.email}
                            onChangeText={(value) =>
                              setAccountEditForm((current) => ({ ...current, email: value }))
                            }
                            style={styles.adminInput}
                            placeholder={t("email")}
                            placeholderTextColor="#7a8a98"
                            autoCapitalize="none"
                            keyboardType="email-address"
                          />
                          <TextInput
                            value={accountEditForm.phone}
                            onChangeText={(value) =>
                              setAccountEditForm((current) => ({ ...current, phone: value }))
                            }
                            style={styles.adminInput}
                            placeholder={t("phoneNumber")}
                            placeholderTextColor="#7a8a98"
                            keyboardType="phone-pad"
                          />
                          <View style={styles.adminActionRow}>
                            <Pressable
                              onPress={() => saveAccountEdit(user.email)}
                              style={styles.smallActionButton}
                            >
                              <Text style={styles.smallActionText}>{t("saveAccount")}</Text>
                            </Pressable>
                            <Pressable
                              onPress={() => setEditingAccountEmail(null)}
                              style={styles.adminGhostButton}
                            >
                              <Text style={styles.adminGhostButtonText}>{t("cancel")}</Text>
                            </Pressable>
                          </View>
                        </View>
                      ) : null}

                      <View style={styles.adminActionRow}>
                        <Pressable
                          onPress={() => startEditingAccount(user)}
                          style={styles.smallActionButton}
                        >
                          <Text style={styles.smallActionText}>{t("editAccount")}</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => sendAccountPasswordReset(user.email)}
                          style={styles.smallActionButton}
                        >
                          <Text style={styles.smallActionText}>{t("resetAccountPassword")}</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => deleteAccountProfile(user.email)}
                          style={[styles.smallActionButton, styles.adminDeleteButton]}
                        >
                          <Text style={styles.smallActionText}>{t("deleteAccount")}</Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                })
            )}
          </View>

          <SectionTitle title={t("serviceArea")} />
          <View style={styles.adminList}>
            <View style={styles.adminCard}>
              <Text style={styles.adminCardText}>{t("serviceAreaCities")}</Text>

              <View style={styles.adminCityEditor}>
                <TextInput
                  value={cityDraft}
                  onChangeText={setCityDraft}
                  style={styles.adminInput}
                  placeholder={t("cityPlaceholder")}
                  placeholderTextColor="#7a8a98"
                />
                <Pressable onPress={saveCity} style={styles.smallActionButton}>
                  <Text style={styles.smallActionText}>
                    {editingCity ? t("saveCity") : t("addCity")}
                  </Text>
                </Pressable>
                {editingCity && (
                  <Pressable onPress={cancelCityEdit} style={styles.adminGhostButton}>
                    <Text style={styles.adminGhostButtonText}>{t("cancel")}</Text>
                  </Pressable>
                )}
              </View>

              <View style={styles.adminCityList}>
                {serviceCities.length === 0 ? (
                  <Text style={styles.emptyStateText}>{t("noCities")}</Text>
                ) : (
                  serviceCities.map((city, index) => (
                    <View key={`${city}-${index}`} style={styles.adminCityItem}>
                      <Text style={styles.adminCityName}>{city}</Text>
                      <View style={styles.adminCityActions}>
                        <Pressable
                          onPress={() => startEditingCity(city)}
                          style={styles.adminCityActionButton}
                        >
                          <Ionicons name="create-outline" size={16} color="#7FD356" />
                        </Pressable>
                        <Pressable
                          onPress={() => removeCity(city)}
                          style={[styles.adminCityActionButton, styles.adminCityActionDanger]}
                        >
                          <Ionicons name="trash-outline" size={16} color="#ff8d8d" />
                        </Pressable>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>
          </View>

          <SectionTitle title={t("idCardActivation")} />
          <View style={styles.adminList}>
            {usersWithUploadedId.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="card-outline" size={26} color="#24605a" />
                <Text style={styles.emptyStateText}>{t("noIdCardRequests")}</Text>
              </View>
            ) : (
              usersWithUploadedId.map((user) => {
                const status = user.idCardStatus || idCardStatuses.pending;
                const isEligible = status === idCardStatuses.approved;
                const isNotEligible = status === idCardStatuses.rejected;
                const isPending = status === idCardStatuses.pending;

                return (
                  <View key={user.email} style={styles.adminCard}>
                    <View style={styles.adminCardHeader}>
                      <View>
                        <Text style={styles.adminCardTitle}>{user.name}</Text>
                        <Text style={styles.adminCardText}>{user.email}</Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          isNotEligible && styles.idStatusNotEligibleBadge,
                          isEligible && styles.idStatusEligibleBadge,
                          isPending && styles.idStatusPendingBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            isNotEligible && styles.idStatusNotEligibleText,
                            isEligible && styles.idStatusEligibleText,
                            isPending && styles.idStatusPendingText,
                          ]}
                        >
                          {getIdStatusLabel(status)}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.adminCardText}>{t("reviewIdCards")}</Text>
                    <Image source={{ uri: user.idCardImage }} style={styles.adminIdPreview} />

                    <View style={styles.adminActionRow}>
                      <Pressable
                        onPress={() => updateUserEligibility(user.email, idCardStatuses.approved)}
                        style={styles.smallActionButton}
                      >
                        <Text style={styles.smallActionText}>{t("markEligible")}</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => updateUserEligibility(user.email, idCardStatuses.rejected)}
                        style={[styles.smallActionButton, styles.adminDangerButton]}
                      >
                        <Text style={styles.smallActionText}>{t("markNotEligible")}</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => deleteUserIdCard(user.email)}
                        style={[styles.smallActionButton, styles.adminDeleteButton]}
                      >
                        <Text style={styles.smallActionText}>{t("deleteIdCard")}</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const isCleanerAccount = Boolean(currentUser.wantsToBeCleaner);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.userScreen}>
        <ScrollView
          contentContainerStyle={[styles.container, styles.userScrollContent]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshAppData}
              tintColor="#7FD356"
              colors={["#7FD356"]}
            />
          }
        >
          <View style={styles.homeTopBar}>
            <View style={styles.homeLogoContainer}>
              <Image source={require("./clevora.png")} style={styles.homeLogoImage} resizeMode="contain" />
            </View>
            <View style={styles.homeLanguageSwitcher}>
              {renderLanguageBar("light")}
            </View>
          </View>

          {activeTab === "home" ? (
            <>
              <View style={styles.header}>
                <View>
                  <Text style={styles.kicker}>{t("hi")}, {currentUser.name}!</Text>
                  <Text style={styles.title}>
                    {isCleanerAccount ? t("cleanerHomeTitle") : t("bookTrusted")}
                  </Text>
                </View>
                <View style={styles.headerActions}>
                  <Pressable onPress={logout} style={styles.iconButton}>
                    <Ionicons name="log-out-outline" size={24} color="#103f3a" />
                  </Pressable>
                </View>
              </View>

              <View style={styles.dashboardBand}>
                <View>
                  <Text style={styles.dashboardValue}>{availableCleaners.length}</Text>
                  <Text style={styles.dashboardLabel}>{t("availableNow")}</Text>
                </View>
                <View style={styles.dashboardDivider} />
                <View>
                  <Text style={styles.dashboardValue}>{selectedCleanerRecord.rating}</Text>
                  <Text style={styles.dashboardLabel}>{t("selectedRating")}</Text>
                </View>
                <View style={styles.dashboardDivider} />
                <View>
                  <Text style={styles.dashboardValue}>{selectedSlot}</Text>
                  <Text style={styles.dashboardLabel}>{t("timeSlot")}</Text>
                </View>
              </View>

              <View style={styles.homeSlidesCard}>
                <Image source={carouselSlides[homeSlideIndex].image} style={styles.homeSlidesImage} />
                <View style={styles.homeSlidesOverlay}>
                  <Text style={styles.homeSlidesTitle}>{t(carouselSlides[homeSlideIndex].titleKey)}</Text>
                  <View style={styles.homeSlidesFooter}>
                    <View style={styles.homeSlidesDots}>
                      {carouselSlides.map((slide) => (
                        <Pressable
                          key={slide.id}
                          onPress={() => setHomeSlideIndex(slide.id)}
                          style={[
                            styles.homeSlidesDot,
                            homeSlideIndex === slide.id && styles.homeSlidesDotActive,
                          ]}
                        />
                      ))}
                    </View>
                    <View style={styles.homeSlidesNav}>
                      <Pressable
                        onPress={() =>
                          setHomeSlideIndex((current) =>
                            current === 0 ? carouselSlides.length - 1 : current - 1
                          )
                        }
                        style={styles.homeSlidesNavButton}
                      >
                        <Ionicons name="chevron-back-outline" size={18} color="#ffffff" />
                      </Pressable>
                      <Pressable
                        onPress={() =>
                          setHomeSlideIndex((current) =>
                            current === carouselSlides.length - 1 ? 0 : current + 1
                          )
                        }
                        style={styles.homeSlidesNavButton}
                      >
                        <Ionicons name="chevron-forward-outline" size={18} color="#ffffff" />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>

              {isCleanerAccount ? (
                <View style={styles.cleanerModeCard}>
                  <Ionicons name="briefcase-outline" size={28} color="#7FD356" />
                  <Text style={styles.cleanerModeTitle}>{t("cleanerHomeTitle")}</Text>
                  <Text style={styles.cleanerModeText}>{t("cleanerHomeMessage")}</Text>
                </View>
              ) : (
                <>
                  <SectionTitle title={t("chooseService")} />
                  <View style={styles.serviceList}>
                    {services.map((service) => {
                      const isActive = selectedService?.id === service.id;
                      const isDisabled = service.id === "move";

                      return (
                        <Pressable
                          key={service.id}
                          disabled={isDisabled}
                          onPress={() => setSelectedService(service)}
                          style={[
                            styles.serviceCard,
                            isActive && styles.serviceCardActive,
                            isDisabled && styles.serviceCardDisabled,
                          ]}
                        >
                          <View
                            style={[
                              styles.serviceIcon,
                              isActive && styles.serviceIconActive,
                              isDisabled && styles.serviceIconDisabled,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name={service.icon}
                              size={24}
                              color={isDisabled ? "#9aa4af" : isActive ? "#ffffff" : "#24605a"}
                            />
                          </View>
                          <View style={styles.serviceCopy}>
                            <Text style={[styles.serviceTitle, isDisabled && styles.serviceTextDisabled]}>
                              {t(service.titleKey)}
                            </Text>
                            <Text style={[styles.serviceSubtitle, isDisabled && styles.serviceTextDisabled]}>
                              {t(service.subtitleKey)}
                            </Text>
                            {isDisabled ? (
                              <Text style={styles.serviceSoonText}>{t("serviceSoon")}</Text>
                            ) : null}
                          </View>
                          <Text style={[styles.servicePrice, isDisabled && styles.servicePriceDisabled]}>
                            {formatPrice(service.basePrice)}+
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <SectionTitle title={t("details")} />
                  <View style={styles.formRow}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>{t("rooms")}</Text>
                      <TextInput
                        keyboardType="number-pad"
                        value={rooms}
                        onChangeText={setRooms}
                        style={styles.input}
                        placeholder="3"
                        placeholderTextColor="#7b8c88"
                      />
                    </View>
                    <View style={styles.inputGroupWide}>
                      <Text style={styles.label}>{t("address")}</Text>
                      <TextInput
                        value={address}
                        onChangeText={setAddress}
                        style={styles.input}
                        placeholder="e.g. 123 Main St, Warsaw"
                        placeholderTextColor="#7b8c88"
                      />
                    </View>
                  </View>

                  <Text style={styles.label}>{t("extras")}</Text>
                  <View style={styles.chipRow}>
                    {extrasKeys.map((extraKey) => {
                      const isActive = selectedExtras.includes(extraKey);

                      return (
                        <Pressable
                          key={extraKey}
                          onPress={() => toggleExtra(extraKey)}
                          style={[styles.chip, isActive && styles.chipActive]}
                        >
                          <Ionicons
                            name={isActive ? "checkmark-circle" : "add-circle-outline"}
                            size={18}
                            color={isActive ? "#ffffff" : "#24605a"}
                          />
                          <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                            {t(extraKey)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <SectionTitle title={t("availableToday")} />
                  <View style={styles.slotGrid}>
                    {timeSlots.map((slot) => {
                      const isActive = selectedSlot === slot;

                      return (
                        <Pressable
                          key={slot}
                          onPress={() => setSelectedSlot(slot)}
                          style={[styles.slot, isActive && styles.slotActive]}
                        >
                          <Text style={[styles.slotText, isActive && styles.slotTextActive]}>
                            {slot}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <SectionTitle title={t("cleaningWorkers")} />
                  <View style={styles.cleanerList}>
                    {allCleanerWorkers.map((cleaner) => {
                      const isAvailable = cleaner.availability.includes(selectedSlot);
                      const isActive = selectedCleaner.id === cleaner.id;
                      const initials = cleaner.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("");

                      return (
                        <Pressable
                          key={cleaner.id}
                          disabled={!isAvailable}
                          onPress={() => setSelectedCleaner(cleaner)}
                          style={[
                            styles.cleanerCard,
                            isActive && styles.cleanerCardActive,
                            !isAvailable && styles.cleanerCardDisabled,
                          ]}
                        >
                          <View style={[styles.cleanerAvatar, isActive && styles.cleanerAvatarActive]}>
                            <Text style={[styles.cleanerInitials, isActive && styles.cleanerInitialsActive]}>
                              {initials}
                            </Text>
                          </View>
                          <View style={styles.cleanerCopy}>
                            <View style={styles.cleanerTitleRow}>
                              <Text style={styles.cleanerName}>{cleaner.name}</Text>
                              <View
                                style={[
                                  styles.availabilityBadge,
                                  isAvailable ? styles.availableBadge : styles.unavailableBadge,
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.availabilityText,
                                    isAvailable ? styles.availableText : styles.unavailableText,
                                  ]}
                                >
                                  {isAvailable ? t("available") : t("busy")}
                                </Text>
                              </View>
                            </View>
                            <Text style={styles.cleanerSpecialty}>{cleaner.specialty}</Text>
                            <View style={styles.cleanerMeta}>
                              <Ionicons name="star" size={15} color="#b7791f" />
                              <Text style={styles.cleanerMetaText}>
                                {cleaner.rating} {t("rating")}
                              </Text>
                              <Text style={styles.cleanerDot}>-</Text>
                              <Text style={styles.cleanerMetaText}>{cleaner.jobs} {t("jobs")}</Text>
                            </View>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>

                  <View style={styles.checkout}>
                    <View>
                      <Text style={styles.estimateLabel}>{t("estimatedTotal")}</Text>
                      {selectedService ? (
                        <Text style={styles.estimate}>{formatPrice(estimate)}</Text>
                      ) : (
                        <View style={styles.estimatePlaceholder} />
                      )}
                    </View>
                    <Pressable onPress={bookService} style={styles.bookButton}>
                      <Ionicons name="checkmark" size={20} color="#ffffff" />
                      <Text style={styles.bookButtonText}>{t("book")}</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </>
          ) : (
            <>
              <View style={styles.header}>
                <View>
                  <Text style={styles.kicker}>{t("hi")}, {currentUser.name}!</Text>
                  <Text style={styles.title}>{t("myProfile")}</Text>
                </View>
                <View style={styles.headerActions}>
                  <Pressable onPress={logout} style={styles.iconButton}>
                    <Ionicons name="log-out-outline" size={24} color="#103f3a" />
                  </Pressable>
                </View>
              </View>

              <View style={styles.profileCard}>
                <View style={styles.profileNameRow}>
                  <Ionicons name="person-circle-outline" size={26} color="#7FD356" />
                  <Text style={styles.profileName}>{profileForm.name || currentUser.name}</Text>
                </View>

                <View style={styles.profileField}>
                  <Text style={styles.label}>{t("firstNameLastName")}</Text>
                  <TextInput
                    value={profileForm.name}
                    onChangeText={(value) => updateProfileField("name", value)}
                    style={styles.input}
                    placeholder={t("firstNameLastName")}
                    placeholderTextColor="#7b8c88"
                  />
                </View>

                <View style={styles.profileField}>
                  <Text style={styles.label}>{t("accountEmail")}</Text>
                  <TextInput
                    value={profileForm.email}
                    editable={false}
                    selectTextOnFocus={false}
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#7b8c88"
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.profileField}>
                  <Text style={styles.label}>{t("phoneNumber")}</Text>
                  <TextInput
                    value={profileForm.phone}
                    onChangeText={(value) => updateProfileField("phone", value)}
                    style={styles.input}
                    placeholder="+48 500 000 000"
                    placeholderTextColor="#7b8c88"
                    keyboardType="phone-pad"
                  />
                </View>

                {currentUser.wantsToBeCleaner && (
                  <View style={styles.profileField}>
                    <Text style={styles.label}>{t("workSlots")}</Text>
                    <View style={styles.profileSlotGrid}>
                      {timeSlots.map((slot) => {
                        const isActive = profileForm.cleanerAvailability.includes(slot);

                        return (
                          <Pressable
                            key={slot}
                            onPress={() => toggleCleanerAvailabilitySlot(slot)}
                            style={[styles.slot, isActive && styles.slotActive]}
                          >
                            <Text style={[styles.slotText, isActive && styles.slotTextActive]}>
                              {slot}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}

                <View style={styles.profileField}>
                  <Text style={styles.label}>{t("idCard")}</Text>
                  <Pressable onPress={pickIdCardImage} style={styles.idCardUploadButton}>
                    <Ionicons name="cloud-upload-outline" size={18} color="#0f1419" />
                    <Text style={styles.idCardUploadButtonText}>{t("uploadIdCardImage")}</Text>
                  </Pressable>
                  <View style={styles.idStatusRow}>
                    <Text style={styles.idStatusLabel}>{t("idStatus")}: </Text>
                    <Text
                      style={[
                        styles.idStatusValue,
                        (currentUser.idCardStatus || idCardStatuses.notSubmitted) ===
                          idCardStatuses.rejected && styles.idStatusNotEligibleText,
                      ]}
                    >
                      {getIdStatusLabel(currentUser.idCardStatus || idCardStatuses.notSubmitted)}
                    </Text>
                  </View>
                  {profileForm.idCardImage ? (
                    (currentUser.idCardStatus || idCardStatuses.notSubmitted) === idCardStatuses.approved ? null : (
                      <View style={styles.idCardPreviewWrap}>
                        <Image source={{ uri: profileForm.idCardImage }} style={styles.idCardPreview} />
                        <Text style={styles.idCardUploadInfo}>{t("idCardImageUploaded")}</Text>
                      </View>
                    )
                  ) : (
                    <Text style={styles.idCardUploadInfo}>{t("idCardImageMissing")}</Text>
                  )}
                </View>

                <Pressable onPress={saveProfile} style={styles.profileSaveButton}>
                  <Ionicons name="save-outline" size={18} color="#0f1419" />
                  <Text style={styles.profileSaveButtonText}>{t("saveProfile")}</Text>
                </Pressable>
              </View>

              <SectionTitle title={t("supportMessage")} />
              <View style={styles.profileCard}>
                <Text style={styles.paymentHint}>{t("supportToAdmin")}</Text>
                <TextInput
                  value={supportDraft}
                  onChangeText={setSupportDraft}
                  style={styles.supportInput}
                  placeholder={t("supportPlaceholder")}
                  placeholderTextColor="#7b8c88"
                  multiline
                  textAlignVertical="top"
                />
                <Pressable onPress={sendSupportMessage} style={styles.profileSaveButton}>
                  <Ionicons name="send-outline" size={18} color="#0f1419" />
                  <Text style={styles.profileSaveButtonText}>{t("sendMessage")}</Text>
                </Pressable>

                <View style={styles.supportUserList}>
                  {userSupportMessages.length === 0 ? (
                    <Text style={styles.idCardUploadInfo}>{t("noSupportMessages")}</Text>
                  ) : (
                    userSupportMessages.map((item) => {
                      const sourceLabel =
                        item.fromType === "admin"
                          ? t("supportFromAdmin")
                          : currentUser.wantsToBeCleaner
                            ? t("supportFromCleaner")
                            : t("supportFromUser");
                      const senderName = item.fromName || sourceLabel;

                      return (
                        <View key={item.id} style={styles.supportUserMessageCard}>
                          <View style={styles.supportUserMessageHeader}>
                            <Text style={styles.supportUserSource}>{senderName}</Text>
                            <Text style={styles.supportUserTime}>
                              {new Date(item.createdAt).toLocaleString()}
                            </Text>
                          </View>
                          <Text style={styles.supportUserMessageText}>{item.message}</Text>
                        </View>
                      );
                    })
                  )}
                </View>
              </View>

              <SectionTitle title={t("orderHistory")} />
              <View style={styles.orderHistoryList}>
                {userBookings.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="receipt-outline" size={26} color="#24605a" />
                    <Text style={styles.emptyStateText}>{t("noPastOrders")}</Text>
                  </View>
                ) : (
                  userBookings.map((booking) => (
                    <View key={booking.id} style={styles.orderHistoryCard}>
                      <View style={styles.orderHistoryHeader}>
                        <View style={styles.orderHistoryCopy}>
                          <Text style={styles.orderHistoryTitle}>{booking.service}</Text>
                          <Text style={styles.orderHistoryText}>
                            {booking.cleaner} {t("at")} {booking.slot}
                          </Text>
                        </View>
                        <Pressable
                          onPress={() => booking.status === t("needToPay") && openPaymentForm(booking.id)}
                          disabled={booking.status !== t("needToPay")}
                        >
                          <View
                            style={[
                              styles.statusBadge,
                              booking.status === t("canceled") && styles.statusBadgeCanceled,
                              booking.status === t("needToPay") && styles.statusBadgeNeedToPay,
                              booking.status === t("ordered") && styles.statusBadgeOrdered,
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusText,
                                booking.status === t("canceled") && styles.statusTextCanceled,
                                booking.status === t("needToPay") && styles.statusTextNeedToPay,
                                booking.status === t("ordered") && styles.statusTextOrdered,
                              ]}
                            >
                              {booking.status}
                            </Text>
                          </View>
                        </Pressable>
                      </View>
                      <Text style={styles.orderHistoryText}>{booking.address}</Text>
                      <Text style={styles.orderHistoryTotal}>{formatPrice(booking.total)}</Text>
                      {booking.status === t("completed") ? (
                        <>
                          {booking.cleanerRating ? (
                            <View style={styles.ratingResult}>
                              <View style={styles.ratingStars}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Ionicons
                                    key={star}
                                    name={star <= booking.cleanerRating ? "star" : "star-outline"}
                                    size={20}
                                    color="#F5B942"
                                  />
                                ))}
                              </View>
                              <Text style={styles.ratingResultText}>{t("ratingSubmitted")}</Text>
                            </View>
                          ) : (
                            <View style={styles.rateCleanerButton}>
                              <View style={styles.ratingStars}>
                                {[1, 2, 3, 4, 5].map((star) => {
                                  const selectedRating = cleanerRatingDrafts[booking.id] || 0;

                                  return (
                                    <Pressable
                                      key={star}
                                      onPress={() => selectCleanerRating(booking.id, star)}
                                      style={styles.ratingStarButton}
                                    >
                                      <Ionicons
                                        name={star <= selectedRating ? "star" : "star-outline"}
                                        size={22}
                                        color="#F5B942"
                                      />
                                    </Pressable>
                                  );
                                })}
                              </View>
                              <Pressable
                                onPress={() => rateCleaner(booking.id)}
                                disabled={!cleanerRatingDrafts[booking.id]}
                                style={[
                                  styles.submitRatingButton,
                                  !cleanerRatingDrafts[booking.id] && styles.submitRatingButtonDisabled,
                                ]}
                              >
                                <Text style={styles.rateCleanerText}>{t("rateCleaner")}</Text>
                              </Pressable>
                            </View>
                          )}
                          {!booking.cleanerComment ? (
                            <View style={styles.cleanerCommentForm}>
                              <Text style={styles.rateCleanerText}>{t("commentAboutCleaner")}</Text>
                              <TextInput
                                value={cleanerCommentDrafts[booking.id] || ""}
                                onChangeText={(value) =>
                                  setCleanerCommentDrafts((current) => ({
                                    ...current,
                                    [booking.id]: value,
                                  }))
                                }
                                style={styles.cleanerCommentInput}
                                placeholder={t("commentPlaceholder")}
                                placeholderTextColor="#7b8c88"
                                multiline
                                textAlignVertical="top"
                              />
                              <Pressable
                                onPress={() => saveCleanerComment(booking.id)}
                                style={styles.saveCommentButton}
                              >
                                <Text style={styles.saveCommentText}>{t("saveComment")}</Text>
                              </Pressable>
                            </View>
                          ) : null}
                        </>
                      ) : null}
                      {activePaymentBookingId === booking.id && booking.status === t("needToPay") && (
                        <View style={styles.paymentCard}>
                          <Text style={styles.label}>{t("paymentMethod")}</Text>
                          <Text style={styles.paymentHint}>{t("paymentInstructions")}</Text>
                          <View style={styles.paymentOptions}>
                            <Pressable
                              onPress={() => setPendingPaymentMethod("blik")}
                              style={[
                                styles.paymentOption,
                                pendingPaymentMethod === "blik" && styles.paymentOptionActive,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.paymentOptionText,
                                  pendingPaymentMethod === "blik" && styles.paymentOptionTextActive,
                                ]}
                              >
                                {t("payByBlik")}
                              </Text>
                            </Pressable>
                            <Pressable
                              onPress={() => setPendingPaymentMethod("bank")}
                              style={[
                                styles.paymentOption,
                                pendingPaymentMethod === "bank" && styles.paymentOptionActive,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.paymentOptionText,
                                  pendingPaymentMethod === "bank" && styles.paymentOptionTextActive,
                                ]}
                              >
                                {t("payByBankWire")}
                              </Text>
                            </Pressable>
                          </View>
                          {pendingPaymentMethod === "bank" ? (
                            <Text style={styles.bankWireAccount}>{t("bankWireAccount")}</Text>
                          ) : null}

                          <Pressable onPress={pickPendingPaymentReceiptImage} style={styles.idCardUploadButton}>
                            <Ionicons name="receipt-outline" size={18} color="#0f1419" />
                            <Text style={styles.idCardUploadButtonText}>{t("uploadReceipt")}</Text>
                          </Pressable>

                          {pendingPaymentReceiptImage ? (
                            <View style={styles.idCardPreviewWrap}>
                              <Image source={{ uri: pendingPaymentReceiptImage }} style={styles.idCardPreview} />
                              <Text style={styles.idCardUploadInfo}>{t("receiptUploaded")}</Text>
                            </View>
                          ) : (
                            <Text style={styles.idCardUploadInfo}>{t("receiptMissing")}</Text>
                          )}

                          <Pressable
                            onPress={() => submitBookingPayment(booking.id)}
                            style={[styles.bookButton, { marginTop: 12 }]}
                          >
                            <Ionicons name="checkmark" size={20} color="#ffffff" />
                            <Text style={styles.bookButtonText}>{t("payTheBill")}</Text>
                          </Pressable>
                        </View>
                      )}
                    </View>
                  ))
                )}
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.bottomNav}>
          <Pressable
            onPress={() => setActiveTab("home")}
            style={[styles.bottomNavItem, activeTab === "home" && styles.bottomNavItemActive]}
          >
            <Ionicons
              name={activeTab === "home" ? "home" : "home-outline"}
              size={20}
              color={activeTab === "home" ? "#0f1419" : "#7a8a98"}
            />
            <Text style={[styles.bottomNavText, activeTab === "home" && styles.bottomNavTextActive]}>
              {t("homeTab")}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("profile")}
            style={[styles.bottomNavItem, activeTab === "profile" && styles.bottomNavItemActive]}
          >
            <Ionicons
              name={activeTab === "profile" ? "person" : "person-outline"}
              size={20}
              color={activeTab === "profile" ? "#0f1419" : "#7a8a98"}
            />
            <Text style={[styles.bottomNavText, activeTab === "profile" && styles.bottomNavTextActive]}>
              {t("profileTab")}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function SectionTitle({ title }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    padding: 20,
    paddingBottom: 32,
  },
  authContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  authScreen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  authHero: {
    height: "56%",
    minHeight: 360,
    maxHeight: 520,
    backgroundColor: "#000000",
    overflow: "hidden",
  },
  authHeroImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  authHeroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.36)",
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 88,
  },
  languageSwitcherHero: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  langButtonHero: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.95)",
  },
  authHeroContent: {
    flex: 1,
    justifyContent: "flex-end",
    gap: 14,
  },
  authHeroTitle: {
    color: "#ffffff",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    maxWidth: "85%",
  },
  authWave: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -1,
    width: "100%",
    height: 92,
  },
  authScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 2,
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingText: {
    color: "#b0b8c0",
    fontSize: 14,
    fontWeight: "800"
  },
  carouselContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  carouselImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  carouselOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "space-between",
    padding: 20,
  },
  carouselLogoArea: {
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoMarkCarousel: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#7FD356",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0f1419",
  },
  carouselBrand: {
    fontSize: 24,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 1,
  },
  carouselTagline: {
    fontSize: 11,
    fontWeight: "700",
    color: "#b0b8c0",
    letterSpacing: 2,
  },
  carouselContentArea: {
    flex: 1,
    justifyContent: "center",
    gap: 12,
  },
  carouselTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#ffffff",
    lineHeight: 40,
  },
  carouselDescription: {
    fontSize: 16,
    fontWeight: "500",
    color: "#e0e0e0",
    lineHeight: 24,
  },
  carouselDotsArea: {
    gap: 24,
  },
  carouselDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  carouselDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  carouselDotActive: {
    backgroundColor: "#7FD356",
    width: 24,
  },
  carouselNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  carouselNavButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  carouselStartButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#7FD356",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  carouselStartButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f1419",
  },
  languageSwitcher: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  languageDropdown: {
    minWidth: 86,
    alignItems: "stretch",
  },
  languageDropdownHero: {
    alignSelf: "flex-end",
  },
  languageDropdownLight: {
    alignSelf: "flex-end",
  },
  languageBar: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce8df",
    backgroundColor: "#eef6f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  languageBarHero: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderColor: "rgba(255, 255, 255, 0.95)",
  },
  languageBarLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#33524d",
  },
  languageBarLabelHero: {
    color: "#0f1419",
  },
  languageOptions: {
    marginTop: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dce8df",
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  languageOptionsHero: {
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderColor: "rgba(255, 255, 255, 0.95)",
  },
  languageOption: {
    minHeight: 34,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#edf2ee",
  },
  languageOptionActive: {
    backgroundColor: "#dff0d4",
  },
  languageOptionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4f6662",
  },
  languageOptionTextActive: {
    color: "#0f1419",
  },
  langButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  langButtonActive: {
    backgroundColor: "#7FD356",
    borderColor: "#7FD356",
  },
  langText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#666666",
  },
  langTextActive: {
    color: "#0f1419",
  },
  authHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoMarkLarge: {
    width: 68,
    height: 68,
    borderRadius: 8,
    backgroundColor: "#7FD356",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  authTitle: {
    color: "#0f1419",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36,
    textAlign: "center",
  },
  authPanel: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    padding: 16,
  },
  authToggle: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 4,
    marginBottom: 18,
  },
  authToggleButton: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  authToggleActive: {
    backgroundColor: "#7FD356",
  },
  authToggleText: {
    color: "#999999",
    fontSize: 14,
    fontWeight: "800",
  },
  authToggleTextActive: {
    color: "#0f1419",
  },
  authField: {
    marginBottom: 14,
  },
  cleanerOptionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: 4,
    marginBottom: 14,
  },
  cleanerOptionCopy: {
    flex: 1,
  },
  cleanerOptionLabel: {
    color: "#0f1419",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
  },
  cleanerOptionHint: {
    color: "#6f817d",
    fontSize: 12,
    lineHeight: 16,
  },
  passwordInputWrap: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    height: 48,
    paddingLeft: 13,
    color: "#0f1419",
    fontSize: 15,
  },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  authButton: {
    height: 52,
    borderRadius: 8,
    backgroundColor: "#7FD356",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  authButtonText: {
    color: "#0f1419",
    fontSize: 16,
    fontWeight: "800",
  },
  authLinkButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  authLinkText: {
    color: "#7FD356",
    fontSize: 14,
    fontWeight: "800",
  },
  userScreen: {
    flex: 1,
  },
  userScrollContent: {
    paddingBottom: 120,
  },
  homeTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: -20,
    marginBottom: 6,
  },
  homeLogoContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: -26,
  },
  homeLanguageSwitcher: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: -15,
  },
  homeLogoImage: {
    width: 245,
    height: 120,
    marginLeft: -36,
    top: 27,
    transform: [{ scale: 1.17 }],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginTop: Platform.OS === "android" ? 18 : 6,
    marginBottom: 22,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  adminSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  adminAddButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#7FD356",
    alignItems: "center",
    justifyContent: "center",
  },
  adminFormCard: {
    backgroundColor: "#1a2332",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a3a48",
    padding: 14,
    marginBottom: 12,
  },
  adminFormTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
  },
  adminFormSubtitle: {
    color: "#b0b8c0",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },
  adminFormRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  adminButtonRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  kicker: {
    color: "#7FD356",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },
  title: {
    color: "#0f1419",
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
    maxWidth: 280,
  },
  logoMark: {
    width: 54,
    height: 54,
    borderRadius: 8,
    backgroundColor: "#7FD356",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryBand: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  summaryItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#d8d8d8",
    marginHorizontal: 10,
  },
  summaryText: {
    color: "#666666",
    fontSize: 13,
    fontWeight: "700",
    flexShrink: 1,
  },
  dashboardBand: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#7FD356",
    borderRadius: 8,
    padding: 16,
    marginBottom: 26,
  },
  dashboardValue: {
    color: "#0f1419",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  dashboardLabel: {
    color: "#0f1419",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
    textAlign: "center",
  },
  dashboardDivider: {
    width: 1,
    height: 34,
    backgroundColor: "#5a9e2f",
    marginHorizontal: 8,
  },
  homeSlidesCard: {
    height: 180,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 24,
    backgroundColor: "#1a2332",
    borderWidth: 1,
    borderColor: "#2a3a48",
  },
  homeSlidesImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  homeSlidesOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.32)",
    justifyContent: "space-between",
    padding: 12,
  },
  homeSlidesTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
    maxWidth: "80%",
    lineHeight: 26,
  },
  homeSlidesFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  homeSlidesDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  homeSlidesDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
  },
  homeSlidesDotActive: {
    width: 20,
    backgroundColor: "#7FD356",
  },
  homeSlidesNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  homeSlidesNavButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.32)",
  },
  sectionTitle: {
    color: "#0f1419",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
    marginTop: 2,
  },
  serviceList: {
    gap: 10,
    marginBottom: 22,
  },
  serviceCard: {
    minHeight: 92,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  serviceCardActive: {
    borderColor: "#7FD356",
    backgroundColor: "#f0fce4",
  },
  serviceCardDisabled: {
    opacity: 0.55,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceIconActive: {
    backgroundColor: "#7FD356",
  },
  serviceIconDisabled: {
    backgroundColor: "#f2f4f7",
  },
  serviceCopy: {
    flex: 1,
  },
  serviceTitle: {
    color: "#0f1419",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  serviceSubtitle: {
    color: "#999999",
    fontSize: 13,
    lineHeight: 18,
  },
  serviceSoonText: {
    marginTop: 6,
    color: "#9aa4af",
    fontSize: 12,
    fontWeight: "700",
  },
  servicePrice: {
    color: "#7FD356",
    fontSize: 15,
    fontWeight: "800",
  },
  servicePriceDisabled: {
    color: "#9aa4af",
  },
  serviceTextDisabled: {
    color: "#9aa4af",
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  inputGroup: {
    width: 86,
  },
  inputGroupWide: {
    flex: 1,
  },
  label: {
    color: "#666666",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 8,
    paddingHorizontal: 13,
    color: "#0f1419",
    fontSize: 15,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 22,
  },
  chip: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    backgroundColor: "#f5f5f5",
  },
  chipActive: {
    backgroundColor: "#7FD356",
    borderColor: "#7FD356",
  },
  chipText: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "700",
  },
  chipTextActive: {
    color: "#0f1419",
  },
  slotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  slot: {
    width: "47%",
    height: 48,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e8e8e8",
    alignItems: "center",
    justifyContent: "center",
  },
  slotActive: {
    backgroundColor: "#7FD356",
    borderColor: "#7FD356",
  },
  slotText: {
    color: "#666666",
    fontSize: 15,
    fontWeight: "800",
  },
  slotTextActive: {
    color: "#0f1419",
  },
  cleanerList: {
    gap: 10,
    marginBottom: 24,
  },
  cleanerCard: {
    minHeight: 96,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cleanerCardActive: {
    borderColor: "#7FD356",
    backgroundColor: "#f0fce4",
  },
  cleanerCardDisabled: {
    opacity: 0.55,
  },
  cleanerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: "#7FD356",
    alignItems: "center",
    justifyContent: "center",
  },
  cleanerAvatarActive: {
    backgroundColor: "#7FD356",
  },
  cleanerInitials: {
    color: "#0f1419",
    fontSize: 15,
    fontWeight: "900",
  },
  cleanerInitialsActive: {
    color: "#0f1419",
  },
  cleanerCopy: {
    flex: 1,
  },
  cleanerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 4,
  },
  cleanerName: {
    flex: 1,
    color: "#0f1419",
    fontSize: 16,
    fontWeight: "800",
  },
  cleanerSpecialty: {
    color: "#999999",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  availabilityBadge: {
    minHeight: 26,
    borderRadius: 8,
    paddingHorizontal: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  availableBadge: {
    backgroundColor: "#7FD356",
  },
  unavailableBadge: {
    backgroundColor: "#3a4a58",
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: "800",
  },
  availableText: {
    color: "#0f1419",
  },
  unavailableText: {
    color: "#b0b8c0",
  },
  cleanerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  cleanerMetaText: {
    color: "#b0b8c0",
    fontSize: 12,
    fontWeight: "700",
  },
  cleanerDot: {
    color: "#7a8a98",
    fontSize: 12,
    fontWeight: "700",
  },
  adminList: {
    gap: 10,
    marginBottom: 24,
  },
  adminCard: {
    backgroundColor: "#1a2332",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a3a48",
    padding: 14,
  },
  adminCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },
  adminCardTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 4,
  },
  adminCardText: {
    color: "#b0b8c0",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  adminPasswordInput: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3d5966",
    backgroundColor: "#101923",
    color: "#ffffff",
    fontSize: 14,
  },
  adminCardTotal: {
    color: "#7FD356",
    fontSize: 16,
    fontWeight: "900",
  },
  adminCommentBlock: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#2a3a48",
    gap: 4,
  },
  adminCommentLabel: {
    color: "#F5B942",
    fontSize: 12,
    fontWeight: "900",
  },
  accountEditForm: {
    marginTop: 8,
    gap: 8,
  },
  adminReceiptBlock: {
    marginTop: 12,
    gap: 6,
  },
  adminReceiptLabel: {
    color: "#b0b8c0",
    fontSize: 12,
    fontWeight: "800",
  },
  adminReceiptPreview: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a3a48",
    backgroundColor: "#0f1419",
  },
  adminReceiptActions: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  statusBadge: {
    minHeight: 28,
    borderRadius: 8,
    backgroundColor: "#3a4a58",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  statusBadgeCanceled: {
    backgroundColor: "#8b2e2e",
  },
  statusBadgeNeedToPay: {
    backgroundColor: "#8a5a12",
  },
  statusBadgeOrdered: {
    backgroundColor: "#174b2b",
  },
  statusText: {
    color: "#7FD356",
    fontSize: 12,
    fontWeight: "900",
  },
  statusTextCanceled: {
    color: "#ff6b6b",
  },
  statusTextNeedToPay: {
    color: "#ffd08a",
  },
  statusTextOrdered: {
    color: "#9ef7b8",
  },
  adminActionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  smallActionButton: {
    minHeight: 36,
    borderRadius: 8,
    backgroundColor: "#7FD356",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  smallActionText: {
    color: "#0f1419",
    fontSize: 12,
    fontWeight: "900",
  },
  adminSlotRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  adminSlotButton: {
    minWidth: 70,
    minHeight: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3a4a58",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  adminSlotButtonActive: {
    backgroundColor: "#7FD356",
    borderColor: "#7FD356",
  },
  adminSlotText: {
    color: "#b0b8c0",
    fontSize: 13,
    fontWeight: "900",
  },
  adminSlotTextActive: {
    color: "#0f1419",
  },
  adminInput: {
    flex: 1,
    height: 42,
    backgroundColor: "#0f1419",
    borderWidth: 1,
    borderColor: "#2a3a48",
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  adminCityEditor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  adminGhostButton: {
    minHeight: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3a4a58",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  adminGhostButtonText: {
    color: "#b0b8c0",
    fontSize: 12,
    fontWeight: "900",
  },
  adminCityList: {
    gap: 8,
  },
  adminCityItem: {
    minHeight: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a3a48",
    backgroundColor: "#0f1419",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  adminCityName: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  adminCityActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  adminCityActionButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3a4a58",
    alignItems: "center",
    justifyContent: "center",
  },
  adminCityActionDanger: {
    borderColor: "#7a2f2f",
  },
  adminDangerButton: {
    backgroundColor: "#f08a8a",
  },
  adminDeleteButton: {
    backgroundColor: "#e15a5a",
  },
  supportSourceBadge: {
    minHeight: 26,
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3a4a58",
  },
  supportSourceBadgeText: {
    color: "#b0b8c0",
    fontSize: 12,
    fontWeight: "800",
  },
  supportMessageText: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  adminSupportRecipientsWrap: {
    marginTop: 8,
    marginBottom: 10,
  },
  adminSupportInput: {
    minHeight: 94,
    backgroundColor: "#0f1419",
    borderWidth: 1,
    borderColor: "#2a3a48",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 10,
  },
  adminIdPreview: {
    width: "100%",
    height: 152,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a3a48",
    backgroundColor: "#0f1419",
    marginTop: 10,
  },
  idStatusPendingBadge: {
    backgroundColor: "#3a4a58",
  },
  idStatusPendingText: {
    color: "#b0b8c0",
  },
  idStatusEligibleBadge: {
    backgroundColor: "#174b2b",
  },
  idStatusEligibleText: {
    color: "#9ef7b8",
  },
  idStatusNotEligibleBadge: {
    backgroundColor: "#8b2e2e",
  },
  idStatusNotEligibleText: {
    color: "#ff8d8d",
  },
  emptyState: {
    minHeight: 112,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a3a48",
    backgroundColor: "#1a2332",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyStateText: {
    color: "#b0b8c0",
    fontSize: 14,
    fontWeight: "800",
  },
  cleanerModeCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a3a48",
    backgroundColor: "#1a2332",
    padding: 18,
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  cleanerModeTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
  },
  cleanerModeText: {
    color: "#b0b8c0",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 20,
  },
  paymentCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    padding: 14,
    marginBottom: 18,
  },
  paymentHint: {
    color: "#666666",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginBottom: 10,
  },
  bankWireAccount: {
    color: "#103f3a",
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 20,
    marginBottom: 10,
  },
  supportInput: {
    minHeight: 100,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 8,
    paddingHorizontal: 13,
    paddingTop: 10,
    color: "#0f1419",
    fontSize: 15,
    marginBottom: 12,
  },
  supportUserList: {
    marginTop: 12,
    gap: 8,
  },
  supportUserMessageCard: {
    borderWidth: 1,
    borderColor: "#e8e8e8",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 10,
  },
  supportUserMessageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  supportUserSource: {
    color: "#24605a",
    fontSize: 12,
    fontWeight: "900",
  },
  supportUserTime: {
    color: "#7a8a98",
    fontSize: 11,
    fontWeight: "700",
  },
  supportUserMessageText: {
    color: "#0f1419",
    fontSize: 14,
    lineHeight: 19,
  },
  paymentOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  paymentOption: {
    minHeight: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8d8d8",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  paymentOptionActive: {
    backgroundColor: "#7FD356",
    borderColor: "#7FD356",
  },
  paymentOptionText: {
    color: "#0f1419",
    fontSize: 13,
    fontWeight: "800",
  },
  paymentOptionTextActive: {
    color: "#0f1419",
  },
  checkout: {
    backgroundColor: "#1a2332",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a3a48",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 24,
  },
  estimateLabel: {
    color: "#b0b8c0",
    fontSize: 13,
    fontWeight: "700",
  },
  estimate: {
    color: "#7FD356",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 2,
  },
  estimatePlaceholder: {
    minHeight: 38,
    marginTop: 2,
  },
  bookButton: {
    minWidth: 116,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#7FD356",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  bookButtonText: {
    color: "#0f1419",
    fontSize: 16,
    fontWeight: "800",
  },
  profileCard: {
    backgroundColor: "#1a2332",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a3a48",
    padding: 14,
    marginBottom: 22,
  },
  profileField: {
    marginBottom: 10,
  },
  profileSlotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 2,
  },
  profileNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  profileName: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
  },
  profileEmail: {
    color: "#b0b8c0",
    fontSize: 15,
    fontWeight: "700",
  },
  profileSaveButton: {
    height: 46,
    borderRadius: 8,
    backgroundColor: "#7FD356",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  profileSaveButtonText: {
    color: "#0f1419",
    fontSize: 14,
    fontWeight: "800",
  },
  idCardUploadButton: {
    height: 44,
    borderRadius: 8,
    backgroundColor: "#7FD356",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },
  idCardUploadButtonText: {
    color: "#0f1419",
    fontSize: 13,
    fontWeight: "800",
  },
  idCardPreviewWrap: {
    marginTop: 10,
    gap: 6,
  },
  idCardPreview: {
    width: "100%",
    height: 138,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a3a48",
    backgroundColor: "#0f1419",
  },
  idCardUploadInfo: {
    color: "#b0b8c0",
    fontSize: 12,
    fontWeight: "700",
  },
  idStatusRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  idStatusLabel: {
    color: "#b0b8c0",
    fontSize: 12,
    fontWeight: "700",
  },
  idStatusValue: {
    color: "#7FD356",
    fontSize: 12,
    fontWeight: "800",
  },
  orderHistoryList: {
    gap: 10,
  },
  orderHistoryCard: {
    backgroundColor: "#1a2332",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a3a48",
    padding: 14,
  },
  orderHistoryHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },
  orderHistoryCopy: {
    flex: 1,
  },
  orderHistoryTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 4,
  },
  orderHistoryText: {
    color: "#b0b8c0",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  orderHistoryTotal: {
    color: "#7FD356",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 10,
  },
  rateCleanerButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F5B942",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  ratingStars: {
    flexDirection: "row",
    gap: 3,
  },
  ratingStarButton: {
    padding: 2,
  },
  submitRatingButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "#273b42",
  },
  submitRatingButtonDisabled: {
    opacity: 0.5,
  },
  rateCleanerText: {
    color: "#F5B942",
    fontSize: 13,
    fontWeight: "900",
  },
  ratingResult: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  ratingResultText: {
    flex: 1,
    color: "#b0b8c0",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
  },
  cleanerCommentForm: {
    marginTop: 12,
    gap: 8,
  },
  cleanerCommentInput: {
    minHeight: 76,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3d5966",
    backgroundColor: "#101923",
    color: "#ffffff",
    fontSize: 13,
  },
  saveCommentButton: {
    alignSelf: "flex-start",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#7FD356",
  },
  saveCommentText: {
    color: "#0f1419",
    fontSize: 12,
    fontWeight: "900",
  },
  bottomNav: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    height: 62,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e8e8e8",
    flexDirection: "row",
    padding: 6,
    gap: 8,
  },
  bottomNavItem: {
    flex: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  bottomNavItemActive: {
    backgroundColor: "#7FD356",
  },
  bottomNavText: {
    color: "#7a8a98",
    fontSize: 12,
    fontWeight: "800",
  },
  bottomNavTextActive: {
    color: "#0f1419",
  },
});
