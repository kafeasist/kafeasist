export const validateName = (name: string) => {
  if (name.length < 2)
    throw new Error("İsim bölümü en az 2 karakter olmalıdır");

  if (name.length > 32)
    throw new Error("İsim bölümü en fazla 64 karakter olmalıdır");
};

export const validateNameLastName = (firstName: string, lastName: string) => {
  if (firstName.length < 2)
    throw new Error("Ad bölümü en az 2 karakter olmalıdır");

  if (lastName.length < 2)
    throw new Error("Soyad bölümü en az 2 karakter olmalıdır");

  if (firstName.length > 20)
    throw new Error("Ad bölümü en fazla 20 karakter olmalıdır");

  if (lastName.length > 20)
    throw new Error("Ad bölümü en fazla 20 karakter olmalıdır");
};

export const validatePhone = (phone: string) => {
  if (!phone.startsWith("5"))
    throw new Error("Telefon numaranızı başında '5' olacak şekilde giriniz");

  if (phone.length !== 10)
    throw new Error("Telefon numarası 10 karakter olmalıdır");

  if (!/^\d+$/.test(phone))
    throw new Error("Telefon numarası sadece rakamlardan oluşmalıdır");
};

export const validateEmail = (email: string) => {
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
    throw new Error("Lütfen geçerli bir e-posta adresi giriniz");
};

export const validatePassword = (password: string) => {
  if (password.length < 8) throw new Error("Şifre en az 8 karakter olmalıdır");
  if (password.length > 24)
    throw new Error("Şifre en fazla 24 karakter olmalıdır");
  if (!/[a-z]/.test(password))
    throw new Error("Şifre en az bir küçük harf içermelidir");
  if (!/[A-Z]/.test(password))
    throw new Error("Şifre en az bir büyük harf içermelidir");
  if (!/[0-9]/.test(password))
    throw new Error("Şifre en az bir rakam içermelidir");
};
